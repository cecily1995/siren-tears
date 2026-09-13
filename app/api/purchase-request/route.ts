import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

export const runtime = 'nodejs';

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId || !dataset) return null;
  return createClient({ apiVersion, dataset, projectId, useCdn: false, token });
}

export async function POST(request: Request) {
  const client = getWriteClient();
  if (!client) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Purchase requests are not connected yet. Please email or WhatsApp the studio directly for now.'
      },
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
    productName,
    productSlug,
    name,
    email,
    whatsapp,
    country,
    shippingAddress,
    message
  }: {
    productName?: string;
    productSlug?: string;
    name?: string;
    email?: string;
    whatsapp?: string;
    country?: string;
    shippingAddress?: string;
    message?: string;
  } = body ?? {};

  if (!email || !name) {
    return NextResponse.json(
      { ok: false, error: 'Please include your name and email address.' },
      { status: 400 }
    );
  }

  try {
    // Resolve the product by slug so we can link a real reference — this is
    // what lets a later status change ("Paid"/"Shipped") automatically mark
    // the linked Shop Product as Sold.
    let productRef: { _type: 'reference'; _ref: string } | undefined;
    if (productSlug) {
      const product = await client.fetch<{ _id: string } | null>(
        `*[_type == "shopProduct" && slug.current == $slug][0]{ _id }`,
        { slug: productSlug }
      );
      if (product?._id) {
        productRef = { _type: 'reference', _ref: product._id };
      }
    }

    await client.create({
      _type: 'purchaseRequest',
      productName: productName || '',
      productSlug: productSlug || '',
      ...(productRef ? { product: productRef } : {}),
      name,
      email,
      whatsapp: whatsapp || '',
      country: country || '',
      shippingAddress: shippingAddress || '',
      message: message || '',
      status: 'new',
      submittedAt: new Date().toISOString()
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Purchase request submission failed', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong sending your request. Please try again, or contact us directly.' },
      { status: 500 }
    );
  }
}
