'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import ProfileAddressFields from './ProfileAddressFields';

type Member = {
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
  tier?: string;
  isMember?: boolean;
  joinedAt?: string;
};

type PurchaseItem = {
  productName?: string;
  itemCount?: number;
  status?: string;
  trackingNumber?: string;
  _createdAt?: string;
};
type BespokeItem = { _id?: string; pieceType?: string; status?: string; _createdAt?: string };

function EditProfileForm({
  member,
  onCancel,
  onSaved
}: {
  member: Member;
  onCancel: () => void;
  onSaved: (updates: Partial<Member>) => void;
}) {
  const t = useTranslations('account');
  const tForm = useTranslations('membership.form');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [saveError, setSaveError] = useState('');
  const inputClass =
    'w-full bg-transparent border-b border-charcoal/20 focus:border-gold outline-none py-2.5 text-[0.9rem] font-light text-charcoal placeholder:text-ash/50 transition-colors';
  const labelClass = 'block text-[10px] tracking-[0.24em] uppercase text-ash mb-1.5 font-light';

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaveStatus('saving');
    setSaveError('');
    const form = new FormData(e.currentTarget);
    const updates = {
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
      const res = await fetch('/api/account/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setSaveError(data.error || t('errorGeneric'));
        setSaveStatus('error');
        return;
      }
      onSaved(updates);
    } catch {
      setSaveError(t('errorGeneric'));
      setSaveStatus('error');
    }
  }

  return (
    <form onSubmit={handleSave} className="border border-charcoal/12 bg-ivory p-8 md:p-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <label className={labelClass}>{tForm('firstNameLabel')}</label>
          <input name="firstName" defaultValue={member.firstName} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{tForm('lastNameLabel')}</label>
          <input name="lastName" defaultValue={member.lastName} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{tForm('birthdayLabel')}</label>
          <input name="birthday" type="date" defaultValue={member.birthday} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{tForm('birthdayLabel')}</label>
          <input name="birthday" type="date" defaultValue={member.birthday} className={inputClass} />
        </div>
        <ProfileAddressFields
          labels={{
            phoneLabel: tForm('phoneLabel'),
            addressLine: tForm('addressLineLabel'),
            city: tForm('cityLabel'),
            postcode: tForm('postcodeLabel'),
            country: tForm('countryLabel')
          }}
          defaults={{
            phoneCountryCode: member.phoneCountryCode,
            phone: member.phone,
            addressLine: member.addressLine,
            city: member.city,
            postcode: member.postcode,
            country: member.country
          }}
        />
      </div>

      {saveStatus === 'error' && (
        <p className="mt-4 text-[0.8rem] text-red-700/80 font-light">{saveError}</p>
      )}

      <div className="mt-6 flex items-center gap-6">
        <button
          type="submit"
          disabled={saveStatus === 'saving'}
          className="text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
        >
          {saveStatus === 'saving' ? t('saving') : t('saveChanges')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-[11px] tracking-[0.28em] uppercase text-ash link-underline"
        >
          {t('cancel')}
        </button>
      </div>
    </form>
  );
}

export default function AccountLookupForm() {
  const t = useTranslations('account');
  const [checking, setChecking] = useState(true);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [member, setMember] = useState<Member | null>(null);
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [bespokeRequests, setBespokeRequests] = useState<BespokeItem[]>([]);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [editing, setEditing] = useState(false);
  const [forgotStatus, setForgotStatus] = useState<'idle' | 'submitting' | 'sent'>('idle');
  const [forgotStep, setForgotStep] = useState<'email' | 'code'>('email');
  const [forgotEmail, setForgotEmail] = useState('');

  async function loadSession() {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.member) {
        setMember(data.member);
        setPurchases(data.purchases || []);
        setBespokeRequests(data.bespokeRequests || []);
        setStatus('success');
      }
    } catch {
      /* not logged in */
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    loadSession();
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setMember(null);
    setStatus('idle');
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email')?.toString(),
          password: form.get('password')?.toString()
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || t('errorGeneric'));
        setStatus('error');
        return;
      }
      await loadSession();
    } catch {
      setErrorMsg(t('errorGeneric'));
      setStatus('error');
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.get('firstName')?.toString(),
          lastName: form.get('lastName')?.toString(),
          email: form.get('email')?.toString(),
          password: form.get('password')?.toString()
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || t('errorGeneric'));
        setStatus('error');
        return;
      }
      await loadSession();
    } catch {
      setErrorMsg(t('errorGeneric'));
      setStatus('error');
    }
  }

  async function handleForgot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setForgotStatus('submitting');
    const form = new FormData(e.currentTarget);
    const email = form.get('email')?.toString() || '';
    setForgotEmail(email);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
    } catch {
      /* still show the "check your email" state either way */
    } finally {
      setForgotStep('code');
      setForgotStatus('idle');
    }
  }

  async function handleResetWithCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setForgotStatus('submitting');
    setErrorMsg('');
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          code: form.get('code')?.toString(),
          password: form.get('password')?.toString()
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || t('errorGeneric'));
        setForgotStatus('idle');
        return;
      }
      setMode('login');
      setForgotStatus('idle');
      setForgotStep('email');
      await loadSession();
    } catch {
      setErrorMsg(t('errorGeneric'));
      setForgotStatus('sent');
    }
  }

  const inputClass =
    'w-full bg-transparent border-b border-charcoal/20 focus:border-gold outline-none py-2.5 text-[0.9rem] font-light text-charcoal placeholder:text-ash/50 transition-colors';
  const labelClass = 'block text-[10px] tracking-[0.24em] uppercase text-ash mb-1.5 font-light';

  if (checking) {
    return <div className="max-w-md mx-auto text-center text-[0.85rem] text-ash/60 font-light">…</div>;
  }

  if (status === 'success' && member) {
    const joined = member.joinedAt
      ? new Date(member.joinedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
      : '';
    const isPrivate = member.tier === 'private';
    const tierLabel = isPrivate ? t('tierPrivate') : t('tierCircle');
    const benefits = (isPrivate ? t.raw('privateBenefits2') : t.raw('circleBenefits2')) as string[];

    if (editing) {
      return (
        <EditProfileForm
          member={member}
          onCancel={() => setEditing(false)}
          onSaved={(updates) => {
            setMember((m) => (m ? { ...m, ...updates } : m));
            setEditing(false);
          }}
        />
      );
    }

    return (
      <div>
        <div className="border border-charcoal/12 bg-ivory p-8 md:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <p className="eyebrow mb-2">{t('welcomeBack')}</p>
              <h2 className="serif-display text-[1.8rem] font-light text-charcoal">
                {member.firstName} {member.lastName}
              </h2>
            </div>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-[10px] tracking-[0.24em] uppercase text-charcoal link-underline"
              >
                {t('editProfile')}
              </button>
              <button
                type="button"
                onClick={logout}
                className="text-[10px] tracking-[0.24em] uppercase text-ash/70 link-underline"
              >
                {t('logOut')}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-2 text-[0.85rem] text-ash font-light">
            {member.isMember && (
              <span>
                {t('memberCodeLabel')}: <span className="text-gold">{member.memberCode}</span>
              </span>
            )}
            <span>{member.isMember ? tierLabel : t('notMemberYet')}</span>
            {joined && (
              <span>
                {t('joinedLabel')}: {joined}
              </span>
            )}
          </div>

          {member.isMember ? (
            <div className="mt-6 pt-6 border-t border-charcoal/10">
              <p className="text-[10px] tracking-[0.24em] uppercase text-ash/60 mb-3">
                {t('benefitsTitle')}
              </p>
              <ul className="space-y-1.5">
                {benefits.map((b, i) => (
                  <li key={i} className="text-[0.85rem] text-ash font-light pl-4 relative">
                    <span className="absolute left-0 top-[0.55em] w-1 h-1 rounded-full bg-gold/70" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-6 pt-6 border-t border-charcoal/10">
              <a
                href="/membership"
                className="inline-block text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5"
              >
                {t('joinCircleCta')}
              </a>
            </div>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="eyebrow mb-4">{t('myBespokeTitle')}</p>
            {bespokeRequests.length === 0 ? (
              <p className="text-[0.85rem] text-ash/70 font-light">{t('noBespoke')}</p>
            ) : (
              <ul className="space-y-3">
                {bespokeRequests.map((b, i) => (
                  <li key={i} className="border-b border-charcoal/10 pb-3 text-[0.85rem] font-light">
                    <span className="text-charcoal capitalize">{b.pieceType || '—'}</span>
                    <span className="text-ash/60"> · {b.status}</span>
                    {b._id && (
                      <a
                        href={`/bespoke/request/${b._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-1 text-charcoal link-underline"
                      >
                        {t('viewRequest')}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="eyebrow mb-4">{t('myPurchasesTitle')}</p>
            {purchases.length === 0 ? (
              <p className="text-[0.85rem] text-ash/70 font-light">{t('noPurchases')}</p>
            ) : (
              <ul className="space-y-3">
                {purchases.map((p, i) => (
                  <li key={i} className="border-b border-charcoal/10 pb-3 text-[0.85rem] font-light">
                    <span className="text-charcoal">
                      {p.productName}
                      {p.itemCount && p.itemCount > 1 ? ` +${p.itemCount - 1}` : ''}
                    </span>
                    <span className="text-ash/60"> · {p.status}</span>
                    <div className="text-ash/60 mt-1">
                      {t('trackingLabel')}: {p.trackingNumber || t('notShippedYet')}
                      {p.trackingNumber && (
                        <>
                          {' — '}
                          <a
                            href="https://www.nzpost.co.nz/tools/tracking"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-charcoal link-underline"
                          >
                            {t('trackWithNzPost')}
                          </a>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'forgot') {
    if (forgotStep === 'code') {
      return (
        <form onSubmit={handleResetWithCode} className="max-w-md mx-auto">
          <p className="text-[0.85rem] text-ash font-light leading-relaxed mb-6 text-center">
            {t('resetEmailSentBody')}
          </p>
          <div className="space-y-6">
            <div>
              <label className={labelClass}>{t('resetCodeLabel')} *</label>
              <input
                name="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                required
                maxLength={6}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t('newPasswordLabel')} *</label>
              <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
            </div>
          </div>

          {errorMsg && <p className="mt-4 text-[0.8rem] text-red-700/80 font-light">{errorMsg}</p>}

          <button
            type="submit"
            disabled={forgotStatus === 'submitting'}
            className="mt-8 w-full text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
          >
            {forgotStatus === 'submitting' ? t('submitting') : t('resetSubmit')}
          </button>
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setForgotStatus('idle');
                setForgotStep('email');
                setErrorMsg('');
              }}
              className="text-[11px] tracking-[0.24em] uppercase text-ash link-underline"
            >
              {t('backToLogin')}
            </button>
          </div>
        </form>
      );
    }
    return (
      <form onSubmit={handleForgot} className="max-w-md mx-auto">
        <p className="text-[0.85rem] text-ash font-light leading-relaxed mb-6 text-center">
          {t('forgotPasswordBody')}
        </p>
        <div>
          <label className={labelClass}>{t('emailLabel')} *</label>
          <input name="email" type="email" required className={inputClass} />
        </div>
        <button
          type="submit"
          disabled={forgotStatus === 'submitting'}
          className="mt-8 w-full text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
        >
          {forgotStatus === 'submitting' ? t('submitting') : t('sendResetLink')}
        </button>
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => setMode('login')}
            className="text-[11px] tracking-[0.24em] uppercase text-ash link-underline"
          >
            {t('backToLogin')}
          </button>
        </div>
      </form>
    );
  }

  if (mode === 'register') {
    return (
      <form onSubmit={handleRegister} className="max-w-md mx-auto">
        <div className="space-y-6">
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
            <label className={labelClass}>{t('passwordLabel')} *</label>
            <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
          </div>
        </div>

        {status === 'error' && (
          <p className="mt-4 text-[0.8rem] text-red-700/80 font-light">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="mt-8 w-full text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
        >
          {status === 'submitting' ? t('submitting') : t('registerCta')}
        </button>
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setStatus('idle');
            }}
            className="text-[11px] tracking-[0.24em] uppercase text-ash link-underline"
          >
            {t('haveAccount')}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto">
      <div className="space-y-6">
        <div>
          <label className={labelClass}>{t('emailLabel')} *</label>
          <input name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('passwordLabel')} *</label>
          <input name="password" type="password" required className={inputClass} />
        </div>
      </div>

      {status === 'error' && (
        <p className="mt-4 text-[0.8rem] text-red-700/80 font-light">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-8 w-full text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
      >
        {status === 'submitting' ? t('submitting') : t('loginCta')}
      </button>
      <div className="mt-5 text-center space-y-2">
        <button
          type="button"
          onClick={() => {
            setMode('forgot');
            setStatus('idle');
          }}
          className="block w-full text-[11px] tracking-[0.24em] uppercase text-ash/70 link-underline"
        >
          {t('forgotPasswordLink')}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setStatus('idle');
          }}
          className="block w-full text-[11px] tracking-[0.24em] uppercase text-ash link-underline"
        >
          {t('noAccount')}
        </button>
      </div>
    </form>
  );
}
