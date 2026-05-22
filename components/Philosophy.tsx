type PhilosophyData = {
  sectionLabel?: string;
  sectionTitle?: string;
  pillars?: { title?: string; body?: string }[];
};

export default function Philosophy({ data }: { data: PhilosophyData }) {
  return (
    <section className="bg-pearl text-charcoal py-32 md:py-44 px-6 md:px-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="text-center max-w-2xl mx-auto reveal">
          {data.sectionLabel && <p className="eyebrow mb-6">{data.sectionLabel}</p>}
          {data.sectionTitle && (
            <h2 className="serif-display text-[clamp(2rem,4vw,3.4rem)] font-light leading-[1.15]">
              {data.sectionTitle}
            </h2>
          )}
          <div className="mt-10 mx-auto h-px w-16 bg-gold/60" />
        </div>

        <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">
          {(data.pillars ?? []).map((p, i) => (
            <article
              key={i}
              className="reveal text-center md:text-left"
              style={{ transitionDelay: `${i * 140}ms` }}
            >
              <div className="text-[11px] tracking-[0.4em] uppercase text-gold mb-6 font-light">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="serif-display text-[1.85rem] md:text-[2.1rem] font-light leading-tight mb-6 text-charcoal">
                {p.title}
              </h3>
              <p className="text-[0.95rem] leading-[1.9] text-ash font-light max-w-sm md:max-w-none">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
