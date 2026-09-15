'use client';

import { useEffect, useRef, useState } from 'react';
import { loadStripe, type StripeElementLocale } from '@stripe/stripe-js';
import {
  Elements,
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import { useTranslations } from 'next-intl';
import { useBag } from '@/lib/bag-context';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

// Shared by both the Express Checkout button (Apple Pay / Google Pay / Link,
// whichever the browser/device/account actually support) and the manual
// "Pay Now" button below -- both ultimately call stripe.confirmPayment the
// same way, they just gather the payment details differently first.
async function confirmAndFinish({
  stripe,
  elements,
  returnUrl,
  clearBag,
  onError,
  onBusy
}: {
  stripe: NonNullable<ReturnType<typeof useStripe>>;
  elements: NonNullable<ReturnType<typeof useElements>>;
  returnUrl: string;
  clearBag: () => void;
  onError: (msg: string) => void;
  onBusy: (busy: boolean) => void;
}) {
  onBusy(true);
  onError('');

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: { return_url: returnUrl },
    redirect: 'if_required'
  });

  if (error) {
    // Card declined, etc -- stay on this page so they can try again. The
    // inventory hold is released separately by the
    // payment_intent.payment_failed webhook, not here.
    onError(error.message || 'Something went wrong with your payment. Please try again.');
    onBusy(false);
    return;
  }

  // No redirect was needed (e.g. a plain card payment with no 3D Secure
  // step) -- payment succeeded right here, so move on ourselves. Clear the
  // bag now that the purchase is actually confirmed.
  clearBag();
  window.location.href = returnUrl;
}

function ExpressCheckout({
  returnUrl,
  onError,
  onAvailability
}: {
  returnUrl: string;
  onError: (msg: string) => void;
  onAvailability: (available: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { clear } = useBag();
  const [busy, setBusy] = useState(false);

  return (
    <ExpressCheckoutElement
      onReady={(event) => onAvailability(Boolean(event.availablePaymentMethods))}
      onConfirm={async () => {
        if (!stripe || !elements || busy) return;
        const { error: submitError } = await elements.submit();
        if (submitError) {
          onError(submitError.message || 'Something went wrong with your payment. Please try again.');
          return;
        }
        await confirmAndFinish({ stripe, elements, returnUrl, clearBag: clear, onError, onBusy: setBusy });
      }}
    />
  );
}

function PayButton({ returnUrl, onError }: { returnUrl: string; onError: (msg: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const t = useTranslations('checkout');
  const { clear } = useBag();
  const [submitting, setSubmitting] = useState(false);

  async function handlePay() {
    if (!stripe || !elements) return;
    const { error: submitError } = await elements.submit();
    if (submitError) {
      onError(submitError.message || t('paymentError'));
      return;
    }
    await confirmAndFinish({ stripe, elements, returnUrl, clearBag: clear, onError, onBusy: setSubmitting });
  }

  return (
    <button
      type="button"
      onClick={handlePay}
      disabled={!stripe || submitting}
      className="w-full text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-4 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
    >
      {submitting ? t('redirecting') : t('payNowCta')}
    </button>
  );
}

export default function StripePaymentSection({
  clientSecret,
  returnUrl,
  locale
}: {
  clientSecret: string;
  returnUrl: string;
  locale?: string;
}) {
  const t = useTranslations('checkout');
  const [errorMsg, setErrorMsg] = useState('');
  const [expressAvailable, setExpressAvailable] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Bring the card form into view the moment it appears, rather than
  // leaving the customer to notice it further down the page and scroll
  // manually.
  useEffect(() => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (!stripePromise) {
    return (
      <p className="text-[0.85rem] text-red-700/80 font-light">
        Card payments are not configured (missing publishable key).
      </p>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        locale: (locale as StripeElementLocale) || 'auto',
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#26231f',
            colorBackground: '#ffffff',
            colorText: '#26231f',
            colorDanger: '#b3261e',
            fontFamily: 'inherit',
            borderRadius: '0px',
            spacingUnit: '4px'
          },
          rules: {
            '.Input': { border: '1px solid rgba(38,35,31,0.2)', boxShadow: 'none', padding: '12px' },
            '.Input:focus': { border: '1px solid #26231f', boxShadow: 'none' },
            '.Label': {
              fontSize: '10px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#6b6660',
              fontWeight: '400'
            }
          }
        }
      }}
    >
      <div ref={sectionRef}>
        {/* Only shows a title/divider if Apple Pay / Google Pay / Link etc are
            actually available -- never a fake row with nothing in it. */}
        <div className={expressAvailable ? 'space-y-3' : ''}>
          {expressAvailable && <p className="text-[10px] tracking-[0.24em] uppercase text-ash">{t('expressCheckoutTitle')}</p>}
          <ExpressCheckout returnUrl={returnUrl} onError={setErrorMsg} onAvailability={setExpressAvailable} />
          {expressAvailable && (
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-charcoal/10" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-ash/60">{t('orDivider')}</span>
              <div className="flex-1 h-px bg-charcoal/10" />
            </div>
          )}
        </div>

        <div className="mt-6">
          <p className="eyebrow mb-1.5">{t('paymentTitle')}</p>
          <p className="text-[0.78rem] text-ash/70 font-light mb-4">{t('paymentSubtitle')}</p>
          <PaymentElement options={{ layout: 'tabs' }} />
        </div>

        {errorMsg && <p className="mt-4 text-[0.8rem] text-red-700/80 font-light">{errorMsg}</p>}

        <div className="mt-6">
          <PayButton returnUrl={returnUrl} onError={setErrorMsg} />
        </div>
      </div>
    </Elements>
  );
}
