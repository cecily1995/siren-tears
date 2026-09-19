'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useBag } from '@/lib/bag-context';
import RecommendedProducts from './RecommendedProducts';
import ShippingNote from './ShippingNote';
import Money from './Money';

export default function BagDrawer() {
  const { items, selectedIds, selectedItems, toggleSelected, removeItem, isOpen, close } = useBag();
  const t = useTranslations('bag');

  if (!isOpen) return null;

  const subtotal = selectedItems.reduce((sum, i) => sum + (i.price || 0), 0);

  return (
    <div className="fixed inset-0 z-[70] flex justify-end" onClick={close}>
      <div className="absolute inset-0 bg-charcoal/40" />
      <div
        className="relative w-full sm:max-w-[440px] h-full bg-ivory flex flex-col animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-ivory z-10 px-6 pt-5 pb-4 border-b border-charcoal/10 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" onClick={close}>
              <Image
                src="/brand/siren-tears-logo.png"
                alt="Siren Tears"
                width={320}
                height={121}
                className="h-7 w-auto object-contain"
              />
            </Link>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="text-charcoal/50 hover:text-charcoal text-2xl leading-none px-1"
            >
              ×
            </button>
          </div>
          <p className="eyebrow">{t('title')}</p>
        </div>

        {items.length === 0 ? (
          <div className="px-6 py-6 flex-1 flex flex-col">
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
          </div>
        ) : (
          <>
            {/* Scrollable: items, shipping note, recommended products. The
                subtotal/checkout footer below is deliberately NOT part of
                this scroll region, so it's always visible regardless of how
                much is above it. */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <ul className="space-y-5 mb-6">
                {items.map((item) => (
                  <li
                    key={item.productId}
                    role="checkbox"
                    tabIndex={0}
                    aria-checked={selectedIds.includes(item.productId)}
                    onClick={(event) => {
                      if ((event.target as HTMLElement).closest('a, button')) return;
                      toggleSelected(item.productId);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        toggleSelected(item.productId);
                      }
                    }}
                    className={`flex gap-3 transition-opacity cursor-pointer ${selectedIds.includes(item.productId) ? '' : 'opacity-45'}`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSelected(item.productId)}
                      aria-label={`${selectedIds.includes(item.productId) ? 'Deselect' : 'Select'} ${item.name}`}
                      aria-pressed={selectedIds.includes(item.productId)}
                      className="w-7 -mx-1 shrink-0 flex items-center justify-center text-[14px] text-charcoal"
                    >
                      {selectedIds.includes(item.productId) ? '•' : '○'}
                    </button>
                    <Link
                      href={`/shop/${item.slug}`}
                      onClick={close}
                      className="w-16 h-20 shrink-0 bg-charcoal/5 overflow-hidden"
                      aria-label={`View ${item.name}`}
                    >
                      {item.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/shop/${item.slug}`} onClick={close} className="block text-[0.9rem] text-charcoal font-light truncate hover:underline">
                        {item.name}
                      </Link>
                      {typeof item.price === 'number' && (
                        <p className="text-[0.82rem] text-ash font-light mt-1"><Money amount={item.price} /></p>
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

              <div className="mb-6">
                <ShippingNote />
              </div>

              <div>
                <RecommendedProducts limit={2} />
              </div>
            </div>

            <div className="shrink-0 px-6 pb-6 pt-4 border-t border-charcoal/10 bg-ivory">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] tracking-[0.2em] uppercase text-ash">{t('subtotal')}</span>
                <span className="text-[1.05rem] text-charcoal font-light"><Money amount={subtotal} /></span>
              </div>

              <Link
                href="/checkout"
                onClick={close}
                aria-disabled={selectedItems.length === 0}
                className={`block w-full text-center text-[11px] tracking-[0.3em] uppercase text-ivory px-8 py-3.5 transition-colors ${selectedItems.length ? 'bg-charcoal hover:bg-charcoal/85' : 'bg-charcoal/30 pointer-events-none'}`}
              >
                {t('checkoutCta')}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
