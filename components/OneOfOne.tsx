type Data = { eyebrow?: string; title?: string; body?: string };

export default function OneOfOne({ data }: { data: Data }) {
  return (
    <section className="bg-charcoal text-ivory py-28 md:py-36 px-6 md:px-12 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.1] pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 50%, rgba(245, 215, 165, 0.5) 0%, rgba(245, 215, 165, 0) 70%)'
        }}
      />
      <div className="relative mx-auto max-w-[720px] text-center reveal">
        {data.eyebrow && <p className="eyebrow text-gold/85 mb-6">{data.eyebrow}</p>}
        {data.title && (
          <h2 className="serif-display text-[clamp(2rem,4.2vw,3.2rem)] font-light leading-[1.15]">
            {data.title}
          </h2>
        )}
        {data.body && (
          <p className="mt-8 text-[1rem] leading-[1.95] text-ivory/70 font-light">{data.body}</p>
        )}
      </div>
    </section>
  );
}
