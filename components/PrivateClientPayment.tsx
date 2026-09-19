'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, type StripeElementLocale } from '@stripe/stripe-js';
import { Link } from '@/i18n/routing';
import { useCurrency } from '@/lib/currency-context';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function PaymentForm({ successUrl }: { successUrl: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const t = useTranslations('membership');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function pay() {
    if (!stripe || !elements) return;
    setBusy(true);
    setError('');
    const submitted = await elements.submit();
    if (submitted.error) {
      setError(submitted.error.message || t('privatePaymentError'));
      setBusy(false);
      return;
    }
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: successUrl },
      redirect: 'if_required'
    });
    if (result.error) {
      setError(result.error.message || t('privatePaymentError'));
      setBusy(false);
      return;
    }
    window.location.href = successUrl;
  }

  return (
    <div className="mt-6 text-left">
      <PaymentElement options={{ layout: 'tabs', wallets: { link: 'never' } }} />
      {error && <p className="mt-4 text-[0.8rem] text-red-700">{error}</p>}
      <button type="button" onClick={pay} disabled={!stripe || busy} className="mt-5 w-full bg-charcoal text-ivory px-8 py-4 text-[10px] tracking-[0.28em] uppercase disabled:opacity-50">
        {busy ? t('privatePaymentProcessing') : t('privatePaymentCta')}
      </button>
    </div>
  );
}

export default function PrivateClientPayment() {
  const t = useTranslations('membership');
  const locale = useLocale();
  const { currency, format } = useCurrency();
  const [auth, setAuth] = useState<'checking' | 'guest' | 'member'>('checking');
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me').then((response) => response.json()).then((data) => setAuth(data.member ? 'member' : 'guest')).catch(() => setAuth('guest'));
  }, []);

  async function beginPayment() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/membership/private-client-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency })
      });
      const data = await response.json();
      if (!response.ok || !data.clientSecret) throw new Error(data.error || t('privatePaymentError'));
      setClientSecret(data.clientSecret);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('privatePaymentError'));
    } finally {
      setLoading(false);
    }
  }

  const successUrl = `${typeof window === 'undefined' ? '' : window.location.origin}${locale === 'en' ? '' : `/${locale}`}/membership/private-client?payment=success`;

  return (
    <div className="border border-charcoal/15 bg-white p-6 md:p-8 text-left">
      <p className="eyebrow mb-3">{t('privatePaymentTitle')}</p>
      <p className="text-[0.88rem] leading-[1.7] text-ash font-light">{t('privatePaymentBody')}</p>
      <p className="serif-display text-[1.65rem] text-charcoal mt-5">{format(999)}</p>
      {auth === 'guest' && <Link href="/account" className="mt-6 block text-center bg-charcoal text-ivory px-8 py-4 text-[10px] tracking-[0.28em] uppercase">{t('privatePaymentSignIn')}</Link>}
      {auth === 'member' && !clientSecret && <button type="button" onClick={beginPayment} disabled={loading} className="mt-6 w-full bg-charcoal text-ivory px-8 py-4 text-[10px] tracking-[0.28em] uppercase disabled:opacity-50">{loading ? t('privatePaymentProcessing') : t('privatePaymentStart')}</button>}
      {error && <p className="mt-4 text-[0.8rem] text-red-700">{error}</p>}
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret, locale: locale as StripeElementLocale, appearance: { theme: 'stripe', variables: { colorPrimary: '#26231f', borderRadius: '0px' } } }}>
          <PaymentForm successUrl={successUrl} />
        </Elements>
      )}
    </div>
  );
}
