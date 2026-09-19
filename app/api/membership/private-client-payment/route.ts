import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Stripe from 'stripe';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { convertFromNzd, isCurrency } from '@/lib/currency';

export const runtime = 'nodejs';
const PRIVATE_CLIENT_PRICE_NZD = 999;

export async function POST(request: Request) {
  const session = verifySessionToken(cookies().get(SESSION_COOKIE_NAME)?.value);
  if (!session) return NextResponse.json({ ok: false, error: 'Please sign in first.' }, { status: 401 });

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return NextResponse.json({ ok: false, error: 'Card payments are not configured.' }, { status: 503 });

  const body = await request.json().catch(() => ({}));
  const currency = isCurrency(body.currency) ? body.currency : 'NZD';
  const convertedAmount = convertFromNzd(PRIVATE_CLIENT_PRICE_NZD, currency);
  const amountMinor = Math.round(convertedAmount * 100);

  try {
    const stripe = new Stripe(key);
    const intent = await stripe.paymentIntents.create({
      amount: amountMinor,
      currency: currency.toLowerCase(),
      receipt_email: session.email,
      payment_method_types: ['card'],
      metadata: {
        type: 'private_client_membership',
        memberId: session.id,
        basePriceNzd: String(PRIVATE_CLIENT_PRICE_NZD)
      }
    });
    return NextResponse.json({ ok: true, clientSecret: intent.client_secret });
  } catch (error) {
    console.error('Private Client payment creation failed', error);
    return NextResponse.json({ ok: false, error: 'Unable to start payment. Please try again.' }, { status: 500 });
  }
}
