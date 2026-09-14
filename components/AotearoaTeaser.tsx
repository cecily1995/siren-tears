import { Link } from '@/i18n/routing';

type Product = {
  _id: string;
  name?: string;
  slug?: { current?: string };
  stone?: string;
  price?: number;
  images?: { url?: string; alt?: string }[];
};

type Labels = { eyebrow: string; title: string; intro?: string; oneOfOne: string; cta: string };

export default function AotearoaTeaser({ items, labels }: { items: Product[]; labels: Labels }) {
  if (!items.length) return null;

  return (
    <section className="bg-pearl py-24 md:py-36 overflow-hidden">
      <div className="px-6 md:px-12 mx-auto max-w-[1480px] text-center mb-14 reveal">
        <p className="eyebrow mb-5">{labels.eyebrow}</p>
        <h2 className="serif-display text-[clamp(2rem,4vw,3rem)] font-light leading-[1.15] text-charcoal">
          {labels.title}
        </h2>
        {labels.intro && (
          <p className="mt-5 max-w-md mx-auto text-[0.95rem] text-ash font-light">{labels.intro}</p>
        )}
      </div>

      {/* Mobile: horizontal swipe. Desktop: normal grid. */}
      <div className="flex md:grid md:grid-cols-4 gap-5 md:gap-8 overflow-x-auto md:overflow-visible px-6 md:px-12 pb-2 snap-x snap-mandatory no-scrollbar">
        {items.slice(0, 8).map((p, i) => (
          <Link
            key={p._id}
            href={`/shop/${p.slug?.current ?? ''}`}
            className="reveal group shrink-0 w-[58vw] sm:w-[36vw] md:w-auto snap-start"
            style={{ transitionDelay: `${(i % 4) * 100}ms` }}
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
              <h3 className="serif-display text-[1rem] font-light text-charcoal leading-tight">
                {p.name}
              </h3>
              {p.stone && <p className="text-[0.8rem] text-ash font-light mt-1">{p.stone}</p>}
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

      <div className="mt-14 text-center reveal">
        <Link
          href="/shop?line=aotearoa"
          className="text-[11px] tracking-[0.32em] uppercase text-charcoal link-underline"
        >
          {labels.cta}
        </Link>
      </div>
    </section>
  );
}
