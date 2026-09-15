import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId || !dataset) return null;
  return createClient({ apiVersion, dataset, projectId, useCdn: false, token });
}

// One-off diagnostic: every shopProduct's slug, flagged if it contains any
// character outside a-z/0-9/hyphen (URLs should only ever contain those --
// anything else, like a Mac "smart punctuation" typographic dash instead of
// a plain hyphen, is a byte-for-byte mismatch waiting to 404).
// Visit with the secret appended, e.g.:
//   /api/admin/debug-slugs?secret=YOUR_ADMIN_DEBUG_SECRET
export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  const expected = process.env.ADMIN_DEBUG_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const client = getWriteClient();
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Not configured' }, { status: 503 });
  }

  try {
    const products = await client.fetch<{ _id: string; name?: string; slug?: string; status?: string }[]>(
      `*[_type == "shopProduct" && !(_id in path("drafts.**"))]{ _id, name, "slug": slug.current, status }`
    );

    const VALID = /^[a-z0-9-]+$/;

    const report = products.map((p) => {
      const slug = p.slug || '';
      const badChars = Array.from(slug)
        .filter((ch) => !VALID.test(ch))
        .map((ch) => ({ char: ch, codePoint: 'U+' + ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0') }));
      return {
        name: p.name,
        status: p.status,
        slug,
        isValid: badChars.length === 0,
        badChars: badChars.length ? badChars : undefined
      };
    });

    return NextResponse.json({
      ok: true,
      totalProducts: products.length,
      invalidCount: report.filter((r) => !r.isValid).length,
      products: report
    });
  } catch (err: any) {
    console.error('debug-slugs failed', err);
    return NextResponse.json({ ok: false, error: err?.message || 'Internal error' }, { status: 500 });
  }
}
