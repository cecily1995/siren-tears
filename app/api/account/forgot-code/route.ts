import { NextResponse } from 'next/server';
import { client, hasSanityConfig } from '@/sanity/lib/client';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!hasSanityConfig || !client) {
    return NextResponse.json(
      { ok: false, error: 'Account lookup is not connected yet. Please contact the studio directly.' },
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
  if (!email) {
    return NextResponse.json({ ok: false, error: 'Please enter your email address.' }, { status: 400 });
  }

  try {
    const member = await client.fetch(
      `*[_type == "member" && lower(email) == lower($email)][0]{ memberCode, firstName }`,
      { email }
    );

    if (!member?.memberCode) {
      return NextResponse.json(
        { ok: false, error: "We couldn't find a Siren Circle account with that email address." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, memberCode: member.memberCode, firstName: member.firstName });
  } catch (err) {
    console.error('Member code lookup failed', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
