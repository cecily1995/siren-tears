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
  const client = getWriteClient();
  if (!client) {
    return NextResponse.json(
      { ok: false, error: 'Chat is not connected yet. Please email or WhatsApp the studio directly for now.' },
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
    topic,
    message
  }: { name?: string; email?: string; topic?: string; message?: string } = body ?? {};

  if (!message) {
    return NextResponse.json({ ok: false, error: 'Please enter a message.' }, { status: 400 });
  }

  // If the visitor is signed in, link the enquiry to their member record
  // automatically rather than trusting whatever the client sent.
  let memberRef: { _type: 'reference'; _ref: string } | undefined;
  const sessionToken = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = verifySessionToken(sessionToken);
  if (session?.id) {
    memberRef = { _type: 'reference', _ref: session.id };
  }

  try {
    await client.create({
      _type: 'chatEnquiry',
      name: name || '',
      email: email || '',
      topic: topic || 'other',
      message,
      ...(memberRef ? { member: memberRef } : {}),
      status: 'new',
      submittedAt: new Date().toISOString()
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Chat enquiry submission failed', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong. Please try again, or contact us directly.' },
      { status: 500 }
    );
  }
}
