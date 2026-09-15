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
    shippingAddress,
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
    shippingAddress?: string;
    message?: string;
    locale?: string;
  } = body ?? {};

  if (!email || !name) {
    return NextResponse.json(
      { ok: false, error: 'Please include your name and email address.' },
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
    // exclude drafts -- see the note in the old purchase-request route for
    // why a draft reference causes real problems later.
    const slugs = items.map((i) => i.productSlug).filter(Boolean) as string[];
    const products = slugs.length
      ? await client.fetch<{ _id: string; slug?: string }[]>(
          `*[_type == "shopProduct" && !(_id in path("drafts.**")) && slug.current in $slugs]{ _id, "slug": slug.current }`,
          { slugs }
        )
      : [];
    const productIdBySlug = new Map(products.map((p) => [p.slug, p._id]));

    const itemDocs = items.map((i) => {
      const productId = i.productSlug ? productIdBySlug.get(i.productSlug) : undefined;
      return {
        _key: Math.random().toString(36).slice(2),
        productName: i.productName || '',
        productSlug: i.productSlug || '',
        ...(productId ? { product: { _type: 'reference', _ref: productId } } : {}),
        price: typeof i.price === 'number' ? i.price : undefined,
        wristSize: i.wristSize || '',
        ringSize: i.ringSize || ''
      };
    });

    const orderNumber = generateOrderNumber();

    const purchaseRequest = await client.create({
      _type: 'purchaseRequest',
      orderNumber,
      items: itemDocs,
      name,
      email,
      whatsapp: whatsapp || '',
      country: country || '',
      shippingAddress: shippingAddress || '',
      message: message || '',
      status: 'payment_pending',
      submittedAt: new Date().toISOString()
    });

    const siteUrl = new URL(request.url).origin;
    const loc = locale || 'en';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'nzd',
      customer_email: email,
      line_items: items.map((i) => ({
        price_data: {
          currency: 'nzd',
          product_data: { name: i.productName || 'SIREN TEARS piece' },
          unit_amount: Math.round((i.price || 0) * 100)
        },
        quantity: 1
      })),
      metadata: {
        purchaseRequestId: purchaseRequest._id,
        orderNumber
      },
      success_url: `${siteUrl}/${loc}/order-confirmation?order=${orderNumber}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/${loc}/shop`
    });

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
