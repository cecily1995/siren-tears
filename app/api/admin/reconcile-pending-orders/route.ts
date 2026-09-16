import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import Stripe from 'stripe';
import { apiVersion, dataset, projectId } from '@/sanity/env';

export const runtime = 'nodejs';

// One-off: reconcile purchaseRequest docs stuck at paymentStatus:'pending'
// because the Stripe webhook was, until now, only subscribed to
// checkout.session.* events and never received payment_intent.succeeded/
// payment_intent.payment_failed for these. For each stuck order, look up
// its actual PaymentIntent by the purchaseRequestId we stamped into its
// metadata at creation time, and apply the exact same logic the webhook
// would have applied.
//
// Visit with ?secret=... first (no &apply=1) to preview what would change.
// Add &apply=1 to actually write the updates.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  if (!secret || secret !== process.env.ADMIN_DEBUG_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const apply = url.searchParams.get('apply') === '1';

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const sanityToken = process.env.SANITY_API_WRITE_TOKEN;
  if (!stripeKey || !sanityToken) {
    return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY or SANITY_API_WRITE_TOKEN' }, { status: 503 });
  }
  const stripe = new Stripe(stripeKey);
  const client = createClient({ projectId, dataset, apiVersion, token: sanityToken, useCdn: false });

  const stuck = await client.fetch<
    { _id: string; orderNumber?: string; _createdAt: string; items?: { product?: { _ref?: string } }[] }[]
  >(`*[_type == "purchaseRequest" && paymentStatus == "pending"]{ _id, orderNumber, _createdAt, items[]{ product } }`);

  const results = [];

  for (const order of stuck) {
    // Every PaymentIntent we create carries this order's _id in its own
    // metadata (see /api/checkout/create-session) -- search for it rather
    // than trusting a stored id, since a doc stuck at 'pending' never got
    // stripePaymentIntentId written to it.
    let intent: Stripe.PaymentIntent | undefined;
    try {
      const search = await stripe.paymentIntents.search({
        query: `metadata['purchaseRequestId']:'${order._id}'`,
        limit: 1
      });
      intent = search.data[0];
    } catch (err) {
      results.push({ orderId: order._id, orderNumber: order.orderNumber, outcome: 'search_failed', error: String(err) });
      continue;
    }

    if (!intent) {
      results.push({ orderId: order._id, orderNumber: order.orderNumber, outcome: 'no_payment_intent_found' });
      continue;
    }

    if (intent.status === 'succeeded') {
      const productIds = (order.items || [])
        .map((i) => i.product?._ref)
        .filter((ref): ref is string => Boolean(ref))
        .map((ref) => ref.replace(/^drafts\./, ''));

      const currentProducts = await client.fetch<{ _id: string; _rev: string; status?: string }[]>(
        `*[_id in $ids]{ _id, _rev, status }`,
        { ids: productIds }
      );
      const alreadySold = currentProducts.filter((p) => p.status === 'sold');

      if (alreadySold.length) {
        // Someone else's payment already claimed this piece in the
        // meantime -- refund this one rather than double-fulfil.
        if (apply) {
          try {
            await stripe.refunds.create({ payment_intent: intent.id });
            await client
              .patch(order._id)
              .set({ paymentStatus: 'refunded', orderStatus: 'cancelled', stripePaymentIntentId: intent.id })
              .commit();
          } catch (err) {
            results.push({ orderId: order._id, orderNumber: order.orderNumber, outcome: 'refund_failed', error: String(err) });
            continue;
          }
        }
        results.push({
          orderId: order._id,
          orderNumber: order.orderNumber,
          outcome: apply ? 'refunded_conflict' : 'would_refund_conflict',
          conflictedProductIds: alreadySold.map((p) => p._id)
        });
        continue;
      }

      if (apply) {
        await Promise.all(
          currentProducts.map((p) => client.patch(p._id).set({ status: 'sold' }).commit())
        );
        await client
          .patch(order._id)
          .set({
            paymentStatus: 'paid',
            stripePaymentIntentId: intent.id,
            paidAt: new Date(intent.created * 1000).toISOString()
          })
          .commit();
      }
      results.push({
        orderId: order._id,
        orderNumber: order.orderNumber,
        outcome: apply ? 'marked_paid' : 'would_mark_paid',
        paymentIntentId: intent.id
      });
    } else if (intent.status === 'canceled' || intent.last_payment_error) {
      if (apply) {
        await client.patch(order._id).set({ paymentStatus: 'failed' }).commit();
      }
      results.push({
        orderId: order._id,
        orderNumber: order.orderNumber,
        outcome: apply ? 'marked_failed' : 'would_mark_failed',
        paymentIntentId: intent.id,
        stripeStatus: intent.status
      });
    } else {
      // Still genuinely in progress (customer never completed payment) --
      // leave it alone.
      results.push({
        orderId: order._id,
        orderNumber: order.orderNumber,
        outcome: 'left_pending',
        stripeStatus: intent.status
      });
    }
  }

  return NextResponse.json({ ok: true, applied: apply, totalStuck: stuck.length, results });
}
