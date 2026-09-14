type Data = { eyebrow?: string; title?: string; body?: string; cta?: string };

import { Link } from '@/i18n/routing';

export default function OneOfOne({ data }: { data: Data }) {
  return (
    <section className="bg-pearl text-charcoal py-10 md:py-36 px-6 md:px-12 relative overflow-hidden">
      <div className="relative mx-auto max-w-[720px] text-center reveal">
        {data.eyebrow && <p className="eyebrow mb-3 md:mb-6">{data.eyebrow}</p>}
        {data.title && (
          <h2 className="serif-display text-[1.6rem] md:text-[clamp(2rem,4.2vw,3.2rem)] font-light leading-[1.15] text-charcoal">
            {data.title}
          </h2>
        )}
        <div className="mt-4 md:mt-8 mx-auto h-px w-16 bg-gold/60" />
        {data.body && (
          <p className="mt-4 md:mt-8 text-[0.88rem] md:text-[1rem] leading-[1.6] md:leading-[1.95] text-ash font-light">
            {data.body}
          </p>
        )}
        {data.cta && (
          <Link
            href="/collections"
            className="mt-5 md:mt-10 inline-block text-[11px] tracking-[0.32em] uppercase text-charcoal link-underline"
          >
            {data.cta}
          </Link>
        )}
      </div>
    </section>
  );
}
