import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export const runtime = 'nodejs';

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId || !dataset) return null;
  return createClient({ apiVersion, dataset, projectId, useCdn: false, token });
}

export async function POST(request: Request) {
  const session = verifySessionToken(cookies().get(SESSION_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ ok: false, error: 'Please log in again.' }, { status: 401 });
  }

  const client = getWriteClient();
  if (!client) {
    return NextResponse.json(
      { ok: false, error: 'Profile updates are not connected yet. Please contact the studio directly.' },
      { status: 503 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const { updates } = body ?? {};

  try {
    const allowedFields = ['firstName', 'lastName', 'birthday', 'phoneCountryCode', 'phone', 'addressLine', 'city', 'postcode', 'country'];
    const patch: Record<string, string> = {};
    for (const key of allowedFields) {
      if (typeof updates?.[key] === 'string') patch[key] = updates[key];
    }

    await client.patch(session.id).set(patch).commit();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Account update failed', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong saving your changes. Please try again.' },
      { status: 500 }
    );
  }
}
