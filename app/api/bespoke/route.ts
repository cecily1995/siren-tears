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
    gender,
    birthday,
    zodiac,
    productionTrack,
    pieceType,
    wristSize,
    ringSize,
    colours,
    styles,
    note
  }: {
    name?: string;
    email?: string;
    gender?: string;
    birthday?: string;
    zodiac?: string;
    productionTrack?: string;
    pieceType?: string;
    wristSize?: string;
    ringSize?: string;
    colours?: string[];
    styles?: string[];
    note?: string;
  } = body ?? {};

  if (!email || !name) {
    return NextResponse.json(
      { ok: false, error: 'Please include your name and email address.' },
      { status: 400 }
    );
  }

  try {
    const created = await client.create({
      _type: 'bespokeRequest',
      name,
      email,
      gender: gender || '',
      birthday: birthday || '',
      zodiac: zodiac || '',
      productionTrack: productionTrack || '',
      pieceType: pieceType || '',
      wristSize: wristSize || '',
      ringSize: ringSize || '',
      colours: Array.isArray(colours) ? colours : [],
      styles: Array.isArray(styles) ? styles : [],
      note: note || '',
      status: 'new',
      submittedAt: new Date().toISOString()
    });

    return NextResponse.json({ ok: true, id: created._id });
  } catch (err) {
    console.error('Bespoke request submission failed', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong sending your request. Please try emailing us instead.' },
      { status: 500 }
    );
  }
}
