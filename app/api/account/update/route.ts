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

  const { email, memberCode, updates } = body ?? {};
  if (!email || !memberCode) {
    return NextResponse.json({ ok: false, error: 'Missing email or member code.' }, { status: 400 });
  }

  try {
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "member" && lower(email) == lower($email) && upper(memberCode) == upper($memberCode)][0]{ _id }`,
      { email, memberCode }
    );
    if (!existing?._id) {
      return NextResponse.json(
        { ok: false, error: "We couldn't verify that account." },
        { status: 404 }
      );
    }

    const allowedFields = ['firstName', 'lastName', 'birthday', 'phone', 'address', 'country'];
    const patch: Record<string, string> = {};
    for (const key of allowedFields) {
      if (typeof updates?.[key] === 'string') patch[key] = updates[key];
    }

    await client.patch(existing._id).set(patch).commit();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Account update failed', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong saving your changes. Please try again.' },
      { status: 500 }
    );
  }
}
