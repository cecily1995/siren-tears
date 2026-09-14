import { Link } from '@/i18n/routing';

type Article = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  category?: string;
  excerpt?: string;
  coverUrl?: string;
  coverAlt?: string;
};

type Labels = { eyebrow: string; title: string; readLink: string; viewAllCta: string };

export default function JournalTeaser({ items, labels }: { items: Article[]; labels: Labels }) {
  if (!items.length) return null;

  return (
    <section className="bg-ivory py-20 md:py-32">
      <div className="px-6 md:px-12 mx-auto max-w-[1480px] text-center mb-12 md:mb-16 reveal">
        <p className="eyebrow mb-5">{labels.eyebrow}</p>
        <h2 className="serif-display text-[clamp(2rem,4vw,3rem)] font-light leading-[1.15] text-charcoal">
          {labels.title}
        </h2>
      </div>

      <div className="flex md:grid md:grid-cols-3 gap-5 md:gap-8 overflow-x-auto px-6 md:px-12 pb-2 snap-x snap-mandatory no-scrollbar">
        {items.slice(0, 6).map((a, i) => (
          <Link
            key={a._id}
            href="/journal"
            className="reveal group shrink-0 w-[74vw] sm:w-[44vw] md:w-auto snap-start"
            style={{ transitionDelay: `${(i % 3) * 100}ms` }}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/5 frame-zoom">
              {a.coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={a.coverUrl}
                  alt={a.coverAlt || a.title || ''}
                  loading="lazy"
                  className="bg-img w-full h-full object-cover"
                />
              )}
            </div>
            <div className="mt-4">
              {a.category && (
                <p className="text-[10px] tracking-[0.24em] uppercase text-gold/80 mb-2 font-light">
                  {a.category}
                </p>
              )}
              <h3 className="serif-display text-[1.1rem] font-light text-charcoal leading-tight mb-2">
                {a.title}
              </h3>
              {a.excerpt && (
                <p className="text-[0.85rem] text-ash font-light leading-[1.7] line-clamp-2">
                  {a.excerpt}
                </p>
              )}
              <span className="mt-3 inline-block text-[10px] tracking-[0.28em] uppercase text-charcoal/70 link-underline">
                {labels.readLink}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 md:mt-14 text-center reveal">
        <Link
          href="/journal"
          className="text-[11px] tracking-[0.32em] uppercase text-charcoal link-underline"
        >
          {labels.viewAllCta}
        </Link>
      </div>
    </section>
  );
}
