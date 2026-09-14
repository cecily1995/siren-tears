// Minimal email sender using Resend's HTTP API directly (no extra npm
// dependency). Requires RESEND_API_KEY. Until a custom sending domain is
// verified in Resend, EMAIL_FROM can stay as Resend's shared test address
// ("onboarding@resend.dev") -- it works immediately but should be swapped
// for something like "studio@sirentears.com" once the domain is verified
// in the Resend dashboard.

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'Siren Tears <onboarding@resend.dev>';

  if (!apiKey) {
    return { ok: false, error: 'Email is not connected yet (missing RESEND_API_KEY).' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from, to, subject, html })
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('Resend send failed', res.status, body);
      return { ok: false, error: 'Email provider rejected the message.' };
    }

    return { ok: true };
  } catch (err) {
    console.error('Email send error', err);
    return { ok: false, error: 'Could not reach the email provider.' };
  }
}
