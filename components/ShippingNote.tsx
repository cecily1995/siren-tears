'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

// Small, quiet shipping/duties disclaimer shown under the item list in both
// the Bag drawer and on the Checkout page's order summary -- matches the
// understated, small-print treatment used by other quiet-luxury checkouts.
export default function ShippingNote() {
  const t = useTranslations('bag');

  return (
    <div className="space-y-1.5 text-[0.72rem] leading-[1.5] text-ash/60 font-light">
      <p>
        {t('shippingNote')}{' '}
        <Link href="/membership" className="text-ash/80 link-underline whitespace-nowrap">
          {t('joinCircleCta')} →
        </Link>
      </p>
      <p className="text-ash/45">{t('carrierNote')}</p>
    </div>
  );
}
