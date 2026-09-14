import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId || !dataset) return null;
  return createClient({ apiVersion, dataset, projectId, useCdn: false, token });
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
}

export async function POST(request: Request) {
  const client = getWriteClient();
  // Always respond the same way regardless of whether the email exists,
  // so we never leak which addresses have accounts.
  const genericOk = NextResponse.json({ ok: true });

  if (!client) {
    console.error('forgot-password: Sanity write client not configured');
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
      const code = generateCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

      await client.patch(member._id).set({ resetCode: code, resetCodeExpiresAt: expiresAt }).commit();

      const sendResult = await sendEmail({
        to: email,
        subject: `Your Siren Tears reset code: ${code}`,
        html: `
          <div style="font-family: Georgia, serif; color: #26231f;">
            <p>Hi ${member.firstName || ''},</p>
            <p>Use this code to reset your password. It expires in 15 minutes.</p>
            <p style="font-size: 28px; letter-spacing: 6px; font-weight: bold;">${code}</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>— Siren Tears</p>
          </div>
        `
      });
      if (!sendResult.ok) {
        console.error('forgot-password: email send failed for', email, sendResult.error);
      }
    }

    return genericOk;
  } catch (err) {
    console.error('forgot-password failed', err);
    return genericOk;
  }
}
