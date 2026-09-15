'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useBag } from '@/lib/bag-context';
import { calculateShipping } from '@/lib/shipping';
import SizeGuideTrigger from './SizeGuideTrigger';
import CheckoutHeader from './CheckoutHeader';

const BRACELET_CATEGORIES = ['braceletBead', 'braceletChain'];

type MemberPrefill = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  addressLine?: string;
  city?: string;
  postcode?: string;
  country?: string;
};

export default function CheckoutForm() {
  const { items } = useBag();
  const t = useTranslations('checkout');
  const tBag = useTranslations('bag');
  const locale = useLocale();

  const [member, setMember] = useState<MemberPrefill | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [country, setCountry] = useState('');

  // If the customer is already logged into My Siren, prefill what we can --
  // spec item 6: auto-fill email (and it's a nicer experience to prefill the
  // rest of the delivery details too, since we already have them on file).
  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data?.member) {
          setMember(data.member);
          if (data.member.country) setCountry(data.member.country);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const needsWristSize = items.some((i) => i.category && BRACELET_CATEGORIES.includes(i.category));
  const needsRingSize = items.some((i) => i.category === 'ring');
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + (i.price || 0), 0), [items]);
  const shippingQuote = useMemo(() => calculateShipping({ subtotal, country }), [subtotal, country]);
  const total = subtotal + shippingQuote.cost;

  const inputClass =
    'w-full bg-transparent border border-charcoal/20 focus:border-charcoal outline-none px-4 py-3 text-[0.9rem] font-light text-charcoal placeholder:text-ash/50 transition-colors';
  const labelClass = 'block text-[10px] tracking-[0.24em] uppercase text-ash mb-1.5 font-light';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = new FormData(e.currentTarget);
    const payload = {
      items: items.map((i) => ({
        productSlug: i.slug,
        productName: i.name,
        price: i.price,
        wristSize: needsWristSize ? form.get('wristSize')?.toString() || '' : '',
        ringSize: needsRingSize ? form.get('ringSize')?.toString() || '' : ''
      })),
      name: `${form.get('firstName') || ''} ${form.get('lastName') || ''}`.trim(),
      email: form.get('email')?.toString() || '',
      whatsapp: form.get('phone')?.toString() || '',
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

    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.url) {
        setErrorMsg(data.error || tBag('errorGeneric'));
        setStatus('error');
        return;
      }
      window.location.href = data.url;
    } catch {
      setErrorMsg(tBag('errorGeneric'));
      setStatus('error');
    }
  }

  if (items.length === 0) {
    return (
      <>
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
      </>
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
    <>
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
            </div>
          )}
        </div>

        {/* Left column: form */}
        <form onSubmit={handleSubmit} className="md:col-span-7 space-y-10">
          <section>
            <div className="flex items-center justify-between mb-4">
              <p className="eyebrow">{t('contactTitle')}</p>
              <Link href="/account" className="text-[11px] tracking-[0.2em] uppercase text-charcoal link-underline">
                {t('signInCta')}
              </Link>
            </div>
            <label className={labelClass}>{t('emailLabel')} *</label>
            <input
              name="email"
              type="email"
              required
              defaultValue={member?.email}
              className={inputClass}
            />
          </section>

          <section>
            <p className="eyebrow mb-4">{t('deliveryTitle')}</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('firstNameLabel')} *</label>
                  <input name="firstName" required defaultValue={member?.firstName} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t('lastNameLabel')} *</label>
                  <input name="lastName" required defaultValue={member?.lastName} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>{t('companyLabel')}</label>
                <input name="company" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t('addressLabel')} *</label>
                <input name="address" required defaultValue={member?.addressLine} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('cityLabel')} *</label>
                  <input name="city" required defaultValue={member?.city} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t('regionLabel')}</label>
                  <input name="region" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('postalCodeLabel')} *</label>
                  <input
                    name="postalCode"
                    required
                    defaultValue={member?.postcode}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t('countryLabel')} *</label>
                  <input
                    name="country"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>{t('phoneLabel')} *</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  defaultValue={member?.phone}
                  className={inputClass}
                />
              </div>

              {needsWristSize && (
                <div>
                  <label className={labelClass}>{tBag('wristSizeLabel')}</label>
                  <input name="wristSize" type="text" inputMode="decimal" className={inputClass} />
                  <SizeGuideTrigger type="bracelet" />
                </div>
              )}
              {needsRingSize && (
                <div>
                  <label className={labelClass}>{tBag('ringSizeLabel')}</label>
                  <input name="ringSize" type="text" className={inputClass} />
                  <SizeGuideTrigger type="ring" />
                </div>
              )}
            </div>
          </section>

          <section>
            <p className="eyebrow mb-4">{t('shippingMethodTitle')}</p>
            {country ? (
              <div className="border border-charcoal/15 px-4 py-3.5 flex items-center justify-between text-[0.85rem] font-light">
                <span className="text-charcoal">{shippingQuote.label}</span>
                <span className="text-ash">{shippingQuote.cost === 0 ? t('freeLabel') : `NZD $${shippingQuote.cost}`}</span>
              </div>
            ) : (
              <p className="text-[0.85rem] text-ash/70 font-light">{t('shippingMethodEnterAddress')}</p>
            )}
          </section>

          <section>
            <p className="eyebrow mb-1.5">{t('paymentTitle')}</p>
            <p className="text-[0.78rem] text-ash/70 font-light mb-4">{t('paymentSubtitle')}</p>
            <div className="border border-charcoal/15 px-5 py-6 text-[0.85rem] text-ash font-light leading-relaxed">
              {t('paymentNote')}
            </div>
          </section>

          {status === 'error' && <p className="text-[0.8rem] text-red-700/80 font-light">{errorMsg}</p>}

          <div className="pt-2">
            <div className="flex items-center justify-between mb-4 text-charcoal">
              <span className="text-[11px] tracking-[0.2em] uppercase">{t('totalLabel')}</span>
              <span className="text-[1.2rem] font-light">NZD ${total}</span>
            </div>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-4 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
            >
              {status === 'submitting' ? t('redirecting') : t('payNowCta')}
            </button>
          </div>
        </form>

        {/* Right column: order summary, desktop only */}
        <aside className="hidden md:block md:col-span-5">
          <div className="sticky top-28 border border-charcoal/10 px-6 py-6">
            <p className="eyebrow mb-5">{t('orderSummaryTitle')}</p>
            {OrderSummaryList}
            {OrderTotals}
          </div>
        </aside>
      </div>
    </>
  );
}
