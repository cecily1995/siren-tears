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
      { ok: false, error: 'Order enquiries are not connected yet. Please contact the studio directly.' },
      { status: 503 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const { orderId, message }: { orderId?: string; message?: string } = body ?? {};

  if (!orderId || !message) {
    return NextResponse.json(
      { ok: false, error: 'Please select an order and enter your message.' },
      { status: 400 }
    );
  }

  try {
    const order = await client.fetch<{ _id: string; name?: string; email?: string } | null>(
      `*[_type == "purchaseRequest" && _id == $id][0]{ _id, name, email }`,
      { id: orderId }
    );

    if (!order) {
      console.error('order-enquiry: order not found for id', orderId);
      return NextResponse.json({ ok: false, error: 'Order not found.' }, { status: 404 });
    }

    const created = await client.create({
      _type: 'orderEnquiry',
      order: { _type: 'reference', _ref: order._id },
      customerName: order.name || '',
      customerEmail: order.email || '',
      message,
      status: 'new',
      submittedAt: new Date().toISOString()
    });

    console.log('order-enquiry created', created._id, 'for order', order._id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Order enquiry submission failed', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong. Please try again, or contact us directly.' },
      { status: 500 }
    );
  }
}
