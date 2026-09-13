import { Link } from '@/i18n/routing';

type CollectionItem = {
  _id: string;
  title?: string;
  subtitle?: string;
  slug?: { current?: string };
  coverUrl?: string;
  coverAlt?: string;
  scale?: 'tall' | 'wide' | 'large' | 'small' | string;
};

type Labels = {
  eyebrow: string;
  title: string;
  intro: string;
  chapter: string;
  viewLink: string;
};

const cellClass = (scale: string | undefined, i: number) => {
  // A clean, evenly-tiled grid (no mixed row-spans) so any number of
  // collections tiles reliably at any viewport width, with a slightly
  // larger "feature" tile for every 3rd item for a touch of editorial
  // rhythm without the fragility of a hand-tuned masonry pattern.
  return i % 3 === 0 ? 'md:col-span-6 aspect-[16/11]' : 'md:col-span-3 aspect-[3/4]';
};

export default function Collections({
  items,
  labels
}: {
  items: CollectionItem[];
  labels: Labels;
}) {
  return (
    <section id="collections" className="bg-ivory py-32 md:py-44 px-6 md:px-12">
      <div className="mx-auto max-w-[1480px]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20 reveal">
          <div className="max-w-xl">
            <p className="eyebrow mb-5">{labels.eyebrow}</p>
            <h2 className="serif-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-light leading-[1.1]">
              {labels.title}
            </h2>
          </div>
          <p className="md:max-w-sm text-[0.95rem] leading-[1.9] text-ash font-light">
            {labels.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {items.map((c, i) => (
            <Link
              key={c._id ?? i}
              href="/collections"
              className={`group reveal frame-zoom relative overflow-hidden bg-charcoal/5 ${cellClass(
                c.scale,
                i
              )}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div
                className="bg-img absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url(${c.coverUrl})` }}
                role="img"
                aria-label={c.coverAlt || c.title || ''}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-charcoal/10 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
              <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-10 text-ivory">
                <div className="overflow-hidden">
                  <p className="eyebrow text-ivory/75 mb-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-700 ease-editorial">
                    {String(i + 1).padStart(2, '0')} &nbsp;·&nbsp; {labels.chapter}
                  </p>
                </div>
                <h3 className="serif-display text-[2.1rem] md:text-[2.6rem] font-light leading-tight tracking-wide">
                  {c.title}
                </h3>
                {c.subtitle && (
                  <p className="mt-3 max-w-md text-[0.92rem] text-ivory/85 font-light leading-[1.85] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-editorial">
                    {c.subtitle}
                  </p>
                )}
                <span className="mt-6 text-[11px] tracking-[0.36em] uppercase text-ivory/85 link-underline w-fit">
                  {labels.viewLink}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
