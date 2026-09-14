import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { createResetToken } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId || !dataset) return null;
  return createClient({ apiVersion, dataset, projectId, useCdn: false, token });
}

function siteUrl(request: Request) {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const host = request.headers.get('host');
  const proto = host?.includes('localhost') ? 'http' : 'https';
  return `${proto}://${host}`;
}

export async function POST(request: Request) {
  const client = getWriteClient();
  // Always respond the same way regardless of whether the email exists or
  // email sending is even configured, so we never leak which addresses
  // have accounts. If something is genuinely unconfigured we still log it
  // server-side for the studio to notice.
  const genericOk = NextResponse.json({ ok: true });

  if (!client || !process.env.SESSION_SECRET) {
    console.error('forgot-password: Sanity or SESSION_SECRET not configured');
    return genericOk;
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const email = (body?.email || '').toString().trim();
  if (!email) {
    return NextResponse.json({ ok: false, error: 'Please enter your email.' }, { status: 400 });
  }

  try {
    const member = await client.fetch<{ _id: string; firstName?: string } | null>(
      `*[_type == "member" && lower(email) == lower($email)][0]{ _id, firstName }`,
      { email }
    );

    if (member?._id) {
      const token = createResetToken(member._id);
      if (token) {
        const link = `${siteUrl(request)}/reset-password?token=${token}`;
        await sendEmail({
          to: email,
          subject: 'Reset your Siren Tears password',
          html: `
            <div style="font-family: Georgia, serif; color: #26231f;">
              <p>Hi ${member.firstName || ''},</p>
              <p>Click the link below to set a new password. This link expires in 1 hour.</p>
              <p><a href="${link}">${link}</a></p>
              <p>If you didn't request this, you can safely ignore this email.</p>
              <p>— Siren Tears</p>
            </div>
          `
        });
      }
    }

    return genericOk;
  } catch (err) {
    console.error('forgot-password failed', err);
    return genericOk;
  }
}
