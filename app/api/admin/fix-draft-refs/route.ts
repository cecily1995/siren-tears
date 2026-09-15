import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

export const runtime = 'nodejs';

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId || !dataset) return null;
  return createClient({ apiVersion, dataset, projectId, useCdn: false, token });
}

// One-off cleanup: some purchaseRequest documents ended up with an
// items[].product reference pointing at a draft id ("drafts.<id>") instead
// of the published id, because of a bug in the purchase-request submission
// route (now fixed). A reference held on a draft id makes that draft
// permanently undeletable, which blocks publishing the linked Shop Product
// forever ("无法删除，因为 ... 对其有引用").
//
// This route finds every purchaseRequest (published AND draft versions)
// with such a reference and repoints it at the published id instead, as
// long as that published document actually exists.
//
// Safe to run more than once -- it's a no-op once everything is clean.
// Visit this URL once in a browser with the secret appended, e.g.:
//   /api/admin/fix-draft-refs?secret=YOUR_SANITY_WEBHOOK_SECRET
export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  const expected = process.env.SANITY_WEBHOOK_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const client = getWriteClient();
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Not configured' }, { status: 503 });
  }

  try {
    const requests = await client.fetch<
      { _id: string; items?: { _key: string; product?: { _ref?: string } }[] }[]
    >(`*[_type == "purchaseRequest"]{ _id, items[]{ _key, product } }`);

    const fixes: { docId: string; itemKey: string; from: string; to: string }[] = [];

    for (const doc of requests) {
      for (const item of doc.items || []) {
        const ref = item.product?._ref;
        if (!ref || !ref.startsWith('drafts.')) continue;

        const publishedId = ref.replace(/^drafts\./, '');
        const exists = await client.fetch<string | null>(`*[_id == $id][0]._id`, {
          id: publishedId
        });
        if (!exists) continue; // don't repoint to something that doesn't exist

        await client
          .patch(doc._id)
          .set({ [`items[_key=="${item._key}"].product._ref`]: publishedId })
          .commit();

        fixes.push({ docId: doc._id, itemKey: item._key, from: ref, to: publishedId });
      }
    }

    return NextResponse.json({ ok: true, fixedCount: fixes.length, fixes });
  } catch (err) {
    console.error('fix-draft-refs failed', err);
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}
