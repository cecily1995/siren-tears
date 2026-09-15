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

// Visit /api/debug/order-enquiries directly in the browser. Not linked
// from anywhere in the site; remove once the missing-enquiry issue is
// confirmed fixed.
export async function GET() {
  const client = getWriteClient();
  if (!client) {
    return NextResponse.json({ ok: false, error: 'Sanity write client not configured (missing token/env).' });
  }

  try {
    const enquiries = await client.fetch(
      `*[_type == "orderEnquiry"] | order(_createdAt desc)[0...20]{
        _id, _createdAt, customerName, customerEmail, message, status,
        "orderRef": order._ref,
        "orderExists": defined(order->_id),
        "orderNumber": order->orderNumber
      }`
    );
    const total = await client.fetch(`count(*[_type == "orderEnquiry"])`);
    return NextResponse.json({ ok: true, totalCount: total, recent: enquiries });
  } catch (err: any) {
    console.error('debug order-enquiries failed', err);
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
