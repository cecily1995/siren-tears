'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';

// Simple, clean, quiet-luxury teaser for the free membership gift --
// used in three places: the auto popup's post-registration screen, the
// Membership page's Circle card, and Checkout. Shows the reminder copy
// for non-members; a short confirmation line instead for existing
// members, never both.
export default function MemberGiftTeaser({
  isMember = false,
  size = 'md'
}: {
  isMember?: boolean;
  size?: 'sm' | 'md';
}) {
  const t = useTranslations('memberGift');
  const imgSize = size === 'sm' ? 'w-16 h-16' : 'w-20 h-20 md:w-24 md:h-24';
  const [mounted, setMounted] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!imageOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setImageOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [imageOpen]);

  return (
    <div className="flex items-center gap-4 bg-ivory border border-charcoal/10 p-4">
      <button
        type="button"
        onClick={() => setImageOpen(true)}
        aria-label={t('viewImage')}
        className={`relative ${imgSize} shrink-0 overflow-hidden bg-charcoal/5 cursor-zoom-in`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/member-gift-pouch.jpg" alt={t('body')} className="absolute inset-0 w-full h-full object-cover" />
      </button>
      <div>
        {isMember ? (
          <p className="text-[0.8rem] leading-[1.6] text-ash font-light">{t('alreadyMember')}</p>
        ) : (
          <>
            <p className="text-[10px] tracking-[0.2em] uppercase text-gold font-light mb-1">{t('title')}</p>
            <p className="text-[0.85rem] leading-[1.5] text-charcoal font-light">{t('body')}</p>
            <p className="text-[10px] tracking-[0.14em] uppercase text-ash/70 font-light mt-1">{t('exclusive')}</p>
          </>
        )}
      </div>
      {mounted && imageOpen && createPortal(
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-charcoal/85 p-5 md:p-10" role="dialog" aria-modal="true">
          <button
            type="button"
            onClick={() => setImageOpen(false)}
            aria-label="Close"
            className="absolute top-5 right-5 md:top-8 md:right-8 w-9 h-9 flex items-center justify-center text-ivory"
          >
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" onClick={() => setImageOpen(false)} className="max-w-[760px] max-h-[88dvh] cursor-zoom-out">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/member-gift-pouch.jpg" alt={t('body')} className="max-w-full max-h-[88dvh] object-contain" />
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}
