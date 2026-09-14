'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import ProfileAddressFields from './ProfileAddressFields';

type SessionMember = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneCountryCode?: string;
  phone?: string;
  addressLine?: string;
  city?: string;
  postcode?: string;
  country?: string;
  birthday?: string;
  memberCode?: string;
  isMember?: boolean;
};

export default function MembershipJoinForm() {
  const t = useTranslations('membership.form');
  const tNav = useTranslations('nav');
  const [checking, setChecking] = useState(true);
  const [session, setSession] = useState<SessionMember | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [memberCode, setMemberCode] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => setSession(data.member ?? null))
      .finally(() => setChecking(false));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = new FormData(e.currentTarget);
    const payload = {
      firstName: form.get('firstName')?.toString() || '',
      lastName: form.get('lastName')?.toString() || '',
      birthday: form.get('birthday')?.toString() || '',
      phoneCountryCode: form.get('phoneCountryCode')?.toString() || '',
      phone: form.get('phone')?.toString() || '',
      addressLine: form.get('addressLine')?.toString() || '',
      city: form.get('city')?.toString() || '',
      postcode: form.get('postcode')?.toString() || '',
      country: form.get('country')?.toString() || ''
    };

    try {
      const res = await fetch('/api/membership/join', {
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

  if (checking) {
    return <div className="mt-10 text-center text-[0.85rem] text-ash/60 font-light">…</div>;
  }

  // Not logged in at all — account and membership are separate; you need
  // an account first.
  if (!session) {
    return (
      <div className="mt-10 border border-charcoal/12 bg-ivory p-8 text-center">
        <p className="text-[0.9rem] text-ash font-light leading-relaxed mb-6">
          {t('needAccountFirst')}
        </p>
        <Link
          href="/account"
          className="inline-block text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5"
        >
          {tNav('account')} →
        </Link>
      </div>
    );
  }

  // Logged in and already a member.
  if (session.isMember && status !== 'success') {
    return (
      <div className="mt-10 border border-gold/40 bg-ivory p-6 text-center">
        <p className="serif-display text-[1.2rem] font-light text-charcoal mb-3">
          {t('alreadyMemberTitle')}
        </p>
        <p className="text-[10px] tracking-[0.24em] uppercase text-ash/60 mb-2">{t('codeLabel')}</p>
        <p className="serif-display text-[1.6rem] tracking-[0.15em] text-gold">
          {session.memberCode}
        </p>
        <Link
          href="/account"
          className="inline-block mt-6 text-[11px] tracking-[0.28em] uppercase text-charcoal link-underline"
        >
          {tNav('account')} →
        </Link>
      </div>
    );
  }

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

  // Logged in, not yet a member — complete profile + join.
  return (
    <form onSubmit={handleSubmit} className="mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <label className={labelClass}>{t('firstNameLabel')}</label>
          <input name="firstName" type="text" defaultValue={session.firstName} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('lastNameLabel')}</label>
          <input name="lastName" type="text" defaultValue={session.lastName} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('birthdayLabel')}</label>
          <input name="birthday" type="date" defaultValue={session.birthday} className={inputClass} />
        </div>
        <ProfileAddressFields
          labels={{
            phoneLabel: t('phoneLabel'),
            addressLine: t('addressLineLabel'),
            city: t('cityLabel'),
            postcode: t('postcodeLabel'),
            country: t('countryLabel')
          }}
          defaults={{
            phoneCountryCode: session.phoneCountryCode,
            phone: session.phone,
            addressLine: session.addressLine,
            city: session.city,
            postcode: session.postcode,
            country: session.country
          }}
        />
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
