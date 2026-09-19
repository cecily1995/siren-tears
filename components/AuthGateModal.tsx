'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import InlineLoginForm from './InlineLoginForm';
import MemberGiftTeaser from './MemberGiftTeaser';

const DISMISS_KEY = 'sirentears_auth_gate_dismissed';

export default function AuthGateModal() {
  const t = useTranslations('account');
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [justJoined, setJustJoined] = useState(false);

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

  if (!mounted || !visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-charcoal/70" onClick={dismiss} aria-hidden="true" />
      <div className="relative z-[1] w-full max-w-[420px] bg-ivory px-8 md:px-10 max-h-[90vh] overflow-y-auto">
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

        {justJoined ? (
          <div className="text-center py-10">
            <p className="serif-display text-[1.4rem] font-light text-charcoal mb-3">
              {t('gateJoinTitle')}
            </p>
            <p className="text-[0.85rem] leading-[1.7] text-ash font-light mb-5">
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
            <div className="mb-7">
              <MemberGiftTeaser size="sm" />
            </div>
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
        ) : (
          <>
            <InlineLoginForm
              onSuccess={(mode) => {
                sessionStorage.setItem(DISMISS_KEY, '1');
                if (mode === 'register') {
                  setJustJoined(true);
                } else {
                  dismiss();
                }
              }}
            />
            <button
              type="button"
              onClick={dismiss}
              className="mb-6 w-full text-center text-[10px] tracking-[0.2em] uppercase text-ash/50"
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
