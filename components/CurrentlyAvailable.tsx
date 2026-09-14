import { Link } from '@/i18n/routing';

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
          <p className="eyebrow mb-5">{labels.eyebrow}</p>
          <h2 className="serif-display text-[clamp(2rem,4vw,3rem)] font-light leading-[1.15]">
            {labels.title}
          </h2>
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
              </div>
              <div className="mt-4">
                {p.collectionTitle && (
                  <p className="text-[10px] tracking-[0.24em] uppercase text-ash/60 mb-1.5 font-light">
                    {p.collectionTitle}
                  </p>
                )}
                <h3 className="serif-display text-[1rem] font-light text-charcoal leading-tight">
                  {p.name}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[0.88rem] text-charcoal font-light">
                    {typeof p.price === 'number' ? `NZD $${p.price}` : ''}
                  </span>
                  <span className="text-[9px] tracking-[0.22em] uppercase text-gold font-light">
                    {labels.oneOfOne}
                  </span>
                </div>
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
