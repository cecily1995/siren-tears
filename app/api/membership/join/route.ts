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

function generateMemberCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `ST-${code}`;
}

export async function POST(request: Request) {
  const session = verifySessionToken(cookies().get(SESSION_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: 'Please log in or create an account first.', requiresLogin: true },
      { status: 401 }
    );
  }

  const client = getWriteClient();
  if (!client) {
    return NextResponse.json(
      { ok: false, error: 'Membership is not connected yet. Please contact the studio directly.' },
      { status: 503 }
    );
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    /* body is optional -- all fields can be left as-is */
  }

  const { firstName, lastName, birthday, phone, address, country } = body ?? {};

  try {
    const existing = await client.fetch<{ memberCode?: string; isMember?: boolean } | null>(
      `*[_type == "member" && _id == $id][0]{ memberCode, isMember }`,
      { id: session.id }
    );
    if (!existing) {
      return NextResponse.json({ ok: false, error: "We couldn't find your account." }, { status: 404 });
    }

    const patch: Record<string, any> = { isMember: true };
    if (typeof firstName === 'string' && firstName) patch.firstName = firstName;
    if (typeof lastName === 'string') patch.lastName = lastName;
    if (typeof birthday === 'string') patch.birthday = birthday;
    if (typeof phone === 'string') patch.phone = phone;
    if (typeof address === 'string') patch.address = address;
    if (typeof country === 'string') patch.country = country;

    let memberCode = existing.memberCode;
    if (!memberCode) {
      memberCode = generateMemberCode();
      patch.memberCode = memberCode;
    }
    if (!existing.isMember) {
      patch.tier = 'circle';
      patch.joinedAt = new Date().toISOString();
    }

    await client.patch(session.id).set(patch).commit();

    return NextResponse.json({ ok: true, memberCode });
  } catch (err) {
    console.error('Join Siren Circle failed', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
