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
            style={{ fontSize: 'clamp(1.3rem, 3.6vw, 3.6rem)', letterSpacing: '0.06em', opacity: 0.35 }}
          >
            {data.eyebrow}
          </p>
        )}

        <div className="absolute inset-x-0 top-[28%] px-6 md:px-[8%] text-center reveal">
          {data.title && (
            <h2
              className="serif-display font-light leading-[1.2] text-charcoal"
              style={{ fontSize: 'clamp(1.3rem, 3.2vw, 3.2rem)' }}
            >
              {data.title}
            </h2>
          )}
          <div className="mt-3 md:mt-5 mx-auto h-px w-12 md:w-16 bg-gold/60" />
          {data.body && (
            <p
              className="mt-3 md:mt-5 mx-auto max-w-[480px] md:max-w-[620px] leading-[1.6] text-ash font-light"
              style={{ fontSize: 'clamp(0.78rem, 1.1vw, 1.15rem)' }}
            >
              {data.body}
            </p>
          )}
          {data.cta && (
            <Link
              href="/collections"
              className="mt-3 md:mt-5 inline-block tracking-[0.28em] uppercase text-charcoal link-underline"
              style={{ fontSize: 'clamp(10px, 0.85vw, 14px)' }}
            >
              {data.cta}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
