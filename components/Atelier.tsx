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
    <section id="about" className="bg-pearl text-charcoal h-full flex flex-col">
      {/* Full-bleed image at the very top — no padding above it. */}
      <div className="relative w-full h-[40vh] md:h-[56vh] shrink-0 overflow-hidden bg-charcoal/5">
        {data.imageUrl && (
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${data.imageUrl})` }}
            role="img"
            aria-label={data.imageAlt || ''}
          />
        )}
      </div>
      <div className="px-6 md:px-12 py-8 md:py-14">
        <div className="mx-auto max-w-[720px] text-center md:text-left reveal">
          {data.eyebrow && <p className="eyebrow mb-3 md:mb-6">{data.eyebrow}</p>}
          {data.title && (
            <h2 className="serif-display text-[1.5rem] md:text-[clamp(2rem,4vw,3rem)] font-light leading-[1.15]">
              {data.title}
            </h2>
          )}
          <div className="mt-3 md:mt-8 space-y-3 md:space-y-6 text-[0.82rem] md:text-[0.98rem] leading-[1.6] md:leading-[1.95] text-ash font-light">
            {data.body && <p>{data.body}</p>}
            {(data.paragraphs ?? []).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {data.stats && data.stats.length > 0 && (
            <div className="mt-8 md:mt-14 grid grid-cols-3 gap-4 md:gap-6 max-w-md mx-auto md:mx-0">
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
      </div>
    </section>
  );
}
