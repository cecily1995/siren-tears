'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function RequestPurchaseForm({
  productName,
  productSlug,
  whatsappUrl,
  email
}: {
  productName: string;
  productSlug: string;
  whatsappUrl: string;
  email?: string;
}) {
  const t = useTranslations('shop.requestForm');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = new FormData(e.currentTarget);
    const payload = {
      productName,
      productSlug,
      name: form.get('name')?.toString() || '',
      email: form.get('email')?.toString() || '',
      whatsapp: form.get('whatsapp')?.toString() || '',
      country: form.get('country')?.toString() || '',
      shippingAddress: form.get('shippingAddress')?.toString() || '',
      message: form.get('message')?.toString() || ''
    };

    try {
      const res = await fetch('/api/purchase-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || t('errorGeneric'));
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setErrorMsg(t('errorGeneric'));
      setStatus('error');
    }
  }

  const inputClass =
    'w-full bg-transparent border-b border-charcoal/20 focus:border-gold outline-none py-2.5 text-[0.9rem] font-light text-charcoal placeholder:text-ash/50 transition-colors';
  const labelClass = 'block text-[10px] tracking-[0.24em] uppercase text-ash mb-1.5 font-light';

  if (status === 'success') {
    return (
      <div className="border border-charcoal/12 p-6 reveal">
        <p className="serif-display text-[1.25rem] font-light text-charcoal mb-3">
          {t('successTitle')}
        </p>
        <p className="text-[0.88rem] leading-[1.8] text-ash font-light">{t('successBody')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-charcoal/12 p-6">
      <p className="text-[0.88rem] text-ash font-light leading-relaxed mb-6">{t('intro')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
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
        <div className="sm:col-span-2">
          <label className={labelClass}>{t('addressLabel')}</label>
          <input name="shippingAddress" type="text" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{t('messageLabel')}</label>
          <textarea name="message" rows={2} className={`${inputClass} resize-none`} />
        </div>
      </div>

      {status === 'error' && (
        <p className="mt-4 text-[0.8rem] text-red-700/80 font-light">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-6 w-full sm:w-auto text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
      >
        {status === 'submitting' ? t('submitting') : t('submit')}
      </button>

      <div className="mt-5 flex items-center gap-5 text-[0.8rem] text-ash/70 font-light">
        <span>{t('orContact')}</span>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-charcoal link-underline">
          WhatsApp
        </a>
        {email && (
          <a
            href={`mailto:${email}?subject=${encodeURIComponent(productName)}`}
            className="text-charcoal link-underline"
          >
            Email
          </a>
        )}
      </div>
    </form>
  );
}
