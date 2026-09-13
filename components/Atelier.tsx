type Data = { eyebrow?: string; title?: string; body?: string; imageUrl?: string; imageAlt?: string };

export default function Atelier({ data }: { data: Data }) {
  return (
    <section id="about" className="bg-pearl text-charcoal py-28 md:py-40 px-6 md:px-12">
      <div className="mx-auto max-w-[1280px] grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
        <div className="md:col-span-6 reveal">
          <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/5 frame-zoom">
            {data.imageUrl && (
              <div
                className="bg-img absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url(${data.imageUrl})` }}
                role="img"
                aria-label={data.imageAlt || ''}
              />
            )}
          </div>
        </div>
        <div className="md:col-span-6 reveal" style={{ transitionDelay: '120ms' }}>
          {data.eyebrow && <p className="eyebrow mb-6">{data.eyebrow}</p>}
          {data.title && (
            <h2 className="serif-display text-[clamp(2rem,4vw,3rem)] font-light leading-[1.15]">
              {data.title}
            </h2>
          )}
          {data.body && (
            <p className="mt-8 max-w-md text-[0.98rem] leading-[1.95] text-ash font-light">
              {data.body}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
