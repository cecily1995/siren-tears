import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

export const runtime = 'nodejs';

// A write-enabled client. Requires SANITY_API_WRITE_TOKEN (server-only secret,
// generated from sanity.io/manage -> API -> Tokens, with Editor permissions).
// This token must NEVER be prefixed with NEXT_PUBLIC_ and must never be sent to the browser.
function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId || !dataset) return null;
  return createClient({ apiVersion, dataset, projectId, useCdn: false, token });
}

type InspirationImage = { dataUrl: string; name?: string };

export async function POST(request: Request) {
  const client = getWriteClient();
  if (!client) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Bespoke request storage is not configured yet. Please email the studio directly for now.'
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
    name,
    email,
    whatsapp,
    pieceType,
    stone,
    colour,
    budget,
    message,
    images
  }: {
    name?: string;
    email?: string;
    whatsapp?: string;
    pieceType?: string;
    stone?: string;
    colour?: string;
    budget?: string;
    message?: string;
    images?: InspirationImage[];
  } = body ?? {};

  if (!email || !message) {
    return NextResponse.json(
      { ok: false, error: 'Please include at least an email address and a short message.' },
      { status: 400 }
    );
  }

  try {
    const uploadedImages: { _type: 'image'; _key: string; asset: { _type: 'reference'; _ref: string } }[] = [];

    if (Array.isArray(images)) {
      for (const img of images.slice(0, 6)) {
        if (!img?.dataUrl) continue;
        const match = img.dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
        if (!match) continue;
        const buffer = Buffer.from(match[2], 'base64');
        if (buffer.length > 8 * 1024 * 1024) continue; // 8MB safety cap per image
        const asset = await client.assets.upload('image', buffer, {
          filename: img.name || 'inspiration.jpg',
          contentType: match[1]
        });
        uploadedImages.push({
          _type: 'image',
          _key: asset._id,
          asset: { _type: 'reference', _ref: asset._id }
        });
      }
    }

    await client.create({
      _type: 'bespokeRequest',
      name: name || '',
      email,
      whatsapp: whatsapp || '',
      pieceType: pieceType || '',
      stone: stone || '',
      colour: colour || '',
      budget: budget || '',
      message,
      inspirationImages: uploadedImages,
      status: 'new',
      submittedAt: new Date().toISOString()
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Bespoke request submission failed', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong sending your request. Please try emailing us instead.' },
      { status: 500 }
    );
  }
}
