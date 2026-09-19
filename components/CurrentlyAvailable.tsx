import { Link } from '@/i18n/routing';
import WishlistButton from './WishlistButton';

type Product = {
  _id: string;
  name?: string;
  slug?: { current?: string };
  stone?: string;
  price?: number;
  collectionTitle?: string;
  images?: { url?: string; alt?: string }[];
};

type Labels = { eyebrow: string; title: string; subtitle?: string; oneOfOne: string; cta: string };

export default function CurrentlyAvailable({
  items,
  labels
}: {
  items: Product[];
  labels: Labels;
}) {
  if (!items.length) return null;

  return (
    <section className="bg-pearl py-12 md:py-16 px-6 md:px-12">
      <div className="mx-auto max-w-[1480px]">
        {/* Exactly two lines: the series name, then one short line of copy.
            Nothing else stacked above/below -- no separate eyebrow or
            "One of One" tag, since that's folded into the second line. */}
        <div className="text-left md:text-center mb-8 md:mb-12 reveal">
          <h2 className="serif-display uppercase tracking-[0.04em] text-[clamp(1.6rem,4vw,2.8rem)] font-light leading-[1.15] text-charcoal">
            {labels.eyebrow}
          </h2>
          {labels.subtitle && (
            <p className="mt-3 md:mt-4 text-[0.85rem] md:text-[1rem] text-ash font-light">
              {labels.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-8">
          {items.slice(0, 12).map((p, i) => (
            <Link
              key={p._id}
              href={`/shop/${p.slug?.current ?? ''}`}
              // Mobile shows only the first 6 (2 cols x 3 rows); from lg
              // up, all 12 show (6 cols x 2 rows).
              className={`group reveal ${i >= 6 ? 'hidden lg:block' : ''}`}
              style={{ transitionDelay: `${(i % 6) * 100}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/5 frame-zoom">
                {p.images?.[0]?.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.images[0].url}
                    alt={p.images[0].alt || p.name || ''}
                    loading="lazy"
                    className="bg-img w-full h-full object-cover"
                  />
                )}
                {p.images?.[1]?.url && (
                  // Desktop only: on hover, cross-fade to a second angle/shot.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.images[1].url}
                    alt={p.images[1].alt || p.name || ''}
                    loading="lazy"
                    className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                )}
                <WishlistButton
                  productId={p._id}
                  slug={p.slug?.current ?? ''}
                  name={p.name ?? ''}
                  price={p.price}
                  imageUrl={p.images?.[0]?.url}
                />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 md:mt-12 text-center reveal">
          <Link
            href="/shop"
            className="text-[11px] tracking-[0.32em] uppercase text-charcoal link-underline"
          >
            {labels.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
