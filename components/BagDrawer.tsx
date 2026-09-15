'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useBag } from '@/lib/bag-context';
import SizeGuideTrigger from './SizeGuideTrigger';

const BRACELET_CATEGORIES = ['braceletBead', 'braceletChain'];

export default function BagDrawer() {
  const { items, removeItem, isOpen, close } = useBag();
  const t = useTranslations('bag');
  const locale = useLocale();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const needsWristSize = items.some((i) => i.category && BRACELET_CATEGORIES.includes(i.category));
  const needsRingSize = items.some((i) => i.category === 'ring');
  const subtotal = items.reduce((sum, i) => sum + (i.price || 0), 0);

  const inputClass =
    'w-full bg-transparent border-b border-charcoal/20 focus:border-gold outline-none py-2.5 text-[0.9rem] font-light text-charcoal placeholder:text-ash/50 transition-colors';
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
      name: form.get('name')?.toString() || '',
      email: form.get('email')?.toString() || '',
      whatsapp: form.get('whatsapp')?.toString() || '',
      country: form.get('country')?.toString() || '',
      shippingAddress: form.get('shippingAddress')?.toString() || '',
      message: form.get('message')?.toString() || '',
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
        setErrorMsg(data.error || t('errorGeneric'));
        setStatus('error');
        return;
      }
      // Note: we deliberately don't clear the bag or close the drawer here --
      // the browser is about to navigate away to Stripe's checkout page. The
      // bag only gets cleared once payment actually succeeds and the
      // customer lands back on our order-confirmation page.
      window.location.href = data.url;
    } catch {
      setErrorMsg(t('errorGeneric'));
      setStatus('error');
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex justify-end" onClick={close}>
      <div className="absolute inset-0 bg-charcoal/40" />
      <div
        className="relative w-full sm:max-w-[440px] h-full bg-ivory overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-ivory z-10 flex items-center justify-between px-6 pt-6 pb-4 border-b border-charcoal/10">
          <p className="eyebrow">{t('title')}</p>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="text-charcoal/50 hover:text-charcoal text-2xl leading-none px-1"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-6">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[0.9rem] text-ash font-light">{t('empty')}</p>
              <button
                type="button"
                onClick={close}
                className="mt-6 text-[11px] tracking-[0.3em] uppercase text-charcoal link-underline"
              >
                {t('continueCta')}
              </button>
            </div>
          ) : (
            <>
              <ul className="space-y-5 mb-6">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-4">
                    <div className="w-16 h-20 shrink-0 bg-charcoal/5 overflow-hidden">
                      {item.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.9rem] text-charcoal font-light truncate">{item.name}</p>
                      {typeof item.price === 'number' && (
                        <p className="text-[0.82rem] text-ash font-light mt-1">NZD ${item.price}</p>
                      )}
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="mt-1.5 text-[10px] tracking-[0.2em] uppercase text-ash/60 hover:text-charcoal link-underline"
                      >
                        {t('remove')}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between py-4 border-t border-b border-charcoal/10 mb-8">
                <span className="text-[11px] tracking-[0.2em] uppercase text-ash">{t('subtotal')}</span>
                <span className="text-[1.05rem] text-charcoal font-light">NZD ${subtotal}</span>
              </div>

              <p className="eyebrow mb-5">{t('purchaseInfoTitle')}</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={labelClass}>{t('nameLabel')} *</label>
                  <input name="name" type="text" required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t('emailLabel')} *</label>
                  <input name="email" type="email" required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t('whatsappLabel')}</label>
                  <input name="whatsapp" type="tel" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t('countryLabel')}</label>
                  <input name="country" type="text" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t('shippingAddressLabel')}</label>
                  <textarea name="shippingAddress" rows={2} className={inputClass} />
                </div>

                {needsWristSize && (
                  <div>
                    <label className={labelClass}>{t('wristSizeLabel')}</label>
                    <input name="wristSize" type="text" inputMode="decimal" className={inputClass} />
                    <SizeGuideTrigger type="bracelet" />
                  </div>
                )}
                {needsRingSize && (
                  <div>
                    <label className={labelClass}>{t('ringSizeLabel')}</label>
                    <input name="ringSize" type="text" className={inputClass} />
                    <SizeGuideTrigger type="ring" />
                  </div>
                )}

                <div>
                  <label className={labelClass}>{t('messageLabel')}</label>
                  <textarea name="message" rows={3} className={inputClass} />
                </div>

                {status === 'error' && (
                  <p className="text-[0.8rem] text-red-700/80 font-light">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
                >
                  {status === 'submitting' ? t('submitting') : t('submitCta')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
