import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from 'next-sanity';
import Stripe from 'stripe';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { calculateShipping } from '@/lib/shipping';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { convertFromNzd, isCurrency } from '@/lib/currency';

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
    locale,
    currency: requestedCurrency
  }: {
    items?: {
      productName?: string;
      productSlug?: string;
      price?: number;
      wristSize?: string;
      ringSize?: string;
      imageUrl?: string;
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
    currency?: string;
  } = body ?? {};

  if (!email || !name) {
    return NextResponse.json(
      { ok: false, error: 'Please include your name and email address.' },
      { status: 400 }
    );
  }
  // Require a logged-in My Siren session to actually pay. The /checkout UI
  // already gates the button on this client-side, but that's only a nicety
  // -- a request straight to this endpoint must be checked here too.
  const sessionToken = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = verifySessionToken(sessionToken);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: 'Please sign in to complete your purchase.' },
      { status: 401 }
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

    // ---- Soft availability check (no reservation) --------------------------
    // Per decision: don't lock inventory just because someone started
    // checkout -- only the webhook, at actual payment success, decides who
    // gets the piece (see /api/webhooks/stripe). This is just a courtesy
    // check so we don't send someone to pay for something already gone.
    const productIds = Array.from(new Set(items.map((i) => productIdBySlug.get(i.productSlug!) as string)));
    const currentProducts = await client.fetch<{ _id: string; status?: string; name?: string }[]>(
      `*[_id in $ids]{ _id, status, name }`,
      { ids: productIds }
    );
    const unavailable = currentProducts.filter((p) => p.status !== 'available');
    if (unavailable.length) {
      return NextResponse.json(
        {
          ok: false,
          error: `Sorry, ${unavailable.map((p) => p.name || 'an item in your bag').join(', ')} is no longer available. Please remove it from your bag and try again.`
        },
        { status: 409 }
      );
    }

    // ---- Build the order ----------------------------------------------------
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

    // Membership status (lower free-shipping threshold, $400 vs $500) --
    // we already required a valid session above, so just look up this
    // member's isMember flag directly.
    let isMember = false;
    try {
      const memberDoc = await client.fetch<{ isMember?: boolean } | null>(
        `*[_type == "member" && _id == $id][0]{ isMember }`,
        { id: session.id }
      );
      isMember = Boolean(memberDoc?.isMember);
    } catch {
      // Fine -- worst case we just treat them as a non-member.
    }

    const shippingQuote = calculateShipping({ subtotal, country, isMember });

    const orderNumber = generateOrderNumber();

    const purchaseRequest = await client.create({
      _type: 'purchaseRequest',
      orderNumber,
      items: itemDocs,
      // Whoever is actually logged in gets credit for this order in their
      // My Siren purchase history, regardless of what name/email they
      // typed into the delivery form (e.g. buying a gift for someone else).
      buyerMember: { _type: 'reference', _ref: session.id },
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

    const total = subtotal + shippingQuote.cost;
    const currency = isCurrency(requestedCurrency) ? requestedCurrency : 'NZD';
    const chargedTotal = convertFromNzd(total, currency);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(chargedTotal * 100),
      currency: currency.toLowerCase(),
      receipt_email: email,
      // Explicit list rather than automatic_payment_methods: the
      // automatic option pulls in every method enabled on the Stripe
      // account, including "Link" (Stripe's own saved-card autofill),
      // which injects a small floating "stripe >" badge into the page
      // that can linger after client-side navigation. Apple Pay / Google
      // Pay still work through ExpressCheckoutElement -- they're
      // processed as the 'card' method under the hood, so this doesn't
      // remove them, only Link specifically.
      payment_method_types: ['card'],
      metadata: {
        purchaseRequestId: purchaseRequest._id,
        orderNumber
      }
    });

    if (!paymentIntent.client_secret) {
      throw new Error('Stripe did not return a client secret');
    }

    // Remember the payment intent id so the webhook (and manual lookups in
    // Studio) can tie the payment back to this exact order.
    await client.patch(purchaseRequest._id).set({ stripePaymentIntentId: paymentIntent.id }).commit();

    return NextResponse.json({
      ok: true,
      clientSecret: paymentIntent.client_secret,
      orderNumber,
      purchaseRequestId: purchaseRequest._id,
      total: chargedTotal,
      currency
    });
  } catch (err) {
    console.error('Checkout session creation failed', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong starting checkout. Please try again, or contact us directly.' },
      { status: 500 }
    );
  }
}
