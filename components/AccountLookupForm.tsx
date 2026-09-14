'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type Member = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  birthday?: string;
  memberCode?: string;
  tier?: string;
  joinedAt?: string;
};

type PurchaseItem = { productName?: string; status?: string; trackingNumber?: string; _createdAt?: string };
type BespokeItem = { pieceType?: string; status?: string; _createdAt?: string };

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
      phone: form.get('phone')?.toString() || '',
      address: form.get('address')?.toString() || '',
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
          <label className={labelClass}>{tForm('phoneLabel')}</label>
          <input name="phone" defaultValue={member.phone} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{tForm('addressLabel')}</label>
          <input name="address" defaultValue={member.address} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{tForm('countryLabel')}</label>
          <input name="country" defaultValue={member.country} className={inputClass} />
        </div>
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
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [editing, setEditing] = useState(false);

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
            <span>
              {t('memberCodeLabel')}: <span className="text-gold">{member.memberCode}</span>
            </span>
            <span>{tierLabel}</span>
            {joined && (
              <span>
                {t('joinedLabel')}: {joined}
              </span>
            )}
          </div>

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
                    <span className="text-charcoal">{p.productName}</span>
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
            <input name="password" type="password" required minLength={8} className={inputClass} />
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
      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setStatus('idle');
          }}
          className="text-[11px] tracking-[0.24em] uppercase text-ash link-underline"
        >
          {t('noAccount')}
        </button>
      </div>
    </form>
  );
}
