import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

// Visit /api/debug/test-email?to=you@example.com in the browser directly.
// Shows exactly what happened -- whether RESEND_API_KEY is even present,
// and if not, the raw error Resend returned. Remove this route once email
// is confirmed working; it's for troubleshooting only and not linked from
// anywhere in the site.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const to = url.searchParams.get('to');

  if (!to) {
    return NextResponse.json({
      ok: false,
      hint: 'Add ?to=you@example.com to the URL to send a test email.'
    });
  }

  const hasKey = !!process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'Siren Tears <onboarding@resend.dev>';

  const result = await sendEmail({
    to,
    subject: 'Siren Tears — test email',
    html: '<p>If you can read this, email sending is working.</p>'
  });

  return NextResponse.json({
    hasResendApiKey: hasKey,
    fromAddress: from,
    sendResult: result
  });
}
