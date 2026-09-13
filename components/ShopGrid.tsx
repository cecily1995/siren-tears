'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';

type ShopProduct = {
  _id: string;
  name?: string;
  slug?: { current?: string };
  category?: string;
  stone?: string;
  price?: number;
  status?: string;
  collectionTitle?: string;
  images?: { url?: string; alt?: string }[];
};

type Labels = {
  filters: { all: string; bracelets: string; necklaces: string; rings: string; pendants: string; archive: string };
  status: { sold: string; reserved: string; bespoke: string };
  oneOfOne: string;
  viewPiece: string;
};

const FILTERS = [
  { key: 'all', category: null, archiveOnly: false },
  { key: 'bracelets', category: 'bracelet', archiveOnly: false },
  { key: 'necklaces', category: 'necklace', archiveOnly: false },
  { key: 'rings', category: 'ring', archiveOnly: false },
  { key: 'pendants', category: 'pendant', archiveOnly: false },
  { key: 'archive', category: null, archiveOnly: true }
] as const;

export default function ShopGrid({ products, labels }: { products: ShopProduct[]; labels: Labels }) {
  const [active, setActive] = useState<(typeof FILTERS)[number]['key']>('all');

  const filterDef = FILTERS.find((f) => f.key === active)!;
  const filtered = products.filter((p) => {
    if (filterDef.archiveOnly) return p.status === 'sold';
    if (filterDef.category) return p.category === filterDef.category;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-16 reveal">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={`text-[11px] tracking-[0.28em] uppercase font-light transition-colors pb-1 border-b ${
              active === f.key
                ? 'text-charcoal border-gold'
                : 'text-ash/60 border-transparent hover:text-charcoal'
            }`}
          >
            {labels.filters[f.key]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {filtered.map((p, i) => {
          const isSold = p.status === 'sold';
          const isReserved = p.status === 'reserved';
          const img = p.images?.[0];
          return (
            <Link
              key={p._id}
              href={`/shop/${p.slug?.current ?? ''}`}
              className="group reveal"
              style={{ transitionDelay: `${(i % 8) * 80}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/5 frame-zoom">
                {img?.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img.url}
                    alt={img.alt || p.name || ''}
                    loading="lazy"
                    className={`bg-img w-full h-full object-cover transition-all duration-700 ${
                      isSold ? 'grayscale opacity-70' : ''
                    }`}
                  />
                )}
                {(isSold || isReserved) && (
                  <span className="absolute top-3 left-3 bg-ivory/95 text-charcoal text-[10px] tracking-[0.24em] uppercase px-3 py-1.5 font-light">
                    {isSold ? labels.status.sold : labels.status.reserved}
                  </span>
                )}
              </div>
              <div className="mt-4">
                {p.collectionTitle && (
                  <p className="text-[10px] tracking-[0.24em] uppercase text-ash/60 mb-1.5 font-light">
                    {p.collectionTitle}
                  </p>
                )}
                <h3 className="serif-display text-[1.05rem] font-light text-charcoal leading-tight">
                  {p.name}
                </h3>
                {p.stone && <p className="text-[0.82rem] text-ash font-light mt-1">{p.stone}</p>}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[0.9rem] text-charcoal font-light">
                    {typeof p.price === 'number' ? `NZD $${p.price}` : ''}
                  </span>
                  {!isSold && !isReserved && (
                    <span className="text-[9px] tracking-[0.22em] uppercase text-gold font-light">
                      {labels.oneOfOne}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
