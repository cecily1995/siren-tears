import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

export const runtime = 'nodejs';

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId || !dataset) return null;
  return createClient({ apiVersion, dataset, projectId, useCdn: false, token });
}

const TERMINAL_STATUSES = ['paid', 'shipped'];

export async function POST(request: Request) {
  // Simple shared-secret check so random internet traffic can't trigger
  // this. Sanity's webhook config lets you add ?secret=... to the URL.
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

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    // Some Sanity webhook configs send an empty body for delete events; that's fine.
  }

  // Be liberal about what shape the payload might be in -- different webhook
  // projection settings send different fields, so just grab whatever id we
  // can find and re-fetch the canonical published document ourselves.
  const rawId: string | undefined =
    body?._id || body?.documentId || body?.ids?.updated?.[0] || body?.ids?.created?.[0];

  if (!rawId) {
    return NextResponse.json({ ok: true, skipped: 'no document id in payload' });
  }

  // Only act on the published document (strip a "drafts." id if present) so
  // this only fires once the change is actually published, not on every
  // keystroke while editing a draft.
  const publishedId = rawId.replace(/^drafts\./, '');

  try {
    const purchaseRequest = await client.fetch<{ status?: string; productIds?: string[] } | null>(
      `*[_id == $id][0]{ status, "productIds": items[].product._ref }`,
      { id: publishedId }
    );

    if (!purchaseRequest?.productIds?.length) {
      return NextResponse.json({ ok: true, skipped: 'no linked products on this request' });
    }

    if (!purchaseRequest.status || !TERMINAL_STATUSES.includes(purchaseRequest.status)) {
      return NextResponse.json({ ok: true, skipped: `status is "${purchaseRequest.status}", no action` });
    }

    await Promise.all(
      purchaseRequest.productIds.map((id) => client.patch(id).set({ status: 'sold' }).commit())
    );

    return NextResponse.json({ ok: true, markedSold: purchaseRequest.productIds });
  } catch (err) {
    console.error('purchase-status webhook failed', err);
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}
