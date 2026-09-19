type Data = {
  eyebrow?: string;
  title?: string;
  body?: string;
  paragraphs?: string[];
  stats?: { value?: string; label?: string }[];
  imageUrl?: string;
  imageAlt?: string;
};

export default function Atelier({ data }: { data: Data }) {
  return (
    <section id="about" className="bg-pearl text-charcoal">
      {/* Mobile: full-bleed portrait image first (edge-to-edge, no inset --
          matches the 3:4 photography used everywhere else), story text
          below with its own padding. */}
      <div className="md:hidden">
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-charcoal/5">
          {data.imageUrl && (
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: `url(${data.imageUrl})` }}
              role="img"
              aria-label={data.imageAlt || ''}
            />
          )}
        </div>
        <div className="px-6 py-12">
          <AtelierText data={data} align="left" />
        </div>
      </div>

      {/* Desktop: original side-by-side layout, image left / text right, text vertically centred against the image so there's no dead space below it. */}
      <div className="hidden md:block px-12 py-24">
        <div className="mx-auto max-w-[1280px] grid grid-cols-12 gap-16 items-center">
          <div className="col-span-6 reveal">
            <div className="relative aspect-[3/4] overflow-hidden bg-charcoal/5 frame-zoom">
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
          <div className="col-span-6 reveal" style={{ transitionDelay: '120ms' }}>
            <AtelierText data={data} align="left" />
          </div>
        </div>
      </div>
    </section>
  );
}

function AtelierText({ data }: { data: Data; align: 'left' }) {
  return (
    <div className="max-w-md">
      {data.eyebrow && <p className="eyebrow mb-3 md:mb-6">{data.eyebrow}</p>}
      {data.title && (
        <h2 className="serif-display text-[1.5rem] md:text-[clamp(2rem,4vw,3rem)] font-light leading-[1.15]">
          {data.title}
        </h2>
      )}
      <div className="mt-3 md:mt-5 space-y-3 md:space-y-4 text-[0.85rem] md:text-[0.98rem] leading-[1.65] md:leading-[1.7] text-ash font-light">
        {data.body && <p>{data.body}</p>}
        {(data.paragraphs ?? []).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {data.stats && data.stats.length > 0 && (
        <div className="mt-8 md:mt-10 grid grid-cols-3 gap-4 md:gap-6">
          {data.stats.map((s, i) => (
            <div key={i} className="border-t border-charcoal/15 pt-4 md:pt-5">
              <div className="serif-display text-[1.5rem] md:text-[2.2rem] font-light leading-none text-charcoal">
                {s.value}
              </div>
              <div className="mt-2 md:mt-3 text-[9px] md:text-[10px] tracking-[0.24em] md:tracking-[0.28em] uppercase text-ash font-light">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
