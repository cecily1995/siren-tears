type JournalItem = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  category?: string;
  excerpt?: string;
  coverUrl?: string;
  publishedAt?: string;
};

type Labels = {
  eyebrow: string;
  title: string;
  intro: string;
  readLink: string;
};

const formatDate = (d?: string) => {
  if (!d) return '';
  try {
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'long'
    }).format(new Date(d));
  } catch {
    return '';
  }
};

export default function Journal({
  items,
  labels
}: {
  items: JournalItem[];
  labels: Labels;
}) {
  return (
    <section id="journal" className="bg-pearl py-32 md:py-44 px-6 md:px-12">
      <div className="mx-auto max-w-[1380px]">
        {labels.title && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20 reveal">
            <div className="max-w-xl">
              <p className="eyebrow mb-5">{labels.eyebrow}</p>
              <h2 className="serif-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-light leading-[1.1]">
                {labels.title}
              </h2>
            </div>
            <p className="md:max-w-sm text-[0.95rem] leading-[1.9] text-ash font-light">
              {labels.intro}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-20 gap-x-12 md:gap-x-20">
          {items.map((a, i) => (
            <a
              key={a._id ?? i}
              href={a.slug?.current ? `#journal` : '#'}
              className="group reveal block"
              style={{ transitionDelay: `${i * 140}ms` }}
            >
              <div className="relative overflow-hidden aspect-[4/5] frame-zoom bg-charcoal/5">
                <div
                  className="bg-img absolute inset-0 bg-center bg-cover"
                  style={{ backgroundImage: `url(${a.coverUrl})` }}
                  role="img"
                  aria-label={a.title || ''}
                />
              </div>
              <div className="pt-8 max-w-lg">
                <p className="eyebrow mb-4 flex items-center gap-4 text-gold">
                  <span>{a.category}</span>
                  {a.publishedAt && (
                    <>
                      <span className="divider-line text-gold" />
                      <span>{formatDate(a.publishedAt)}</span>
                    </>
                  )}
                </p>
                <h3 className="serif-display text-[1.7rem] md:text-[2rem] font-light leading-[1.2] text-charcoal group-hover:text-gold transition-colors duration-700">
                  {a.title}
                </h3>
                {a.excerpt && (
                  <p className="mt-5 text-[0.95rem] leading-[1.9] text-ash font-light">
                    {a.excerpt}
                  </p>
                )}
                <span className="mt-6 inline-block text-[11px] tracking-[0.36em] uppercase text-charcoal/70 link-underline">
                  {labels.readLink}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
