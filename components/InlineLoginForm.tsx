'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// The one shared login/register/forgot-password UI used everywhere a
// login screen is needed across the site (Wishlist when logged out, the
// auto popup, the Account page) -- previously three separate, slightly
// different copies of this same flow existed; consolidated here so
// there's a single interface and every entry point behaves identically
// (including forgot-password, which one of the three was missing).
export default function InlineLoginForm({
  onSuccess
}: {
  onSuccess?: (mode: 'login' | 'register' | 'reset') => void;
}) {
  const t = useTranslations('account');
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const inputClass =
    'w-full bg-transparent border-b border-charcoal/20 focus:border-gold outline-none py-2.5 text-[0.9rem] font-light text-charcoal placeholder:text-ash/50 transition-colors';
  const labelClass = 'block text-[10px] tracking-[0.24em] uppercase text-ash mb-1.5 font-light';

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
      setStatus('idle');
      onSuccess?.('login');
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
      setStatus('idle');
      onSuccess?.('register');
    } catch {
      setErrorMsg(t('errorGeneric'));
      setStatus('error');
    }
  }

  async function handleForgot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
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
      /* show the same generic confirmation either way */
    } finally {
      setForgotSent(true);
      setStatus('idle');
    }
  }

  async function handleResetWithCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
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
        setStatus('error');
        return;
      }
      setStatus('idle');
      onSuccess?.('reset');
    } catch {
      setErrorMsg(t('errorGeneric'));
      setStatus('error');
    }
  }

  if (mode === 'forgot') {
    return (
      <div className="mx-auto max-w-[380px] py-10">
        <p className="eyebrow mb-2 text-center">{t('gateEyebrow')}</p>
        <h2 className="serif-display text-[1.5rem] font-light text-charcoal text-center mb-6">
          {t('resetPasswordTitle')}
        </h2>
        {forgotSent ? (
          <form onSubmit={handleResetWithCode} className="space-y-5">
            <p className="text-[0.85rem] text-ash font-light leading-relaxed text-center">
              {t('resetEmailSentBody')}
            </p>
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
            {status === 'error' && <p className="text-[0.8rem] text-red-700/80 font-light">{errorMsg}</p>}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
            >
              {status === 'submitting' ? t('submitting') : t('resetSubmit')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgot} className="space-y-5">
            <p className="text-[0.85rem] text-ash font-light leading-relaxed text-center">
              {t('forgotPasswordBody')}
            </p>
            <div>
              <label className={labelClass}>{t('emailLabel')} *</label>
              <input name="email" type="email" required className={inputClass} />
            </div>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
            >
              {status === 'submitting' ? t('submitting') : t('sendResetLink')}
            </button>
          </form>
        )}
        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setForgotSent(false);
              setStatus('idle');
            }}
            className="text-[11px] tracking-[0.24em] uppercase text-ash link-underline"
          >
            {t('backToLogin')}
          </button>
        </div>
      </div>
    );
  }

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
          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={() => setMode('forgot')}
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
      )}
    </div>
  );
}
