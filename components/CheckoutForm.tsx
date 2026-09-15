'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useBag } from '@/lib/bag-context';
import { calculateShipping, freeShippingThreshold } from '@/lib/shipping';
import SizeGuideTrigger from './SizeGuideTrigger';
import CheckoutHeader from './CheckoutHeader';
import PhoneInput from './PhoneInput';
import RecommendedProducts from './RecommendedProducts';
import StripePaymentSection from './StripePaymentSection';

const BRACELET_CATEGORIES = ['braceletBead', 'braceletChain'];

type MemberPrefill = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  phoneCountryCode?: string;
  addressLine?: string;
  city?: string;
  postcode?: string;
  country?: string;
  isMember?: boolean;
};

export default function CheckoutForm() {
  const { items } = useBag();
  const t = useTranslations('checkout');
  const tBag = useTranslations('bag');
  const locale = useLocale();

  const [member, setMember] = useState<MemberPrefill | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [country, setCountry] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [showMembershipPrompt, setShowMembershipPrompt] = useState(false);
  const [membershipPromptAcknowledged, setMembershipPromptAcknowledged] = useState(false);
  const pendingPayloadRef = useRef<Record<string, unknown> | null>(null);

  // If the customer is already logged into My Siren, prefill what we can --
  // spec item 6: auto-fill email (and it's a nicer experience to prefill the
  // rest of the delivery details too, since we already have them on file).
  // We also use this to require login before paying (see handleSubmit).
  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.member) {
          setMember(data.member);
          if (data.member.country) setCountry(data.member.country);
        }
        setAuthChecked(true);
      })
      .catch(() => {
        if (!cancelled) setAuthChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const needsWristSize = items.some((i) => i.category && BRACELET_CATEGORIES.includes(i.category));
  const needsRingSize = items.some((i) => i.category === 'ring');
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + (i.price || 0), 0), [items]);
  const shippingQuote = useMemo(
    () => calculateShipping({ subtotal, country, isMember: member?.isMember }),
    [subtotal, country, member?.isMember]
  );
  const total = subtotal + shippingQuote.cost;
  const threshold = freeShippingThreshold(member?.isMember);
  const amountToFreeShipping = Math.max(0, threshold - subtotal);

  const inputClass =
    'w-full bg-white border border-charcoal/20 focus:border-charcoal outline-none px-3.5 py-2.5 text-[0.8rem] font-light text-charcoal placeholder:text-ash/60 placeholder:uppercase placeholder:tracking-[0.08em] placeholder:text-[0.7rem] transition-colors';

  async function proceedToPayment(payload: Record<string, unknown>) {
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.clientSecret) {
        setErrorMsg(data.error || tBag('errorGeneric'));
        setStatus('error');
        return;
      }
      setClientSecret(data.clientSecret);
      setOrderNumber(data.orderNumber);
      setStatus('idle');
    } catch {
      setErrorMsg(tBag('errorGeneric'));
      setStatus('error');
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg('');

    // Require login before paying -- guests can browse and fill in the
    // form, but must sign in to actually complete a purchase.
    if (!member) {
      setErrorMsg(t('loginRequiredMessage'));
      return;
    }

    const form = new FormData(e.currentTarget);
    const payload = {
      items: items.map((i) => ({
        productSlug: i.slug,
        imageUrl: i.imageUrl,
        productName: i.name,
        price: i.price,
        wristSize: needsWristSize ? form.get('wristSize')?.toString() || '' : '',
        ringSize: needsRingSize ? form.get('ringSize')?.toString() || '' : ''
      })),
      name: `${form.get('firstName') || ''} ${form.get('lastName') || ''}`.trim(),
      email: form.get('email')?.toString() || '',
      whatsapp: `${form.get('phoneCode') || ''} ${form.get('phoneNumber') || ''}`.trim(),
      country: form.get('country')?.toString() || '',
      deliveryFirstName: form.get('firstName')?.toString() || '',
      deliveryLastName: form.get('lastName')?.toString() || '',
      deliveryCompany: form.get('company')?.toString() || '',
      deliveryAddress: form.get('address')?.toString() || '',
      deliveryCity: form.get('city')?.toString() || '',
      deliveryRegion: form.get('region')?.toString() || '',
      deliveryPostalCode: form.get('postalCode')?.toString() || '',
      message: '',
      locale
    };

    // Non-members get a one-time promo interstitial ("join for free
    // shipping over $400 + a free pouch") before continuing -- doesn't
    // block them, just a nudge.
    if (!member.isMember && !membershipPromptAcknowledged) {
      pendingPayloadRef.current = payload;
      setShowMembershipPrompt(true);
      return;
    }

    await proceedToPayment(payload);
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <CheckoutHeader />
        <div className="max-w-lg mx-auto text-center py-24 px-6">
          <p className="serif-display text-[1.4rem] font-light text-charcoal mb-6">{t('emptyBagTitle')}</p>
          <Link
            href="/shop"
            className="inline-block text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5"
          >
            {t('emptyBagCta')}
          </Link>
        </div>
      </div>
    );
  }

  const OrderSummaryList = (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.productId} className="flex gap-3">
          <div className="w-14 h-16 shrink-0 bg-charcoal/5 overflow-hidden">
            {item.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[0.85rem] text-charcoal font-light leading-snug">{item.name}</p>
            <p className="text-[0.75rem] text-ash/70 font-light mt-1">Qty 1</p>
          </div>
          {typeof item.price === 'number' && (
            <p className="text-[0.85rem] text-charcoal font-light shrink-0">NZD ${item.price}</p>
          )}
        </li>
      ))}
    </ul>
  );

  const OrderTotals = (
    <div className="space-y-2 pt-4 mt-4 border-t border-charcoal/10 text-[0.85rem] font-light">
      <div className="flex justify-between text-ash">
        <span>{t('subtotalLabel')}</span>
        <span>NZD ${subtotal}</span>
      </div>
      <div className="flex justify-between text-ash">
        <span>{t('shippingLabel')}</span>
        <span>{shippingQuote.cost === 0 ? t('freeLabel') : `NZD $${shippingQuote.cost}`}</span>
      </div>
      <div className="flex justify-between text-charcoal text-[1rem] pt-2 border-t border-charcoal/10">
        <span>{t('totalLabel')}</span>
        <span>NZD ${total}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <CheckoutHeader />

      <div className="mx-auto max-w-[1100px] px-6 md:px-12 py-10 md:py-14 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        {/* Mobile: collapsible order summary at top */}
        <div className="md:hidden border border-charcoal/10">
          <button
            type="button"
            onClick={() => setSummaryOpen((o) => !o)}
            className="w-full flex items-center justify-between px-5 py-4"
          >
            <span className="text-[11px] tracking-[0.24em] uppercase text-charcoal">
              {t('orderSummaryTitle')} {summaryOpen ? '−' : '+'}
            </span>
            <span className="text-[0.95rem] text-charcoal font-light">NZD ${total}</span>
          </button>
          {summaryOpen && (
            <div className="px-5 pb-5">
              {OrderSummaryList}
              {OrderTotals}
              <div className="mt-6 pt-6 border-t border-charcoal/10">
                <RecommendedProducts />
              </div>
            </div>
          )}
        </div>

        {/* Left column: form */}
        <form onSubmit={handleSubmit} className="md:col-span-7 space-y-10">
          <fieldset disabled={Boolean(clientSecret)} className="space-y-10 disabled:opacity-60">
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="eyebrow">{t('contactTitle')}</p>
              <Link href="/account" className="text-[11px] tracking-[0.2em] uppercase text-charcoal link-underline">
                {t('signInCta')}
              </Link>
            </div>
            <input
              name="email"
              type="email"
              required
              placeholder={`${t('emailLabel')} *`}
              defaultValue={member?.email}
              className={inputClass}
            />
          </section>

          <section>
            <p className="eyebrow mb-3">{t('deliveryTitle')}</p>
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  name="firstName"
                  required
                  placeholder={`${t('firstNameLabel')} *`}
                  defaultValue={member?.firstName}
                  className={inputClass}
                />
                <input
                  name="lastName"
                  required
                  placeholder={`${t('lastNameLabel')} *`}
                  defaultValue={member?.lastName}
                  className={inputClass}
                />
              </div>
              <input name="company" placeholder={t('companyLabel')} className={inputClass} />
              <input
                name="address"
                required
                placeholder={`${t('addressLabel')} *`}
                defaultValue={member?.addressLine}
                className={inputClass}
              />
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  name="city"
                  required
                  placeholder={`${t('cityLabel')} *`}
                  defaultValue={member?.city}
                  className={inputClass}
                />
                <input name="region" placeholder={t('regionLabel')} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  name="postalCode"
                  required
                  placeholder={`${t('postalCodeLabel')} *`}
                  defaultValue={member?.postcode}
                  className={inputClass}
                />
                <input
                  name="country"
                  required
                  placeholder={`${t('countryLabel')} *`}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={inputClass}
                />
              </div>
              <PhoneInput
                name="phone"
                placeholder={`${t('phoneLabel')} *`}
                defaultCallingCode={member?.phoneCountryCode || '+64'}
                defaultNumber={member?.phone}
                required
              />

              {needsWristSize && (
                <div>
                  <input name="wristSize" type="text" inputMode="decimal" placeholder={tBag('wristSizeLabel')} className={inputClass} />
                  <SizeGuideTrigger type="bracelet" />
                </div>
              )}
              {needsRingSize && (
                <div>
                  <input name="ringSize" type="text" placeholder={tBag('ringSizeLabel')} className={inputClass} />
                  <SizeGuideTrigger type="ring" />
                </div>
              )}
            </div>
          </section>

          <section>
            <p className="eyebrow mb-4">{t('shippingMethodTitle')}</p>
            {country ? (
              <>
                <div className="border border-charcoal/15 px-4 py-3.5 flex items-center justify-between text-[0.85rem] font-light">
                  <span className="text-charcoal">{shippingQuote.label}</span>
                  <span className="text-ash">{shippingQuote.cost === 0 ? t('freeLabel') : `NZD $${shippingQuote.cost}`}</span>
                </div>
                {amountToFreeShipping > 0 && (
                  <p className="mt-3 text-[0.8rem] text-ash/80 font-light">
                    {member?.isMember
                      ? t('freeShippingProgressMember', { amount: amountToFreeShipping })
                      : t('freeShippingProgress', { amount: amountToFreeShipping })}
                    {!member?.isMember && (
                      <>
                        {' '}
                        <Link href="/membership" className="text-charcoal link-underline">
                          {t('joinMembershipCta')}
                        </Link>
                      </>
                    )}
                  </p>
                )}
              </>
            ) : (
              <p className="text-[0.85rem] text-ash/70 font-light">{t('shippingMethodEnterAddress')}</p>
            )}
          </section>
          </fieldset>

          {!clientSecret && (
            <>
              {errorMsg && (
                <p className="text-[0.8rem] text-red-700/80 font-light">
                  {errorMsg}
                  {!member && authChecked && (
                    <>
                      {' '}
                      <Link href="/account" className="text-charcoal link-underline">
                        {t('signInCta')}
                      </Link>
                    </>
                  )}
                </p>
              )}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-4 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
                >
                  {status === 'submitting' ? t('redirecting') : t('continueToPaymentCta')}
                </button>
              </div>
            </>
          )}

          {clientSecret && orderNumber && (
            <div className="animate-slide-down">
              <StripePaymentSection
                clientSecret={clientSecret}
                locale={locale}
                returnUrl={`${window.location.origin}${locale === 'en' ? '' : `/${locale}`}/order-confirmation?order=${orderNumber}`}
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2 text-charcoal border-t border-charcoal/10">
            <span className="text-[11px] tracking-[0.2em] uppercase pt-4">{t('totalLabel')}</span>
            <span className="text-[1.2rem] font-light pt-4">NZD ${total}</span>
          </div>
        </form>

        {/* Right column: order summary, desktop only */}
        <aside className="hidden md:block md:col-span-5">
          <div className="sticky top-28 border border-charcoal/10 px-6 py-6">
            <p className="eyebrow mb-5">{t('orderSummaryTitle')}</p>
            {OrderSummaryList}
            {OrderTotals}
            <div className="mt-8 pt-8 border-t border-charcoal/10">
              <RecommendedProducts />
            </div>
          </div>
        </aside>
      </div>

      {showMembershipPrompt && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-charcoal/50 px-6"
          onClick={() => setShowMembershipPrompt(false)}
        >
          <div
            className="bg-white max-w-sm w-full px-7 py-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="eyebrow mb-4">{t('membershipPromoTitle')}</p>
            <p className="text-[0.88rem] text-ash font-light leading-relaxed mb-7">{t('membershipPromoBody')}</p>
            <Link
              href="/membership"
              className="block w-full text-center text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5 mb-3 hover:bg-charcoal/85 transition-colors"
            >
              {t('joinMembershipCta')}
            </Link>
            <button
              type="button"
              onClick={() => {
                setShowMembershipPrompt(false);
                setMembershipPromptAcknowledged(true);
                if (pendingPayloadRef.current) {
                  proceedToPayment(pendingPayloadRef.current);
                }
              }}
              className="w-full text-center text-[11px] tracking-[0.2em] uppercase text-charcoal link-underline py-2"
            >
              {t('continueWithoutMembershipCta')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
