'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';

const DISMISS_KEY = 'sirentears_auth_gate_dismissed';

export default function AuthGateModal() {
  const t = useTranslations('account');
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('register');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  useEffect(() => {
    setMounted(true);
    let cancelled = false;

    async function check() {
      if (sessionStorage.getItem(DISMISS_KEY)) return;
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!cancelled && !data.member) {
          // Small delay so it doesn't fight the initial page paint/hero animation.
          setTimeout(() => {
            if (!cancelled) setVisible(true);
          }, 1200);
        }
      } catch {
        /* fail silently — never block browsing over a network hiccup */
      }
    }
    check();

    return () => {
      cancelled = true;
    };
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
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
      setStatus('success');
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      setErrorMsg(t('errorGeneric'));
      setStatus('error');
    }
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
      sessionStorage.setItem(DISMISS_KEY, '1');
      dismiss();
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
      sessionStorage.setItem(DISMISS_KEY, '1');
      dismiss();
    } catch {
      setErrorMsg(t('errorGeneric'));
      setStatus('error');
    }
  }

  if (!mounted || !visible) return null;

  const inputClass =
    'w-full bg-transparent border-b border-charcoal/20 focus:border-gold outline-none py-2.5 text-[0.9rem] font-light text-charcoal placeholder:text-ash/50 transition-colors';
  const labelClass = 'block text-[10px] tracking-[0.24em] uppercase text-ash mb-1.5 font-light';

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-charcoal/70" onClick={dismiss} aria-hidden="true" />
      <div className="relative z-[1] w-full max-w-[420px] bg-ivory p-8 md:p-10 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center text-charcoal"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>

        {status === 'success' ? (
          <div className="text-center pt-4">
            <p className="serif-display text-[1.4rem] font-light text-charcoal mb-3">
              {t('gateJoinTitle')}
            </p>
            <p className="text-[0.85rem] leading-[1.8] text-ash font-light mb-5">
              {t('accountCreatedBody')}
            </p>
            <ul className="text-left space-y-1.5 mb-7 inline-block">
              {(t.raw('circleBenefits2') as string[]).map((b, i) => (
                <li key={i} className="text-[0.85rem] text-ash font-light pl-4 relative">
                  <span className="absolute left-0 top-[0.55em] w-1 h-1 rounded-full bg-gold/70" />
                  {b}
                </li>
              ))}
            </ul>
            <a
              href="/membership"
              className="block w-full text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5"
            >
              {t('joinCircleCta')}
            </a>
            <button
              type="button"
              onClick={dismiss}
              className="block w-full mt-4 text-[10px] tracking-[0.2em] uppercase text-ash/60"
            >
              {t('continueExploring')}
            </button>
          </div>
        ) : mode === 'forgot' ? (
          <>
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
                {status === 'error' && (
                  <p className="text-[0.8rem] text-red-700/80 font-light">{errorMsg}</p>
                )}
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
                }}
                className="text-[11px] tracking-[0.24em] uppercase text-ash link-underline"
              >
                {t('backToLogin')}
              </button>
            </div>
          </>
        ) : (
          <>
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
                {status === 'error' && (
                  <p className="text-[0.8rem] text-red-700/80 font-light">{errorMsg}</p>
                )}
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
                {status === 'error' && (
                  <p className="text-[0.8rem] text-red-700/80 font-light">{errorMsg}</p>
                )}
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

            <button
              type="button"
              onClick={dismiss}
              className="mt-6 w-full text-center text-[10px] tracking-[0.2em] uppercase text-ash/50"
            >
              {t('continueBrowsing')}
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
