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
    <section id="about" className="bg-pearl text-charcoal py-28 md:py-40 px-6 md:px-12">
      <div className="mx-auto max-w-[1280px] grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
        <div className="md:col-span-6 md:sticky md:top-28 reveal">
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
          <div className="mt-8 space-y-6 max-w-md text-[0.98rem] leading-[1.95] text-ash font-light">
            {data.body && <p>{data.body}</p>}
            {(data.paragraphs ?? []).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {data.stats && data.stats.length > 0 && (
            <div className="mt-14 grid grid-cols-3 gap-6 max-w-md">
              {data.stats.map((s, i) => (
                <div key={i} className="border-t border-charcoal/15 pt-5">
                  <div className="serif-display text-[2.2rem] font-light leading-none text-charcoal">
                    {s.value}
                  </div>
                  <div className="mt-3 text-[10px] tracking-[0.28em] uppercase text-ash font-light">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
