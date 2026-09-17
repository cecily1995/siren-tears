'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import WishlistButton from './WishlistButton';

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
  lineFilterLabel: string;
  categoryFilterLabel: string;
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

// Fixed-label dropdown: the button always shows the same short word ("Line",
// "Category"), never the selected value -- so it can never be pushed wide or
// truncated by a long collection name. Opening it reveals every option in
// full, with the current pick marked in gold.
function FilterDropdown({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: { key: string; label: string }[];
  onChange: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between border border-charcoal/20 bg-ivory px-4 py-3 text-[11px] tracking-[0.16em] uppercase text-charcoal"
      >
        <span>{label}</span>
        <svg
          width="9"
          height="9"
          viewBox="0 0 12 12"
          className={`shrink-0 ml-2 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-ivory border border-charcoal/20 max-h-64 overflow-y-auto shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          {options.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => {
                onChange(opt.key);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 text-[11px] tracking-[0.1em] uppercase transition-colors hover:bg-pearl ${
                opt.key === value ? 'text-gold' : 'text-charcoal/80 font-light'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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

  const router = useRouter();
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // When navigation happens *outside* this component's own tabs (e.g. the
  // top nav's plain "Shop" link, or the desktop dropdown's "All" item --
  // both just navigate to a new URL), the server re-renders this page with
  // new initialLine/initialCollection/initialFilter props, but a client
  // component's useState only reads those on first mount, so the filter
  // state silently stayed wherever it was and the grid never visibly
  // changed. Keep it in sync with the incoming props whenever they change.
  useEffect(() => {
    const nextLine: Line = initialLine === 'beaded' || initialLine === 'aotearoa' ? initialLine : 'all';
    setLine(nextLine);
    setSubFilter(initialCollection ?? initialFilter ?? 'all');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLine, initialCollection, initialFilter]);

  function changeLine(next: Line) {
    setLine(next);
    setSubFilter('all');
  }

  // Keep the URL in sync with the filter state -- without this, switching
  // lines/categories via these tabs was pure client state with no URL
  // change, so the page's own server-rendered header (which reads the
  // line/collection from the URL) stayed stuck showing whatever it was
  // when the page first loaded, e.g. still "Aotearoa" after switching to
  // Beaded via the on-page tabs.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (line !== 'all') params.set('line', line);
    if (subFilter !== 'all') {
      if (line === 'beaded') params.set('collection', subFilter);
      else params.set('category', subFilter);
    }
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line, subFilter]);

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

      {/* Mobile: tap-to-open dropdown menus, one for line, one for sub-filter.
          Button label is always fixed text, never the selected value, so a
          long collection name can never truncate or widen it. */}
      <div className="md:hidden mb-10 grid grid-cols-2 gap-3">
        <FilterDropdown
          label={labels.lineFilterLabel}
          value={line}
          options={LINES.map((l) => ({ key: l, label: labels.lineFilters[l] }))}
          onChange={(key) => changeLine(key as Line)}
        />
        <FilterDropdown
          label={labels.categoryFilterLabel}
          value={subFilter}
          options={subOptions}
          onChange={setSubFilter}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {filtered.map((p, i) => {
          const isSold = p.status === 'sold';
          const isReserved = p.status === 'reserved';
          const isBeaded = (p.productLine ?? 'beaded') === 'beaded';
          const img = p.images?.[0];
          const hoverImg = p.images?.[1];
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
                {hoverImg?.url && (
                  // Desktop only: on hover, cross-fade to a second angle/shot
                  // of the piece -- a quick preview without clicking in.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={hoverImg.url}
                    alt={hoverImg.alt || p.name || ''}
                    loading="lazy"
                    className={`hidden md:block absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      isSold ? 'grayscale opacity-70' : ''
                    }`}
                  />
                )}
                <WishlistButton
                  productId={p._id}
                  slug={p.slug?.current ?? ''}
                  name={p.name ?? ''}
                  price={p.price}
                  imageUrl={img?.url}
                />
                {/* Only SOLD/RESERVED lives on the image -- plain text with
                    a soft shadow, no chip/border. "One of One" stays below
                    the image, in the text block (per the brief, this one
                    specifically should NOT move onto the photo). */}
                {(isSold || isReserved) && (
                  <span
                    className="absolute bottom-3 right-3 z-10 text-[9px] tracking-[0.22em] uppercase font-light text-ivory"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.55)' }}
                  >
                    {isSold ? labels.status.sold : labels.status.reserved}
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-ivory/90 to-transparent">
                  <span className="text-[9px] tracking-[0.24em] uppercase text-charcoal font-light">
                    {labels.viewPiece}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <h3
                  className="serif-display text-[1.05rem] font-light text-charcoal overflow-hidden"
                  style={{ lineHeight: 1.375, height: '2.9rem' }}
                >
                  {p.name}
                </h3>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-[0.9rem] text-charcoal font-light">
                    {typeof p.price === 'number' ? `NZD $${p.price}` : ''}
                  </span>
                  {isBeaded && !isSold && !isReserved && (
                    <span className="text-[7px] tracking-[0.18em] uppercase font-light text-gold shrink-0 ml-2">
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
