import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

export const runtime = 'nodejs';

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId || !dataset) return null;
  return createClient({ apiVersion, dataset, projectId, useCdn: false, token });
}

function generateMemberCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no easily-confused characters
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `ST-${code}`;
}

export async function POST(request: Request) {
  const client = getWriteClient();
  if (!client) {
    return NextResponse.json(
      { ok: false, error: 'Membership registration is not connected yet. Please email the studio directly for now.' },
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
    firstName,
    lastName,
    birthday,
    email,
    phone,
    address,
    country
  }: {
    firstName?: string;
    lastName?: string;
    birthday?: string;
    email?: string;
    phone?: string;
    address?: string;
    country?: string;
  } = body ?? {};

  if (!email || !firstName) {
    return NextResponse.json(
      { ok: false, error: 'Please include at least your first name and email address.' },
      { status: 400 }
    );
  }

  try {
    // Reuse an existing code if this email has already joined, rather than
    // silently creating duplicate member records for the same person.
    const existing = await client.fetch<{ memberCode?: string } | null>(
      `*[_type == "member" && lower(email) == lower($email)][0]{ memberCode }`,
      { email }
    );
    if (existing?.memberCode) {
      return NextResponse.json({ ok: true, memberCode: existing.memberCode, existing: true });
    }

    const memberCode = generateMemberCode();
    await client.create({
      _type: 'member',
      firstName,
      lastName: lastName || '',
      birthday: birthday || '',
      email,
      phone: phone || '',
      address: address || '',
      country: country || '',
      memberCode,
      tier: 'circle',
      joinedAt: new Date().toISOString()
    });

    return NextResponse.json({ ok: true, memberCode });
  } catch (err) {
    console.error('Membership registration failed', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong. Please try again, or contact us directly.' },
      { status: 500 }
    );
  }
}
