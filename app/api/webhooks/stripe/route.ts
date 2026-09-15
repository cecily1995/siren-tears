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

  if (event.type !== 'checkout.session.completed') {
    // We only care about completed payments -- acknowledge everything else
    // so Stripe doesn't keep retrying events we're not handling.
    return NextResponse.json({ ok: true, skipped: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const purchaseRequestId = session.metadata?.purchaseRequestId;

  if (!purchaseRequestId) {
    return NextResponse.json({ ok: true, skipped: 'no purchaseRequestId in session metadata' });
  }

  try {
    const purchaseRequest = await client.fetch<{ productIds?: string[] } | null>(
      `*[_id == $id][0]{ "productIds": items[].product._ref }`,
      { id: purchaseRequestId }
    );

    await client
      .patch(purchaseRequestId)
      .set({
        status: 'paid',
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
        paidAt: new Date().toISOString()
      })
      .commit();

    const productIds = (purchaseRequest?.productIds || [])
      .filter((ref): ref is string => Boolean(ref))
      // Defensive: never patch a draft id -- see purchase-request/create-session
      // routes for why this matters.
      .map((ref) => ref.replace(/^drafts\./, ''));

    await Promise.all(productIds.map((id) => client.patch(id).set({ status: 'sold' }).commit()));

    return NextResponse.json({ ok: true, purchaseRequestId, markedSold: productIds });
  } catch (err) {
    console.error('Stripe webhook processing failed', err);
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}
