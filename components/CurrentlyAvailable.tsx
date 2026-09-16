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

type Labels = { eyebrow: string; title: string; oneOfOne: string; cta: string };

export default function CurrentlyAvailable({
  items,
  labels
}: {
  items: Product[];
  labels: Labels;
}) {
  if (!items.length) return null;

  return (
    <section className="bg-pearl py-14 md:py-20 px-6 md:px-12">
      <div className="mx-auto max-w-[1480px]">
        <div className="text-left md:text-center mb-8 md:mb-12 reveal">
          <h2 className="serif-display text-[clamp(2rem,4vw,3rem)] font-light leading-[1.15]">
            {labels.eyebrow}
          </h2>
          <p className="mt-4 text-[9px] tracking-[0.22em] uppercase text-gold font-light">
            {labels.oneOfOne}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-8">
          {items.slice(0, 6).map((p, i) => (
            <Link
              key={p._id}
              href={`/shop/${p.slug?.current ?? ''}`}
              className="group reveal"
              style={{ transitionDelay: `${i * 100}ms` }}
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
