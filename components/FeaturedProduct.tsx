type FeaturedData = {
  title?: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  imageAlt?: string;
  detailUrl?: string;
  stoneTitle?: string;
  stoneBody?: string;
  materialTitle?: string;
  materialBody?: string;
  stylingTitle?: string;
  stylingBody?: string;
};

export default function FeaturedProduct({ data }: { data: FeaturedData }) {
  const sections = [
    { title: data.stoneTitle, body: data.stoneBody },
    { title: data.materialTitle, body: data.materialBody },
    { title: data.stylingTitle, body: data.stylingBody }
  ].filter((s) => s.title || s.body);

  return (
    <section
      id="story"
      className="relative overflow-hidden py-16 md:py-24 px-6 md:px-12"
      style={{
        background:
          'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 60%, #FFFFFF 100%)'
      }}
    >
      <div className="mx-auto max-w-[1380px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
          {/* Image */}
          <div className="md:col-span-7 reveal">
            <div className="relative frame-zoom overflow-hidden aspect-[4/5] bg-charcoal/5">
              <div
                className="bg-img absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url(${data.imageUrl})` }}
                role="img"
                aria-label={data.imageAlt || ''}
              />
            </div>
            {data.detailUrl && (
              <div className="hidden md:block relative mt-[-90px] ml-auto w-[42%] aspect-[4/5] overflow-hidden frame-zoom shadow-[0_30px_60px_-30px_rgba(38,35,31,0.45)]">
                <div
                  className="bg-img absolute inset-0 bg-center bg-cover"
                  style={{ backgroundImage: `url(${data.detailUrl})` }}
                  role="img"
                  aria-label="Close-up of the stone"
                />
              </div>
            )}
          </div>

          {/* Text */}
          <div className="md:col-span-5 reveal" style={{ transitionDelay: '160ms' }}>
            {data.subtitle && <p className="eyebrow mb-6">{data.subtitle}</p>}
            <h2 className="serif-display text-[clamp(2.4rem,4.8vw,4rem)] font-light leading-[1.05]">
              {data.title}
            </h2>
            <p className="mt-7 text-[1rem] leading-[1.75] text-ash font-light max-w-md">
              {data.body}
            </p>

            <div className="mt-8 h-px w-12 bg-gold/60" />

            <div className="mt-8 space-y-7">
              {sections.map((s, i) => (
                <div key={i} className="reveal" style={{ transitionDelay: `${200 + i * 120}ms` }}>
                  <h3 className="serif-display text-[1.45rem] font-light mb-3 text-charcoal">
                    {s.title}
                  </h3>
                  <p className="text-[0.95rem] leading-[1.75] text-ash font-light max-w-md">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
