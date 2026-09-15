import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

export const runtime = 'nodejs';

function getReadClient() {
  if (!projectId || !dataset) return null;
  return createClient({ apiVersion, dataset, projectId, useCdn: true });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slugsParam = url.searchParams.get('slugs') || '';
  const slugs = slugsParam
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!slugs.length) {
    return NextResponse.json({ ok: true, products: [] });
  }

  const client = getReadClient();
  if (!client) {
    return NextResponse.json({ ok: true, products: [] });
  }

  try {
    const products = await client.fetch<{ slug: string; status?: string }[]>(
      `*[_type == "shopProduct" && slug.current in $slugs]{ "slug": slug.current, status }`,
      { slugs }
    );
    return NextResponse.json({ ok: true, products });
  } catch (err) {
    console.error('wishlist-status failed', err);
    return NextResponse.json({ ok: true, products: [] });
  }
}
