import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

// One-off diagnostic: ask Stripe directly (via API, not the dashboard UI)
// what's actually happened, so we don't have to keep interpreting
// confusing dashboard screenshots. Visit with the secret appended, e.g.:
//   /api/admin/debug-stripe?secret=YOUR_SANITY_WEBHOOK_SECRET
export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  const expected = process.env.ADMIN_DEBUG_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ ok: false, error: 'STRIPE_SECRET_KEY not configured on the server' }, { status: 503 });
  }

  try {
    const [sessions, events, endpoints] = await Promise.all([
      stripe.checkout.sessions.list({ limit: 5 }),
      stripe.events.list({ limit: 10 }),
      stripe.webhookEndpoints.list({ limit: 10 })
    ]);

    return NextResponse.json({
      ok: true,
      webhookEndpointsRegisteredOnThisAccount: endpoints.data.map((e) => ({
        id: e.id,
        url: e.url,
        status: e.status,
        enabled_events: e.enabled_events
      })),
      recentCheckoutSessions: sessions.data.map((s) => ({
        id: s.id,
        payment_status: s.payment_status,
        status: s.status,
        created: new Date(s.created * 1000).toISOString(),
        metadata: s.metadata
      })),
      recentEventsOfAnyType: events.data.map((e) => ({
        id: e.id,
        type: e.type,
        created: new Date(e.created * 1000).toISOString()
      }))
    });
  } catch (err: any) {
    console.error('debug-stripe failed', err);
    return NextResponse.json({ ok: false, error: err?.message || 'Internal error' }, { status: 500 });
  }
}
