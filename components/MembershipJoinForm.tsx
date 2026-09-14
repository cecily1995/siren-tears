'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function MembershipJoinForm() {
  const t = useTranslations('membership.form');
  const tAccount = useTranslations('account');
  const tNav = useTranslations('nav');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [memberCode, setMemberCode] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = new FormData(e.currentTarget);
    const payload = {
      firstName: form.get('firstName')?.toString() || '',
      lastName: form.get('lastName')?.toString() || '',
      birthday: form.get('birthday')?.toString() || '',
      email: form.get('email')?.toString() || '',
      password: form.get('password')?.toString() || '',
      phone: form.get('phone')?.toString() || '',
      address: form.get('address')?.toString() || '',
      country: form.get('country')?.toString() || ''
    };

    try {
      const res = await fetch('/api/auth/register', {
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
      setMemberCode(data.memberCode);
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
      <div className="mt-10 border border-gold/40 bg-ivory p-6 text-center">
        <p className="serif-display text-[1.2rem] font-light text-charcoal mb-3">
          {t('successTitle')}
        </p>
        <p className="text-[0.85rem] leading-[1.8] text-ash font-light mb-5">{t('successBody')}</p>
        <p className="text-[10px] tracking-[0.24em] uppercase text-ash/60 mb-2">{t('codeLabel')}</p>
        <p className="serif-display text-[1.6rem] tracking-[0.15em] text-gold">{memberCode}</p>
        <Link
          href="/account"
          className="inline-block mt-6 text-[11px] tracking-[0.28em] uppercase text-charcoal link-underline"
        >
          {tNav('account')} →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <label className={labelClass}>{t('firstNameLabel')} *</label>
          <input name="firstName" type="text" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('lastNameLabel')}</label>
          <input name="lastName" type="text" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('emailLabel')} *</label>
          <input name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{tAccount('passwordLabel')} *</label>
          <input name="password" type="password" required minLength={8} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('phoneLabel')}</label>
          <input name="phone" type="tel" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('birthdayLabel')}</label>
          <input name="birthday" type="date" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('addressLabel')}</label>
          <input name="address" type="text" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('countryLabel')}</label>
          <input name="country" type="text" className={inputClass} />
        </div>
      </div>

      {status === 'error' && (
        <p className="mt-4 text-[0.8rem] text-red-700/80 font-light">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-8 w-full sm:w-auto text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
      >
        {status === 'submitting' ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
