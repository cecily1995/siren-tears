import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

export const runtime = 'nodejs';

const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId || !dataset) return null;
  return createClient({ apiVersion, dataset, projectId, useCdn: false, token });
}

export async function POST(request: Request) {
  const client = getWriteClient();
  if (!client) {
    return NextResponse.json(
      { ok: false, error: 'This form is not connected yet. Please contact the studio directly.' },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const fullName = (formData.get('fullName') || '').toString().trim();
  const email = (formData.get('email') || '').toString().trim();
  const subject = (formData.get('subject') || '').toString().trim();
  const orderId = (formData.get('orderId') || '').toString().trim();
  const message = (formData.get('message') || '').toString().trim();
  const files = formData.getAll('files').filter((f): f is File => f instanceof File && f.size > 0);

  if (!fullName || !email || !subject || !orderId || !message) {
    return NextResponse.json({ ok: false, error: 'Please complete all required fields.' }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ ok: false, error: `Please attach up to ${MAX_FILES} files.` }, { status: 400 });
  }
  for (const f of files) {
    if (f.size > MAX_FILE_SIZE) {
      return NextResponse.json({ ok: false, error: `"${f.name}" is over the 10MB limit per file.` }, { status: 400 });
    }
  }

  try {
    const order = await client.fetch<{ _id: string } | null>(
      `*[_type == "purchaseRequest" && _id == $id][0]{ _id }`,
      { id: orderId }
    );
    if (!order) {
      return NextResponse.json({ ok: false, error: 'Order not found.' }, { status: 404 });
    }

    const uploadedAssets = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const asset = await client.assets.upload('file', buffer, { filename: file.name });
        return { _type: 'file', asset: { _type: 'reference', _ref: asset._id } };
      })
    );

    const created = await client.create({
      _type: 'orderEnquiry',
      order: { _type: 'reference', _ref: order._id },
      customerName: fullName,
      customerEmail: email,
      subject,
      message,
      attachments: uploadedAssets,
      status: 'new',
      submittedAt: new Date().toISOString()
    });

    console.log('returns-repairs enquiry created', created._id, 'for order', order._id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Returns & Repairs enquiry submission failed', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong. Please try again, or contact us directly.' },
      { status: 500 }
    );
  }
}
