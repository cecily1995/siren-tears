type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  imageUrl?: string;
  imageAlt?: string;
  children?: React.ReactNode;
  titleClassName?: string;
};

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1767131636996-ae27286d36fb?auto=format&fit=crop&w=2000&q=80';

/**
 * Warm, light-toned header for inner pages (Shipping, Bespoke, Care, Shop, etc).
 * The homepage Hero keeps its dark ocean photography — this is deliberately
 * lighter — but it still carries a soft, low-opacity photographic backdrop
 * (rather than a flat solid colour) so inner pages keep some atmosphere and
 * brand mood instead of reading as empty white space.
 */
export default function PageHeader({ eyebrow, title, intro, imageUrl, imageAlt, children, titleClassName }: Props) {
  return (
    <section className="relative bg-pearl text-charcoal px-6 md:px-12 pt-32 pb-14 md:pt-36 md:pb-16 overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-cover opacity-[0.22]"
        style={{ backgroundImage: `url(${imageUrl || DEFAULT_IMAGE})` }}
        role={imageAlt ? 'img' : undefined}
        aria-label={imageAlt}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.82) 55%, rgba(255,255,255,0.97) 100%)'
        }}
      />
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 45% at 50% 0%, rgba(167,134,86,0.1) 0%, rgba(167,134,86,0) 70%)'
        }}
      />
      <div className="relative mx-auto max-w-[820px] text-center reveal">
        {eyebrow && <p className="eyebrow mb-6">{eyebrow}</p>}
        <h1
          className={
            titleClassName ||
            'serif-display text-[clamp(2.2rem,4.8vw,3.8rem)] font-light leading-[1.12] text-charcoal'
          }
        >
          {title}
        </h1>
        {intro && (
          <p className="mt-7 max-w-xl mx-auto text-[0.98rem] leading-[1.95] text-ash font-light">
            {intro}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
