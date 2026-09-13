'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Member = {
  firstName?: string;
  lastName?: string;
  email?: string;
  memberCode?: string;
  tier?: string;
  joinedAt?: string;
};

type PurchaseItem = { productName?: string; status?: string; trackingNumber?: string; _createdAt?: string };
type BespokeItem = { pieceType?: string; status?: string; _createdAt?: string };

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

  async function performLookup(email: string, memberCode: string) {
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
    const tierLabel = member.tier === 'private' ? t('tierPrivate') : t('tierCircle');

    return (
      <div className="reveal">
        <div className="border border-charcoal/12 bg-ivory p-8 md:p-10">
          <p className="eyebrow mb-2">{t('welcomeBack')}</p>
          <h2 className="serif-display text-[1.8rem] font-light text-charcoal mb-6">
            {member.firstName} {member.lastName}
          </h2>
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
        <div className="max-w-md mx-auto reveal text-center">
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
