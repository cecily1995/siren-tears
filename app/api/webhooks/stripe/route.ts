import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import Stripe from 'stripe';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { sendEmail } from '@/lib/email';
import { orderConfirmationEmail } from '@/lib/orderEmail';

export const runtime = 'nodejs';

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId || !dataset) return null;
  return createClient({ apiVersion, dataset, projectId, useCdn: false, token });
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

// Stripe sends the raw request body signed with STRIPE_WEBHOOK_SECRET -- we
// need the untouched text to verify it, so this route reads request.text()
// rather than request.json().
//
// NOTE: this listens for PaymentIntent events now, not Checkout Session
// events -- the embedded Payment Element flow creates a PaymentIntent
// directly (see /api/checkout/create-session) rather than a Checkout
// Session, since card entry happens on our own page instead of a redirect
// to a Stripe-hosted page.
export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const client = getWriteClient();

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ ok: false, error: 'Not configured' }, { status: 503 });
  }
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Sanity not configured' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error('Missing stripe-signature header');
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed', err);
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type !== 'payment_intent.succeeded' && event.type !== 'payment_intent.payment_failed') {
    // We only care about these two -- acknowledge everything else so
    // Stripe doesn't keep retrying events we don't handle.
    return NextResponse.json({ ok: true, skipped: event.type });
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  if (paymentIntent.metadata?.type === 'private_client_membership') {
    const memberId = paymentIntent.metadata.memberId;
    if (!memberId) return NextResponse.json({ ok: true, skipped: 'no memberId' });
    if (event.type === 'payment_intent.succeeded') {
      await client.patch(memberId).set({ isMember: true, tier: 'private', privateClientPaidAt: new Date().toISOString(), privateClientPaymentIntentId: paymentIntent.id }).commit();
    }
    return NextResponse.json({ ok: true, memberId, membershipPayment: event.type });
  }
  const purchaseRequestId = paymentIntent.metadata?.purchaseRequestId;

  if (!purchaseRequestId) {
    return NextResponse.json({ ok: true, skipped: 'no purchaseRequestId in payment intent metadata' });
  }

  if (event.type === 'payment_intent.payment_failed') {
    // Card declined or similar. (The customer can still retry with a
    // different card on the same page before this fires, since Stripe only
    // sends this on a hard failure, not every keystroke.)
    try {
      await client.patch(purchaseRequestId).set({ paymentStatus: 'failed' }).commit();
      return NextResponse.json({ ok: true, purchaseRequestId, markedFailed: true });
    } catch (err) {
      console.error('Stripe webhook (payment_failed) processing failed', err);
      return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
    }
  }

  try {
    const purchaseRequest = await client.fetch<{ productIds?: string[] } | null>(
      `*[_id == $id][0]{ "productIds": items[].product._ref }`,
      { id: purchaseRequestId }
    );

    const productIds = (purchaseRequest?.productIds || [])
      .filter((ref): ref is string => Boolean(ref))
      // Defensive: never patch a draft id -- see purchase-request/create-session
      // routes for why this matters.
      .map((ref) => ref.replace(/^drafts\./, ''));

    // ---- Final check: did someone else's payment for the same piece(s) ----
    // ---- already land first? ------------------------------------------
    // We deliberately don't reserve inventory while a customer is checking
    // out (see create-session) -- this is the one moment that actually
    // decides who gets a one-of-one piece. Try to atomically claim every
    // product with optimistic concurrency (ifRevisionId); if any is already
    // sold, or we lose the race on the write, this payment loses and gets
    // refunded automatically rather than us handing out the same physical
    // item twice.
    const currentProducts = await client.fetch<{ _id: string; _rev: string; status?: string }[]>(
      `*[_id in $ids]{ _id, _rev, status }`,
      { ids: productIds }
    );

    const alreadySold = currentProducts.filter((p) => p.status === 'sold');
    const claimFailures: string[] = [];

    if (!alreadySold.length) {
      for (const p of currentProducts) {
        try {
          await client.patch(p._id).ifRevisionId(p._rev).set({ status: 'sold' }).commit();
        } catch {
          claimFailures.push(p._id);
        }
      }
    }

    if (alreadySold.length || claimFailures.length) {
      // Lost the race -- refund this payment in full and cancel the order
      // rather than leave the customer charged for nothing.
      let refunded = false;
      try {
        await stripe.refunds.create({ payment_intent: paymentIntent.id });
        refunded = true;
      } catch (refundErr) {
        console.error('Auto-refund after inventory conflict failed', refundErr);
      }

      await client
        .patch(purchaseRequestId)
        .set({
          paymentStatus: refunded ? 'refunded' : 'failed',
          orderStatus: 'cancelled',
          stripePaymentIntentId: paymentIntent.id
        })
        .commit();

      return NextResponse.json({
        ok: true,
        purchaseRequestId,
        conflict: true,
        refunded,
        conflictedProductIds: [...alreadySold.map((p) => p._id), ...claimFailures]
      });
    }

    await client
      .patch(purchaseRequestId)
      .set({
        paymentStatus: 'paid',
        stripePaymentIntentId: paymentIntent.id,
        paidAt: new Date().toISOString()
      })
      .commit();

    // Order confirmation email. Never let an email failure affect the
    // webhook's own success response -- the order is already correctly
    // marked paid regardless of whether the email sends.
    try {
      const fullOrder = await client.fetch<{
        orderNumber?: string;
        name?: string;
        email?: string;
        items?: { productName?: string; price?: number }[];
        shippingMethod?: string;
        shippingCost?: number;
        deliveryFirstName?: string;
        deliveryLastName?: string;
        deliveryAddress?: string;
        deliveryCity?: string;
        deliveryRegion?: string;
        deliveryPostalCode?: string;
        country?: string;
      } | null>(
        `*[_id == $id][0]{
          orderNumber, name, email,
          items[]{ productName, price },
          shippingMethod, shippingCost,
          deliveryFirstName, deliveryLastName, deliveryAddress, deliveryCity, deliveryRegion, deliveryPostalCode, country
        }`,
        { id: purchaseRequestId }
      );
      if (fullOrder?.email) {
        const { subject, html } = orderConfirmationEmail(fullOrder);
        const result = await sendEmail({ to: fullOrder.email, subject, html });
        if (!result.ok) {
          console.error('Order confirmation email failed to send', purchaseRequestId, result.error);
        }
      }
    } catch (emailErr) {
      console.error('Order confirmation email step failed', purchaseRequestId, emailErr);
    }

    return NextResponse.json({ ok: true, purchaseRequestId, markedSold: productIds });
  } catch (err) {
    console.error('Stripe webhook processing failed', err);
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}
