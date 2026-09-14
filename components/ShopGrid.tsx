'use client';

import { useMemo, useState } from 'react';
import { Link } from '@/i18n/routing';

type ShopProduct = {
  _id: string;
  name?: string;
  slug?: { current?: string };
  category?: string;
  productLine?: string;
  stone?: string;
  price?: number;
  status?: string;
  collectionTitle?: string;
  images?: { url?: string; alt?: string }[];
};

type Labels = {
  filters: {
    all: string;
    rings: string;
    braceletBead: string;
    braceletChain: string;
    necklaces: string;
    pendants: string;
    bangles: string;
    earrings: string;
    archive: string;
    bespokeShowcase: string;
  };
  lineFilters: { all: string; beaded: string; aotearoa: string };
  status: { sold: string; reserved: string; bespoke: string };
  oneOfOne: string;
  viewPiece: string;
};

type Line = 'all' | 'beaded' | 'aotearoa';

const LINES: Line[] = ['all', 'beaded', 'aotearoa'];

// Category sub-filters shown when line === 'all'
const ALL_CATEGORY_FILTERS = [
  { key: 'rings', category: 'ring' },
  { key: 'braceletChain', category: 'braceletChain' },
  { key: 'braceletBead', category: 'braceletBead' },
  { key: 'necklaces', category: 'necklace' },
  { key: 'pendants', category: 'pendant' },
  { key: 'bangles', category: 'bangle' }
] as const;

// Category sub-filters shown when line === 'aotearoa'
const AOTEAROA_CATEGORY_FILTERS = [
  { key: 'necklaces', category: 'necklace' },
  { key: 'rings', category: 'ring' },
  { key: 'bangles', category: 'bangle' },
  { key: 'earrings', category: 'earring' }
] as const;

export default function ShopGrid({
  products,
  labels,
  collectionNames,
  initialFilter,
  initialLine,
  initialCollection,
  initialQuery
}: {
  products: ShopProduct[];
  labels: Labels;
  collectionNames: string[];
  initialFilter?: string;
  initialLine?: string;
  initialCollection?: string;
  initialQuery?: string;
}) {
  const [line, setLine] = useState<Line>(
    initialLine === 'beaded' || initialLine === 'aotearoa' ? initialLine : 'all'
  );
  const [subFilter, setSubFilter] = useState<string>(initialCollection ?? initialFilter ?? 'all');
  const [query] = useState(initialQuery ?? '');

  function changeLine(next: Line) {
    setLine(next);
    setSubFilter('all');
  }

  const subOptions: { key: string; label: string }[] = useMemo(() => {
    if (line === 'beaded') {
      return [
        { key: 'all', label: labels.lineFilters.all },
        ...collectionNames.map((name) => ({ key: name, label: name })),
        { key: 'bespokeShowcase', label: labels.filters.bespokeShowcase }
      ];
    }
    if (line === 'aotearoa') {
      return [
        { key: 'all', label: labels.lineFilters.all },
        ...AOTEAROA_CATEGORY_FILTERS.map((f) => ({ key: f.category, label: labels.filters[f.key] }))
      ];
    }
    return [
      { key: 'all', label: labels.filters.all },
      ...ALL_CATEGORY_FILTERS.map((f) => ({ key: f.category, label: labels.filters[f.key] })),
      { key: 'bespokeShowcase', label: labels.filters.bespokeShowcase },
      { key: 'archive', label: labels.filters.archive }
    ];
  }, [line, collectionNames, labels]);

  const filtered = products.filter((p) => {
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      return (p.name?.toLowerCase().includes(q) || p.stone?.toLowerCase().includes(q)) ?? false;
    }
    const productLine = p.productLine ?? 'beaded';
    if (line !== 'all' && productLine !== line) return false;

    if (subFilter === 'all') return true;
    if (subFilter === 'archive') return p.status === 'sold';
    if (subFilter === 'bespokeShowcase') return p.status === 'bespoke';
    if (line === 'beaded') return p.collectionTitle === subFilter;
    return p.category === subFilter;
  });

  return (
    <div>
      {/* Desktop: line tabs + sub-filter buttons */}
      <div className="hidden md:block">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8 reveal">
          {LINES.map((l) => (
            <button
              key={l}
              onClick={() => changeLine(l)}
              className={`text-[10px] tracking-[0.24em] uppercase font-light transition-colors pb-1 border-b ${
                line === l ? 'text-charcoal border-gold' : 'text-ash/50 border-transparent hover:text-charcoal'
              }`}
            >
              {labels.lineFilters[l]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-16 reveal">
          {subOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSubFilter(opt.key)}
              className={`text-[11px] tracking-[0.28em] uppercase font-light transition-colors pb-1 border-b ${
                subFilter === opt.key
                  ? 'text-charcoal border-gold'
                  : 'text-ash/60 border-transparent hover:text-charcoal'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: tap-to-open dropdown menus, one for line, one for sub-filter */}
      <div className="md:hidden mb-10 reveal grid grid-cols-2 gap-3">
        <div className="relative">
          <select
            value={line}
            onChange={(e) => changeLine(e.target.value as Line)}
            className="w-full appearance-none border border-charcoal/20 bg-ivory px-4 py-3 text-[11px] tracking-[0.16em] uppercase text-charcoal"
          >
            {LINES.map((l) => (
              <option key={l} value={l}>
                {labels.lineFilters[l]}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ash text-[10px]">
            ▾
          </span>
        </div>
        <div className="relative">
          <select
            value={subFilter}
            onChange={(e) => setSubFilter(e.target.value)}
            className="w-full appearance-none border border-charcoal/20 bg-ivory px-4 py-3 text-[11px] tracking-[0.16em] uppercase text-charcoal"
          >
            {subOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ash text-[10px]">
            ▾
          </span>
        </div>
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
                <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-ivory/90 to-transparent">
                  <span className="text-[9px] tracking-[0.24em] uppercase text-charcoal font-light">
                    {labels.viewPiece}
                  </span>
                </div>
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
