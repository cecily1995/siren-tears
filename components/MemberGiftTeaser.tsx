'use client';

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

  return (
    <div className="flex items-center gap-4 bg-ivory border border-charcoal/10 p-4">
      <div className={`relative ${imgSize} shrink-0 overflow-hidden bg-charcoal/5`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/member-gift-pouch.jpg" alt={t('body')} className="absolute inset-0 w-full h-full object-cover" />
      </div>
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
    </div>
  );
}
