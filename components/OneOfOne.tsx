type Data = { eyebrow?: string; title?: string; body?: string; cta?: string };

import { Link } from '@/i18n/routing';

export default function OneOfOne({ data }: { data: Data }) {
  return (
    <section className="relative overflow-hidden py-6 md:py-10 px-4 md:px-8">
      <div className="relative mx-auto max-w-[1480px]">
        {/* Full-bleed landscape photo -- padding above/below is deliberately
            slim (the photo itself is the visual weight of this section, not
            a tall block of empty background like before). */}
        <img
          src="/images/one-of-one-bg.jpg"
          alt="A hand wearing a Siren Tears bracelet, resting near the face"
          className="w-full h-auto block"
        />

        {/* "One of One" sits large and faint in the plain space at top
            right of the photo -- never a solid chip/border, just quiet
            brand-gold type. */}
        {data.eyebrow && (
          <p
            className="absolute top-[5%] right-[2%] font-serif font-light uppercase text-gold"
            style={{ fontSize: 'clamp(1.3rem, 3.2vw, 2rem)', letterSpacing: '0.06em', opacity: 0.35 }}
          >
            {data.eyebrow}
          </p>
        )}

        <div className="absolute inset-x-0 top-[28%] px-6 md:px-[8%] text-center reveal">
          {data.title && (
            <h2 className="serif-display text-[1.3rem] md:text-[clamp(1.6rem,2.6vw,2.2rem)] font-light leading-[1.2] text-charcoal">
              {data.title}
            </h2>
          )}
          <div className="mt-3 mx-auto h-px w-12 bg-gold/60" />
          {data.body && (
            <p className="mt-3 mx-auto max-w-[480px] text-[0.78rem] md:text-[0.85rem] leading-[1.6] text-ash font-light">
              {data.body}
            </p>
          )}
          {data.cta && (
            <Link
              href="/collections"
              className="mt-3 inline-block text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-charcoal link-underline"
            >
              {data.cta}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
