import { NextResponse } from 'next/server';
import { groq } from 'next-sanity';
import { client, hasSanityConfig } from '@/sanity/lib/client';

export const runtime = 'nodejs';

// Small "You may also like" feed for the Bag drawer and Checkout page.
// Public/read-only -- no write token needed, same client the rest of the
// site's product pages already use.
export async function GET(request: Request) {
  if (!hasSanityConfig || !client) {
    return NextResponse.json({ ok: true, products: [] });
  }

  const url = new URL(request.url);
  const excludeSlugs = (url.searchParams.get('exclude') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const limit = Math.min(Number(url.searchParams.get('limit')) || 4, 8);

  try {
    const products = await client.fetch(
      groq`*[_type == "shopProduct" && status == "available" && !(slug.current in $excludeSlugs)]
        | order(order asc, _createdAt desc)[0...$limit]{
          _id, name, price, category,
          "slug": slug.current,
          "imageUrl": images[0].asset->url
        }`,
      { excludeSlugs, limit }
    );
    return NextResponse.json({ ok: true, products });
  } catch (err) {
    console.error('recommended products fetch failed', err);
    return NextResponse.json({ ok: true, products: [] });
  }
}
