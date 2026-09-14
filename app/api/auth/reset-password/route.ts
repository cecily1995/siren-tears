import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { verifyResetToken, hashPassword, createSessionToken, SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } from '@/lib/auth';

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
      { ok: false, error: 'Password reset is not connected yet. Please contact the studio directly.' },
      { status: 503 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const token = (body?.token || '').toString();
  const password = (body?.password || '').toString();

  const verified = verifyResetToken(token);
  if (!verified) {
    return NextResponse.json(
      { ok: false, error: 'This reset link is invalid or has expired. Please request a new one.' },
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
    const member = await client.fetch<{ _id: string; email?: string } | null>(
      `*[_type == "member" && _id == $id][0]{ _id, email }`,
      { id: verified.id }
    );
    if (!member) {
      return NextResponse.json({ ok: false, error: 'Account not found.' }, { status: 404 });
    }

    await client.patch(member._id).set({ passwordHash: hashPassword(password) }).commit();

    const sessionToken = member.email ? createSessionToken({ id: member._id, email: member.email }) : null;
    const res = NextResponse.json({ ok: true });
    if (sessionToken) {
      res.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_COOKIE_MAX_AGE
      });
    }
    return res;
  } catch (err) {
    console.error('reset-password failed', err);
    return NextResponse.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
