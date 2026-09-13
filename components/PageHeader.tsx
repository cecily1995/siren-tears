type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
};

/**
 * Warm, light-toned header for inner pages (Shipping, Bespoke, Care, Shop, etc).
 * The homepage Hero keeps its dark ocean photography — this is deliberately
 * the opposite: ivory/stone, so inner pages read as contemporary quiet-luxury
 * rather than "dark art site".
 */
export default function PageHeader({ eyebrow, title, intro, children }: Props) {
  return (
    <section className="relative bg-pearl text-charcoal px-6 md:px-12 pt-40 pb-20 md:pt-48 md:pb-24 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.5] pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 45% at 50% 0%, rgba(167,134,86,0.08) 0%, rgba(167,134,86,0) 70%)'
        }}
      />
      <div className="relative mx-auto max-w-[820px] text-center reveal">
        {eyebrow && <p className="eyebrow mb-6">{eyebrow}</p>}
        <h1 className="serif-display text-[clamp(2.2rem,4.8vw,3.8rem)] font-light leading-[1.12] text-charcoal">
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
