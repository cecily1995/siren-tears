'use client';

import { useTranslations } from 'next-intl';
import { useBag } from '@/lib/bag-context';

export default function AddToBagButton({
  productId,
  slug,
  name,
  price,
  imageUrl,
  category
}: {
  productId: string;
  slug: string;
  name: string;
  price?: number;
  imageUrl?: string;
  category?: string;
}) {
  const t = useTranslations('bag');
  const { items, addItem, open, justAdded } = useBag();
  const inBag = items.some((i) => i.productId === productId);
  const wasJustAdded = justAdded === productId;

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (!inBag) addItem({ productId, slug, name, price, imageUrl, category });
          open();
        }}
        className="w-full text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-4 hover:bg-charcoal/85 transition-colors"
      >
        {inBag ? t('viewBagCta') : t('addToBagCta')}
      </button>
      {wasJustAdded && (
        <p className="mt-3 text-center text-[0.8rem] text-ash font-light">{t('addedConfirmation')}</p>
      )}
    </div>
  );
}
