import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import Stripe from 'stripe';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { calculateShipping } from '@/lib/shipping';

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

function generateOrderNumber() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ST-${y}${m}${d}-${suffix}`;
}

// How long a "hold" on a one-of-one piece lasts while a customer is going
// through Stripe checkout. Long enough to fill in card details without
// rushing, short enough that an abandoned checkout doesn't lock a piece
// away from other customers for long.
const LOCK_MINUTES = 15;

export async function POST(request: Request) {
  const client = getWriteClient();
  const stripe = getStripe();

  if (!client) {
    return NextResponse.json(
      { ok: false, error: 'Purchase requests are not connected yet. Please email or WhatsApp the studio directly for now.' },
      { status: 503 }
    );
  }
  if (!stripe) {
    return NextResponse.json(
      { ok: false, error: 'Card payments are not set up yet. Please email or WhatsApp the studio directly for now.' },
      { status: 503 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const {
    items,
    name,
    email,
    whatsapp,
    country,
    deliveryFirstName,
    deliveryLastName,
    deliveryCompany,
    deliveryAddress,
    deliveryCity,
    deliveryRegion,
    deliveryPostalCode,
    message,
    locale
  }: {
    items?: {
      productName?: string;
      productSlug?: string;
      price?: number;
      wristSize?: string;
      ringSize?: string;
    }[];
    name?: string;
    email?: string;
    whatsapp?: string;
    country?: string;
    deliveryFirstName?: string;
    deliveryLastName?: string;
    deliveryCompany?: string;
    deliveryAddress?: string;
    deliveryCity?: string;
    deliveryRegion?: string;
    deliveryPostalCode?: string;
    message?: string;
    locale?: string;
  } = body ?? {};

  if (!email || !name) {
    return NextResponse.json(
      { ok: false, error: 'Please include your name and email address.' },
      { status: 400 }
    );
  }
  if (!deliveryAddress || !deliveryCity || !deliveryPostalCode || !country) {
    return NextResponse.json(
      { ok: false, error: 'Please complete your delivery address.' },
      { status: 400 }
    );
  }
  if (!items || !items.length) {
    return NextResponse.json({ ok: false, error: 'Your bag is empty.' }, { status: 400 });
  }
  // Every item needs a price to charge for it -- shouldn't normally happen
  // (prices come from the product itself), but check before ever calling Stripe.
  if (items.some((i) => typeof i.price !== 'number' || i.price <= 0)) {
    return NextResponse.json(
      { ok: false, error: 'One of the items in your bag is missing a price. Please refresh and try again.' },
      { status: 400 }
    );
  }

  try {
    // Resolve each product by slug so we can link a real reference. Always
    // exclude drafts -- a draft reference makes the draft undeletable later.
    const slugs = items.map((i) => i.productSlug).filter(Boolean) as string[];
    const products = slugs.length
      ? await client.fetch<{ _id: string; slug?: string }[]>(
          `*[_type == "shopProduct" && !(_id in path("drafts.**")) && slug.current in $slugs]{ _id, "slug": slug.current }`,
          { slugs }
        )
      : [];
    const productIdBySlug = new Map(products.map((p) => [p.slug, p._id]));

    // Every item must resolve to a real, currently-existing product -- we
    // can't safely reserve inventory for something we can't identify.
    const unresolvedItem = items.find((i) => !i.productSlug || !productIdBySlug.get(i.productSlug));
    if (unresolvedItem) {
      return NextResponse.json(
        {
          ok: false,
          error: `"${unresolvedItem.productName || 'An item'}" in your bag could not be found. Please refresh your bag and try again.`
        },
        { status: 409 }
      );
    }

    // ---- One-of-one inventory lock (prevents overselling) -----------------
    // Every piece is unique, so two customers must never both be able to pay
    // for the same one. Before creating a Stripe session, put a short-lived
    // hold on each product using optimistic concurrency: fetch the current
    // revision, then patch conditioned on that exact revision. If someone
    // else grabbed the same product between our fetch and our patch, the
    // conditioned patch fails and we know to reject this checkout instead of
    // silently racing them.
    const productIds = Array.from(new Set(items.map((i) => productIdBySlug.get(i.productSlug!) as string)));
    const now = new Date();
    const lockExpiresAt = new Date(now.getTime() + LOCK_MINUTES * 60 * 1000).toISOString();

    const currentProducts = await client.fetch<
      { _id: string; _rev: string; status?: string; checkoutLockExpiresAt?: string; name?: string }[]
    >(`*[_id in $ids]{ _id, _rev, status, checkoutLockExpiresAt, name }`, { ids: productIds });
    const currentById = new Map(currentProducts.map((p) => [p._id, p]));

    const unavailableNames: string[] = [];
    const claimedIds: string[] = [];

    for (const productId of productIds) {
      const current = currentById.get(productId);
      if (!current) {
        unavailableNames.push('an item in your bag');
        continue;
      }
      const isLocked = Boolean(current.checkoutLockExpiresAt && new Date(current.checkoutLockExpiresAt) > now);
      if (current.status !== 'available' || isLocked) {
        unavailableNames.push(current.name || 'an item in your bag');
        continue;
      }
      try {
        await client
          .patch(productId)
          .ifRevisionId(current._rev)
          .set({ checkoutLockExpiresAt: lockExpiresAt })
          .commit();
        claimedIds.push(productId);
      } catch {
        // Someone else claimed it in the split second between our read and
        // our write -- treat exactly like "unavailable".
        unavailableNames.push(current.name || 'an item in your bag');
      }
    }

    if (unavailableNames.length) {
      // Don't leave a partial hold in place if the overall checkout can't proceed.
      await Promise.all(
        claimedIds.map((id) =>
          client.patch(id).unset(['checkoutLockExpiresAt']).commit().catch(() => undefined)
        )
      );
      return NextResponse.json(
        {
          ok: false,
          error: `Sorry, ${unavailableNames.join(', ')} just became unavailable. Please remove it from your bag and try again.`
        },
        { status: 409 }
      );
    }

    // ---- Everything's locked in our favour -- build the order -------------
    const itemDocs = items.map((i) => {
      const productId = productIdBySlug.get(i.productSlug!) as string;
      return {
        _key: Math.random().toString(36).slice(2),
        productName: i.productName || '',
        productSlug: i.productSlug || '',
        product: { _type: 'reference', _ref: productId },
        price: typeof i.price === 'number' ? i.price : undefined,
        wristSize: i.wristSize || '',
        ringSize: i.ringSize || ''
      };
    });

    const subtotal = items.reduce((sum, i) => sum + (i.price || 0), 0);
    const shippingQuote = calculateShipping({ subtotal, country });

    const orderNumber = generateOrderNumber();

    const purchaseRequest = await client.create({
      _type: 'purchaseRequest',
      orderNumber,
      items: itemDocs,
      name,
      email,
      whatsapp: whatsapp || '',
      country,
      deliveryFirstName: deliveryFirstName || '',
      deliveryLastName: deliveryLastName || '',
      deliveryCompany: deliveryCompany || '',
      deliveryAddress,
      deliveryCity,
      deliveryRegion: deliveryRegion || '',
      deliveryPostalCode,
      message: message || '',
      shippingMethod: shippingQuote.label,
      shippingCost: shippingQuote.cost,
      paymentStatus: 'pending',
      orderStatus: 'new',
      shippingStatus: 'not_shipped',
      submittedAt: new Date().toISOString()
    });

    const siteUrl = new URL(request.url).origin;
    const loc = locale || 'en';

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((i) => ({
      price_data: {
        currency: 'nzd',
        product_data: { name: i.productName || 'SIREN TEARS piece' },
        unit_amount: Math.round((i.price || 0) * 100)
      },
      quantity: 1
    }));
    lineItems.push({
      price_data: {
        currency: 'nzd',
        product_data: { name: shippingQuote.label },
        unit_amount: Math.round(shippingQuote.cost * 100)
      },
      quantity: 1
    });

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        currency: 'nzd',
        customer_email: email,
        line_items: lineItems,
        // Give up the inventory hold automatically if the customer never
        // reaches Stripe's payment page at all -- matches our own lock TTL.
        expires_at: Math.floor(now.getTime() / 1000) + LOCK_MINUTES * 60,
        metadata: {
          purchaseRequestId: purchaseRequest._id,
          orderNumber
        },
        success_url: `${siteUrl}/${loc}/order-confirmation?order=${orderNumber}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/${loc}/shop`
      });
    } catch (err) {
      // Stripe call itself failed -- release the holds we took, since no
      // payment attempt is actually in flight for them.
      await Promise.all(
        productIds.map((id) => client.patch(id).unset(['checkoutLockExpiresAt']).commit().catch(() => undefined))
      );
      throw err;
    }

    if (!session.url) {
      throw new Error('Stripe did not return a checkout URL');
    }

    // Remember the session id so the webhook (and manual lookups in Studio)
    // can tie the payment back to this exact order.
    await client.patch(purchaseRequest._id).set({ stripeSessionId: session.id }).commit();

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    console.error('Checkout session creation failed', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong starting checkout. Please try again, or contact us directly.' },
      { status: 500 }
    );
  }
}

