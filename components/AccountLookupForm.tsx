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

const STORAGE_KEY = 'sirentears_account';

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
        body: JSON.stringify({ email: member.email, memberCode: member.memberCode, updates })
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
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [member, setMember] = useState<Member | null>(null);
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [bespokeRequests, setBespokeRequests] = useState<BespokeItem[]>([]);

  const [mode, setMode] = useState<'lookup' | 'forgot'>('lookup');
  const [forgotStatus, setForgotStatus] = useState<'idle' | 'submitting' | 'found' | 'error'>('idle');
  const [forgotError, setForgotError] = useState('');
  const [foundCode, setFoundCode] = useState('');
  const [foundName, setFoundName] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [editing, setEditing] = useState(false);
  const [editStatus, setEditStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [editError, setEditError] = useState('');

  // Remember the last successful login on this device (not a secure session,
  // just a convenience so returning visitors don't have to retype their code).
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      try {
        const { email, memberCode } = JSON.parse(saved);
        if (email && memberCode) performLookup(email, memberCode, false);
      } catch {
        /* ignore malformed storage */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setMember(null);
    setStatus('idle');
  }

  async function performLookup(email: string, memberCode: string, remember = true) {
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/account/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, memberCode })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || t('errorGeneric'));
        setStatus('error');
        return;
      }
      setMember(data.member);
      setPurchases(data.purchases || []);
      setBespokeRequests(data.bespokeRequests || []);
      setStatus('success');
      setMode('lookup');
      if (remember && typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, memberCode }));
      }
    } catch {
      setErrorMsg(t('errorGeneric'));
      setStatus('error');
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get('email')?.toString() || '';
    const memberCode = form.get('memberCode')?.toString() || '';
    await performLookup(email, memberCode);
  }

  const inputClass =
    'w-full bg-transparent border-b border-charcoal/20 focus:border-gold outline-none py-2.5 text-[0.9rem] font-light text-charcoal placeholder:text-ash/50 transition-colors';
  const labelClass = 'block text-[10px] tracking-[0.24em] uppercase text-ash mb-1.5 font-light';

  async function handleForgotSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setForgotStatus('submitting');
    setForgotError('');
    const form = new FormData(e.currentTarget);
    const email = form.get('email')?.toString() || '';
    setForgotEmail(email);

    try {
      const res = await fetch('/api/account/forgot-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setForgotError(data.error || t('errorGeneric'));
        setForgotStatus('error');
        return;
      }
      setFoundCode(data.memberCode);
      setFoundName(data.firstName || '');
      setForgotStatus('found');
    } catch {
      setForgotError(t('errorGeneric'));
      setForgotStatus('error');
    }
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
        <div className="">
          <EditProfileForm
            member={member}
            onCancel={() => setEditing(false)}
            onSaved={(updates) => {
              setMember((m) => (m ? { ...m, ...updates } : m));
              setEditing(false);
            }}
          />
        </div>
      );
    }

    return (
      <div className="">
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

  if (mode === 'forgot') {
    if (forgotStatus === 'found') {
      return (
        <div className="max-w-md mx-auto text-center">
          <p className="text-[0.9rem] text-ash font-light mb-2">
            {foundName ? `${foundName}, ` : ''}
            {t('foundPrefix')}:
          </p>
          <p className="serif-display text-[1.8rem] tracking-[0.15em] text-gold mb-8">{foundCode}</p>
          <button
            type="button"
            onClick={() => performLookup(forgotEmail, foundCode)}
            className="text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5 hover:bg-charcoal/85 transition-colors"
          >
            {t('useThisCode')}
          </button>
        </div>
      );
    }

    return (
      <form onSubmit={handleForgotSubmit} className="max-w-md mx-auto">
        <p className="serif-display text-[1.3rem] font-light text-charcoal mb-2">{t('forgotTitle')}</p>
        <p className="text-[0.85rem] text-ash font-light mb-6">{t('forgotBody')}</p>
        <label className={labelClass}>{t('emailLabel')} *</label>
        <input name="email" type="email" required className={inputClass} />

        {forgotStatus === 'error' && (
          <p className="mt-4 text-[0.8rem] text-red-700/80 font-light">{forgotError}</p>
        )}

        <div className="mt-8 flex items-center gap-8">
          <button
            type="submit"
            disabled={forgotStatus === 'submitting'}
            className="text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
          >
            {forgotStatus === 'submitting' ? t('forgotSubmitting') : t('forgotSubmit')}
          </button>
          <button
            type="button"
            onClick={() => setMode('lookup')}
            className="text-[11px] tracking-[0.28em] uppercase text-ash link-underline"
          >
            {t('back')}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="space-y-6">
          <div>
            <label className={labelClass}>{t('emailLabel')} *</label>
            <input name="email" type="email" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('memberCodeLabel')} *</label>
            <input name="memberCode" type="text" required placeholder="ST-XXXXXX" className={inputClass} />
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
          {status === 'submitting' ? t('submitting') : t('submit')}
        </button>
      </form>
      <div className="max-w-md mx-auto mt-5 text-center">
        <button
          type="button"
          onClick={() => setMode('forgot')}
          className="text-[11px] tracking-[0.24em] uppercase text-ash link-underline"
        >
          {t('forgotLink')}
        </button>
      </div>
    </div>
  );
}
