type BrandStoryData = {
  eyebrow?: string;
  title?: string;
  paragraphs?: string[];
  imageUrl?: string;
  imageAlt?: string;
  stats?: { value?: string; label?: string }[];
};

export default function BrandStory({ data }: { data: BrandStoryData }) {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-16 md:py-24 px-6 md:px-12 text-charcoal"
      style={{
        background:
          'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)'
      }}
    >
      <div className="mx-auto max-w-[1380px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
          {/* Image column */}
          <div className="md:col-span-6 md:sticky md:top-28 reveal">
            <div className="relative overflow-hidden aspect-[4/5] frame-zoom">
              <div
                className="bg-img absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url(${data.imageUrl})` }}
                role="img"
                aria-label={data.imageAlt || ''}
              />
              <div
                className="absolute inset-0 mix-blend-soft-light opacity-60"
                style={{
                  background:
                    'radial-gradient(60% 50% at 50% 30%, rgba(255, 235, 195, 0.55) 0%, rgba(255, 235, 195, 0) 70%)'
                }}
              />
            </div>
          </div>

          {/* Text column */}
          <div className="md:col-span-6 md:pl-8 reveal" style={{ transitionDelay: '160ms' }}>
            {data.eyebrow && <p className="eyebrow mb-6">{data.eyebrow}</p>}
            {data.title && (
              <h2 className="serif-display text-[clamp(2.2rem,4.4vw,3.6rem)] font-light leading-[1.1]">
                {data.title}
              </h2>
            )}
            <div className="mt-7 space-y-4 text-[1rem] leading-[1.75] text-ash font-light max-w-xl">
              {(data.paragraphs ?? []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {data.stats && data.stats.length > 0 && (
              <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
                {data.stats.map((s, i) => (
                  <div key={i} className="border-t border-charcoal/15 pt-5">
                    <div className="serif-display text-[2.4rem] font-light leading-none text-charcoal">
                      {s.value}
                    </div>
                    <div className="mt-3 text-[10px] tracking-[0.32em] uppercase text-ash font-light">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
