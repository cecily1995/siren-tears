'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import MemberGiftTeaser from './MemberGiftTeaser';

export default function MembershipInvitationModal({ onContinue }: { onContinue: () => void }) {
  const t = useTranslations('account');

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-5" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-charcoal/70" aria-hidden="true" />
      <div className="relative z-[1] w-full max-w-[420px] bg-ivory px-8 md:px-10 py-10 max-h-[90dvh] overflow-y-auto text-center">
        <p className="serif-display text-[1.4rem] font-light text-charcoal mb-3">{t('gateJoinTitle')}</p>
        <p className="text-[0.85rem] leading-[1.7] text-ash font-light mb-5">{t('accountCreatedBody')}</p>
        <ul className="text-left space-y-1.5 mb-7 inline-block">
          {(t.raw('circleBenefits2') as string[]).map((benefit, index) => (
            <li key={index} className="text-[0.85rem] text-ash font-light pl-4 relative">
              <span className="absolute left-0 top-[0.55em] w-1 h-1 rounded-full bg-gold/70" />
              {benefit}
            </li>
          ))}
        </ul>
        <div className="mb-7 text-left">
          <MemberGiftTeaser size="sm" />
        </div>
        <Link href="/membership" className="block w-full text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5">
          {t('joinCircleCta')}
        </Link>
        <button type="button" onClick={onContinue} className="block w-full mt-4 text-[10px] tracking-[0.2em] uppercase text-ash/60">
          {t('continueExploring')}
        </button>
      </div>
    </div>
  );
}
