import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import Stripe from 'stripe';
import { apiVersion, dataset, projectId } from '@/sanity/env';

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
  const purchaseRequestId = paymentIntent.metadata?.purchaseRequestId;

  if (!purchaseRequestId) {
    return NextResponse.json({ ok: true, skipped: 'no purchaseRequestId in payment intent metadata' });
  }

  if (event.type === 'payment_intent.payment_failed') {
    // Card declined or similar -- release the one-of-one hold immediately
    // so other customers can buy the piece, and mark the order failed.
    // (The customer can still retry with a different card on the same
    // page before this fires, since Stripe only sends this on a hard
    // failure, not every keystroke.)
    try {
      const purchaseRequest = await client.fetch<{ productIds?: string[] } | null>(
        `*[_id == $id][0]{ "productIds": items[].product._ref }`,
        { id: purchaseRequestId }
      );

      await client.patch(purchaseRequestId).set({ paymentStatus: 'failed' }).commit();

      const productIds = (purchaseRequest?.productIds || [])
        .filter((ref): ref is string => Boolean(ref))
        .map((ref) => ref.replace(/^drafts\./, ''));

      await Promise.all(
        productIds.map((id) => client.patch(id).unset(['checkoutLockExpiresAt']).commit().catch(() => undefined))
      );

      return NextResponse.json({ ok: true, purchaseRequestId, releasedHoldsOn: productIds });
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

    await client
      .patch(purchaseRequestId)
      .set({
        paymentStatus: 'paid',
        stripePaymentIntentId: paymentIntent.id,
        paidAt: new Date().toISOString()
      })
      .commit();

    const productIds = (purchaseRequest?.productIds || [])
      .filter((ref): ref is string => Boolean(ref))
      // Defensive: never patch a draft id -- see purchase-request/create-session
      // routes for why this matters.
      .map((ref) => ref.replace(/^drafts\./, ''));

    // Mark sold and release the checkout-time inventory hold (irrelevant
    // now that it's actually sold, but tidy to clear it).
    await Promise.all(
      productIds.map((id) =>
        client.patch(id).set({ status: 'sold' }).unset(['checkoutLockExpiresAt']).commit()
      )
    );

    return NextResponse.json({ ok: true, purchaseRequestId, markedSold: productIds });
  } catch (err) {
    console.error('Stripe webhook processing failed', err);
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}
