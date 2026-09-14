import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } from '@/lib/auth';

export const runtime = 'nodejs';

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId || !dataset) return null;
  return createClient({ apiVersion, dataset, projectId, useCdn: false, token });
}

export async function POST(request: Request) {
  const client = getWriteClient();
  if (!client || !process.env.SESSION_SECRET) {
    return NextResponse.json(
      { ok: false, error: 'Login is not connected yet. Please contact the studio directly.' },
      { status: 503 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const email = (body?.email || '').toString().trim();
  const password = (body?.password || '').toString();

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: 'Please enter your email and password.' }, { status: 400 });
  }

  try {
    const member = await client.fetch<
      { _id: string; passwordHash?: string; firstName?: string; lastName?: string; memberCode?: string; tier?: string; isMember?: boolean } | null
    >(
      `*[_type == "member" && lower(email) == lower($email)][0]{ _id, passwordHash, firstName, lastName, memberCode, tier, isMember }`,
      { email }
    );

    if (!member || !verifyPassword(password, member.passwordHash)) {
      return NextResponse.json({ ok: false, error: 'Incorrect email or password.' }, { status: 401 });
    }

    const token = createSessionToken({ id: member._id, email });
    const res = NextResponse.json({
      ok: true,
      member: {
        firstName: member.firstName,
        lastName: member.lastName,
        email,
        memberCode: member.memberCode,
        tier: member.tier,
        isMember: member.isMember
      }
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
    console.error('Login failed', err);
    return NextResponse.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
