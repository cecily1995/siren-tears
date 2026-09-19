'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import InlineLoginForm from './InlineLoginForm';
import MembershipInvitationModal from './MembershipInvitationModal';

const DISMISS_KEY = 'sirentears_auth_gate_dismissed';

export default function AuthGateModal() {
  const t = useTranslations('account');
  const router = useRouter();
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

  if (justJoined) {
    return createPortal(
      <MembershipInvitationModal
        onContinue={() => {
          dismiss();
          router.replace('/');
        }}
      />,
      document.body
    );
  }

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

        <InlineLoginForm
          onSuccess={(mode) => {
            sessionStorage.setItem(DISMISS_KEY, '1');
            if (mode === 'register') {
              setJustJoined(true);
            } else {
              dismiss();
              router.refresh();
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
      </div>
    </div>,
    document.body
  );
}
