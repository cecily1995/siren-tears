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
  const memberCode = (body?.memberCode || '').toString().trim();

  if (!email || !memberCode) {
    return NextResponse.json(
      { ok: false, error: 'Please enter both your email and member code.' },
      { status: 400 }
    );
  }

  try {
    const member = await client.fetch(
      `*[_type == "member" && lower(email) == lower($email) && upper(memberCode) == upper($memberCode)][0]{
        firstName, lastName, email, memberCode, tier, joinedAt
      }`,
      { email, memberCode }
    );

    if (!member) {
      return NextResponse.json(
        { ok: false, error: "We couldn't find an account matching that email and member code." },
        { status: 404 }
      );
    }

    const [purchases, bespokeRequests] = await Promise.all([
      client.fetch(
        `*[_type == "purchaseRequest" && lower(email) == lower($email)] | order(_createdAt desc){
          productName, status, trackingNumber, _createdAt
        }`,
        { email }
      ),
      client.fetch(
        `*[_type == "bespokeRequest" && lower(email) == lower($email)] | order(_createdAt desc){
          pieceType, status, _createdAt
        }`,
        { email }
      )
    ]);

    return NextResponse.json({ ok: true, member, purchases, bespokeRequests });
  } catch (err) {
    console.error('Account lookup failed', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong looking up your account. Please try again.' },
      { status: 500 }
    );
  }
}
