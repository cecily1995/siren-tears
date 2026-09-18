'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// A plain, non-modal login form -- used wherever a page itself needs to
// show a login screen (e.g. Wishlist when logged out) rather than a
// popup. Deliberately a separate component from AuthGateModal (which
// stays exactly as it is) rather than a refactor of it, so there's no
// risk of touching that existing, working flow.
export default function InlineLoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const t = useTranslations('account');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

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
      onSuccess?.();
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
      onSuccess?.();
    } catch {
      setErrorMsg(t('errorGeneric'));
      setStatus('error');
    }
  }

  const inputClass =
    'w-full bg-transparent border-b border-charcoal/20 focus:border-gold outline-none py-2.5 text-[0.9rem] font-light text-charcoal placeholder:text-ash/50 transition-colors';
  const labelClass = 'block text-[10px] tracking-[0.24em] uppercase text-ash mb-1.5 font-light';

  return (
    <div className="mx-auto max-w-[380px] py-10">
      <p className="eyebrow mb-2 text-center">{t('gateEyebrow')}</p>
      <h2 className="serif-display text-[1.5rem] font-light text-charcoal text-center mb-6">
        {mode === 'register' ? t('gateRegisterTitle') : t('gateLoginTitle')}
      </h2>

      {mode === 'register' ? (
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className={labelClass}>{t('firstNameLabel')} *</label>
            <input name="firstName" type="text" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('emailLabel')} *</label>
            <input name="email" type="email" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('passwordLabel')} *</label>
            <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
          </div>
          {status === 'error' && <p className="text-[0.8rem] text-red-700/80 font-light">{errorMsg}</p>}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
          >
            {status === 'submitting' ? t('submitting') : t('registerCta')}
          </button>
          <div className="text-center">
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
      ) : (
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className={labelClass}>{t('emailLabel')} *</label>
            <input name="email" type="email" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('passwordLabel')} *</label>
            <input name="password" type="password" required className={inputClass} />
          </div>
          {status === 'error' && <p className="text-[0.8rem] text-red-700/80 font-light">{errorMsg}</p>}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
          >
            {status === 'submitting' ? t('submitting') : t('loginCta')}
          </button>
          <div className="text-center">
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
      )}
    </div>
  );
}
