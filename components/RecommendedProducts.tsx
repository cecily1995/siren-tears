'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useBag } from '@/lib/bag-context';

type RecommendedProduct = {
  _id: string;
  name: string;
  price?: number;
  category?: string;
  slug: string;
  imageUrl?: string;
};

// "You may also like" -- shown in the Bag drawer and on the Checkout page.
// Deliberately small (a handful of items, no big banner) per the brief.
export default function RecommendedProducts() {
  const { items, addItem } = useBag();
  const t = useTranslations('checkout');
  const [products, setProducts] = useState<RecommendedProduct[]>([]);

  const excludeSlugs = items.map((i) => i.slug).join(',');

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ limit: '4' });
    if (excludeSlugs) params.set('exclude', excludeSlugs);
    fetch(`/api/shop/recommended?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data?.products)) setProducts(data.products);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludeSlugs]);

  if (!products.length) return null;

  return (
    <div>
      <p className="text-[10px] tracking-[0.24em] uppercase text-ash mb-4">{t('recommendedTitle')}</p>
      <ul className="space-y-4">
        {products.map((p) => {
          const inBag = items.some((i) => i.productId === p._id);
          return (
            <li key={p._id} className="flex items-center gap-3">
              <Link href={`/shop/${p.slug}`} className="w-14 h-16 shrink-0 bg-charcoal/5 overflow-hidden block">
                {p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/shop/${p.slug}`} className="text-[0.82rem] text-charcoal font-light leading-snug hover:text-ash transition-colors block truncate">
                  {p.name}
                </Link>
                {typeof p.price === 'number' && (
                  <p className="text-[0.78rem] text-ash/70 font-light mt-0.5">NZD ${p.price}</p>
                )}
              </div>
              <button
                type="button"
                disabled={inBag}
                onClick={() =>
                  addItem({
                    productId: p._id,
                    slug: p.slug,
                    name: p.name,
                    price: p.price,
                    imageUrl: p.imageUrl,
                    category: p.category
                  })
                }
                className="shrink-0 text-[10px] tracking-[0.2em] uppercase text-charcoal border border-charcoal/25 px-3.5 py-2 hover:border-charcoal transition-colors disabled:opacity-40"
              >
                {inBag ? '✓' : t('addCta')}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
