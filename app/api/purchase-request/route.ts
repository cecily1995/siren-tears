import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

export const runtime = 'nodejs';

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId || !dataset) return null;
  return createClient({ apiVersion, dataset, projectId, useCdn: false, token });
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
    items,
    name,
    email,
    whatsapp,
    country,
    shippingAddress,
    message
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
  } = body ?? {};

  if (!email || !name) {
    return NextResponse.json(
      { ok: false, error: 'Please include your name and email address.' },
      { status: 400 }
    );
  }
  if (!items || !items.length) {
    return NextResponse.json(
      { ok: false, error: 'Your bag is empty.' },
      { status: 400 }
    );
  }

  try {
    // Resolve each product by slug so we can link a real reference — this
    // is what lets a later status change ("Paid"/"Shipped") automatically
    // mark the linked Shop Products as Sold.
    //
    // IMPORTANT: exclude drafts here. Without this filter, if a product is
    // being edited (has an in-progress draft) at the exact moment someone
    // submits a purchase request for it, this query can match both the
    // published doc AND its "drafts.<id>" counterpart, and the draft's id
    // can win the dedupe below. That stores a reference to a draft, which
    // later makes the draft undeletable -- so the editor can never publish
    // further changes to that product again ("变更失败:文档 ... 无法删除,
    // 因为 ... 对其有引用"). Always resolve to the published id only.
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

    await client.create({
      _type: 'purchaseRequest',
      orderNumber: generateOrderNumber(),
      items: itemDocs,
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
