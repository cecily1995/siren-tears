'use client';

import { Link } from '@/i18n/routing';
import WishlistButton from './WishlistButton';

type Product = {
  _id: string;
  name?: string;
  slug?: { current?: string };
  productLine?: string;
  price?: number;
  status?: string;
  images?: { url?: string; alt?: string }[];
};

type Labels = {
  status: { sold: string; reserved: string };
  oneOfOne: string;
  viewPiece: string;
  empty: string;
};

// Deliberately simple: no line/category filters, no "All"/tabs -- just
// whatever's been flagged "New Arrival" in Studio, in one clean grid.
// Card markup intentionally mirrors ShopGrid's card exactly (same badge
// placement, same price-row layout, same hover image swap) so a piece
// looks identical whether it's found here or in the main Shop.
export default function NewArrivalsGrid({ items, labels }: { items: Product[]; labels: Labels }) {
  if (!items.length) {
    return (
      <div className="px-6 md:px-12 py-14 md:py-20 text-center">
        <p className="text-[0.95rem] text-ash font-light">{labels.empty}</p>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-12 md:py-16 max-w-[1480px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {items.map((p, i) => {
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
