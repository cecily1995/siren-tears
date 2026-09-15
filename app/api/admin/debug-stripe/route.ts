import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function getSiteUrl(request: Request) {
  return new URL(request.url).origin;
}

// One-off diagnostic: ask Stripe directly (via API, not the dashboard UI)
// what's actually happened, so we don't have to keep interpreting
// confusing dashboard screenshots. Visit with the secret appended, e.g.:
//   /api/admin/debug-stripe?secret=YOUR_ADMIN_DEBUG_SECRET
//
// Add &createWebhook=1 to also create the webhook endpoint directly via
// the API (using the exact same key/account this server already uses),
// which sidesteps the Stripe dashboard's confusing "sandbox" switcher --
// the dashboard-created webhook wasn't visible to this account/key at all.
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

  const REQUIRED_EVENTS: Stripe.WebhookEndpointCreateParams.EnabledEvent[] = [
    'checkout.session.completed',
    'checkout.session.expired'
  ];

  const shouldCreateWebhook = url.searchParams.get('createWebhook') === '1';
  const shouldSyncEvents = url.searchParams.get('syncEvents') === '1';
  let createdWebhook: { id: string; url: string; secret: string } | null = null;
  let createWebhookError: string | null = null;
  let syncedEvents: { id: string; enabled_events: string[] } | null = null;

  if (shouldCreateWebhook) {
    const webhookUrl = `${getSiteUrl(request)}/api/webhooks/stripe`;
    try {
      const existing = await stripe.webhookEndpoints.list({ limit: 100 });
      const already = existing.data.find((e) => e.url === webhookUrl);
      if (already) {
        createWebhookError = `An endpoint for ${webhookUrl} already exists (${already.id}) on this account -- not creating a duplicate. Its secret can't be re-shown; if you don't have it, delete it in the dashboard's Webhooks page for THIS account and reload this URL to recreate it.`;
      } else {
        const created = await stripe.webhookEndpoints.create({
          url: webhookUrl,
          enabled_events: REQUIRED_EVENTS
        });
        createdWebhook = { id: created.id, url: created.url, secret: created.secret || '' };
      }
    } catch (err: any) {
      createWebhookError = err?.message || 'Failed to create webhook endpoint';
    }
  }

  // Add &syncEvents=1 to make sure an already-existing endpoint is listening
  // for every event type our code currently handles (useful after adding
  // checkout.session.expired without recreating the whole endpoint).
  if (shouldSyncEvents) {
    const webhookUrl = `${getSiteUrl(request)}/api/webhooks/stripe`;
    try {
      const existing = await stripe.webhookEndpoints.list({ limit: 100 });
      const found = existing.data.find((e) => e.url === webhookUrl);
      if (found) {
        const merged = Array.from(new Set([...(found.enabled_events || []), ...REQUIRED_EVENTS]));
        const updated = await stripe.webhookEndpoints.update(found.id, { enabled_events: merged as any });
        syncedEvents = { id: updated.id, enabled_events: updated.enabled_events };
      } else {
        createWebhookError = `No endpoint found for ${webhookUrl} to sync events on.`;
      }
    } catch (err: any) {
      createWebhookError = err?.message || 'Failed to sync webhook events';
    }
  }

  try {
    const [sessions, events, endpoints] = await Promise.all([
      stripe.checkout.sessions.list({ limit: 5 }),
      stripe.events.list({ limit: 10 }),
      stripe.webhookEndpoints.list({ limit: 10 })
    ]);

    return NextResponse.json({
      ok: true,
      createdWebhook,
      createWebhookError,
      syncedEvents,
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
