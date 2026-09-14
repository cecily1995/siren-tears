import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { hashPassword, createSessionToken, SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } from '@/lib/auth';

export const runtime = 'nodejs';

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId || !dataset) return null;
  return createClient({ apiVersion, dataset, projectId, useCdn: false, token });
}

function generateMemberCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `ST-${code}`;
}

export async function POST(request: Request) {
  const client = getWriteClient();
  if (!client || !process.env.SESSION_SECRET) {
    return NextResponse.json(
      { ok: false, error: 'Account registration is not connected yet. Please contact the studio directly.' },
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
    email,
    password,
    birthday,
    phone,
    address,
    country
  }: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    birthday?: string;
    phone?: string;
    address?: string;
    country?: string;
  } = body ?? {};

  if (!firstName || !email || !password) {
    return NextResponse.json(
      { ok: false, error: 'Please include your name, email, and a password.' },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { ok: false, error: 'Please choose a password with at least 8 characters.' },
      { status: 400 }
    );
  }

  try {
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "member" && lower(email) == lower($email)][0]{ _id }`,
      { email }
    );
    if (existing?._id) {
      return NextResponse.json(
        { ok: false, error: 'An account with that email already exists. Try logging in instead.' },
        { status: 409 }
      );
    }

    const memberCode = generateMemberCode();
    const created = await client.create({
      _type: 'member',
      firstName,
      lastName: lastName || '',
      email,
      passwordHash: hashPassword(password),
      birthday: birthday || '',
      phone: phone || '',
      address: address || '',
      country: country || '',
      memberCode,
      tier: 'circle',
      joinedAt: new Date().toISOString()
    });

    const token = createSessionToken({ id: created._id, email });
    const res = NextResponse.json({
      ok: true,
      memberCode,
      member: { firstName, lastName, email, memberCode, tier: 'circle' }
    });
    if (token) {
      res.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_COOKIE_MAX_AGE
      });
    }
    return res;
  } catch (err) {
    console.error('Registration failed', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong creating your account. Please try again.' },
      { status: 500 }
    );
  }
}
