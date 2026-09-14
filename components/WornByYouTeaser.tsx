import { Link } from '@/i18n/routing';

type Item = {
  _id: string;
  customerHandle?: string;
  images?: { url?: string; alt?: string }[];
};

type Labels = {
  eyebrow: string;
  title: string;
  subtitle: string;
  shareCta: string;
  viewCta: string;
};

export default function WornByYouTeaser({ items, labels }: { items: Item[]; labels: Labels }) {
  const covers = items.filter((i) => i.images?.[0]?.url).slice(0, 8);

  return (
    <section className="bg-pearl pt-14 pb-20 md:py-36 overflow-hidden">
      <div className="px-6 md:px-12 mx-auto max-w-[1480px] text-center mb-10 md:mb-16 reveal">
        <p className="eyebrow mb-5">{labels.eyebrow}</p>
        <h2 className="serif-display text-[clamp(2rem,4vw,3rem)] font-light leading-[1.15] text-charcoal">
          {labels.title}
        </h2>
        <p className="mt-5 text-[0.95rem] text-ash font-light">{labels.subtitle}</p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8">
          <Link
            href="/worn-by-you"
            className="text-[11px] tracking-[0.32em] uppercase text-charcoal link-underline"
          >
            {labels.viewCta}
          </Link>
          <a
            href="https://wa.me/64274326262"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.32em] uppercase text-gold link-underline"
          >
            {labels.shareCta}
          </a>
        </div>
      </div>

      {covers.length > 0 ? (
        <div className="flex gap-4 md:gap-6 overflow-x-auto px-6 md:px-12 pb-2 snap-x snap-mandatory [-webkit-overflow-scrolling:touch] no-scrollbar">
          {covers.map((item, i) => (
            <Link
              key={item._id ?? i}
              href="/worn-by-you"
              className="reveal group shrink-0 w-[62vw] sm:w-[38vw] md:w-[24vw] lg:w-[18vw] snap-start"
              style={{ transitionDelay: `${(i % 6) * 90}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/5 frame-zoom">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.images![0].url}
                  alt={item.images![0].alt || 'Siren Tears, as worn'}
                  className="bg-img w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {item.customerHandle && (
                <p className="mt-3 text-[10px] tracking-[0.2em] uppercase text-ash/70 font-light">
                  {item.customerHandle}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
