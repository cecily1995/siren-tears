import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { sendEmail } from '@/lib/email';
import { shippingNotificationEmail } from '@/lib/orderEmail';

export const runtime = 'nodejs';

// Called from the Studio "Send shipping notification" document action (see
// sanity/actions/notifyShippedAction.tsx) once an admin has set
// shippingStatus to 'shipped' and filled in a tracking number. Not gated by
// ADMIN_DEBUG_SECRET like the diagnostic routes -- this only ever emails the
// order's own customer, never anyone else, so the blast radius of an
// unauthenticated call is a single duplicate shipping email at worst.
export async function POST(request: Request) {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId || !dataset) {
    return NextResponse.json({ ok: false, error: 'Sanity not configured' }, { status: 503 });
  }

  let purchaseRequestId: string | undefined;
  try {
    const body = await request.json();
    purchaseRequestId = body?.purchaseRequestId;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!purchaseRequestId) {
    return NextResponse.json({ ok: false, error: 'purchaseRequestId required' }, { status: 400 });
  }

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

  const order = await client.fetch<{
    orderNumber?: string;
    name?: string;
    email?: string;
    trackingNumber?: string;
    items?: { productName?: string; price?: number }[];
    deliveryFirstName?: string;
    deliveryLastName?: string;
    deliveryAddress?: string;
    deliveryCity?: string;
    deliveryRegion?: string;
    deliveryPostalCode?: string;
    country?: string;
  } | null>(
    `*[_id == $id][0]{
      orderNumber, name, email, trackingNumber,
      items[]{ productName, price },
      deliveryFirstName, deliveryLastName, deliveryAddress, deliveryCity, deliveryRegion, deliveryPostalCode, country
    }`,
    { id: purchaseRequestId }
  );

  if (!order) {
    return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 });
  }
  if (!order.email) {
    return NextResponse.json({ ok: false, error: 'Order has no email on file' }, { status: 400 });
  }

  const { subject, html } = shippingNotificationEmail(order);
  const result = await sendEmail({ to: order.email, subject, html });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
