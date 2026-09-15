'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useBag } from '@/lib/bag-context';
import RecommendedProducts from './RecommendedProducts';

export default function BagDrawer() {
  const { items, removeItem, isOpen, close } = useBag();
  const t = useTranslations('bag');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, i) => sum + (i.price || 0), 0);

  return (
    <div className="fixed inset-0 z-[70] flex justify-end" onClick={close}>
      <div className="absolute inset-0 bg-charcoal/40" />
      <div
        className="relative w-full sm:max-w-[440px] h-full bg-ivory overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-ivory z-10 flex items-center justify-between px-6 pt-6 pb-4 border-b border-charcoal/10">
          <p className="eyebrow">{t('title')}</p>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="text-charcoal/50 hover:text-charcoal text-2xl leading-none px-1"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-6 flex-1 flex flex-col">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[0.9rem] text-ash font-light">{t('empty')}</p>
              <button
                type="button"
                onClick={close}
                className="mt-6 text-[11px] tracking-[0.3em] uppercase text-charcoal link-underline"
              >
                {t('continueCta')}
              </button>
            </div>
          ) : (
            <>
              <ul className="space-y-5 mb-6">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-4">
                    <div className="w-16 h-20 shrink-0 bg-charcoal/5 overflow-hidden">
                      {item.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.9rem] text-charcoal font-light truncate">{item.name}</p>
                      {typeof item.price === 'number' && (
                        <p className="text-[0.82rem] text-ash font-light mt-1">NZD ${item.price}</p>
                      )}
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="mt-1.5 text-[10px] tracking-[0.2em] uppercase text-ash/60 hover:text-charcoal link-underline"
                      >
                        {t('remove')}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mb-8 pb-8 border-b border-charcoal/10">
                <RecommendedProducts />
              </div>

              <div className="mt-auto">
                <div className="flex items-center justify-between py-4 border-t border-b border-charcoal/10 mb-6">
                  <span className="text-[11px] tracking-[0.2em] uppercase text-ash">{t('subtotal')}</span>
                  <span className="text-[1.05rem] text-charcoal font-light">NZD ${subtotal}</span>
                </div>

                <Link
                  href="/checkout"
                  onClick={close}
                  className="block w-full text-center text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5 hover:bg-charcoal/85 transition-colors"
                >
                  {t('checkoutCta')}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
