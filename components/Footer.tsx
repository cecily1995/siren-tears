type FooterData = {
  brandName?: string;
  tagline?: string;
  instagramUrl?: string;
  xiaohongshuUrl?: string;
  wechatHandle?: string;
  email?: string;
};

type Labels = {
  contact: string;
  studio: string;
  elsewhere: string;
  byAppointment: string;
  region: string;
  wechat: string;
  tagline: string;
  copyright: string;
  crafted: string;
};

export default function Footer({ data, labels }: { data: FooterData; labels: Labels }) {
  return (
    <footer
      id="contact"
      className="bg-charcoal text-ivory px-6 md:px-12 pt-28 pb-12 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 20%, rgba(245, 215, 165, 0.55) 0%, rgba(245, 215, 165, 0) 70%)'
        }}
      />
      <div className="relative mx-auto max-w-[1380px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-14 md:gap-10">
          <div className="md:col-span-6 reveal">
            <p className="eyebrow text-gold/80 mb-6">{labels.contact}</p>
            <h2 className="serif-display text-[clamp(2.4rem,4.8vw,4rem)] font-light leading-[1.05] tracking-wide">
              {data.brandName ?? 'SIREN TEARS'}
            </h2>
            <p className="mt-7 max-w-md text-[0.95rem] leading-[1.95] text-ivory/70 font-light">
              {data.tagline || labels.tagline}
            </p>
          </div>

          <div className="md:col-span-3 reveal" style={{ transitionDelay: '120ms' }}>
            <p className="eyebrow text-ivory/50 mb-6">{labels.studio}</p>
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="block text-[1rem] font-light text-ivory link-underline mb-3"
              >
                {data.email}
              </a>
            )}
            <p className="text-[0.9rem] text-ivory/60 font-light leading-relaxed">
              {labels.byAppointment}
              <br />
              {labels.region}
            </p>
          </div>

          <div className="md:col-span-3 reveal" style={{ transitionDelay: '200ms' }}>
            <p className="eyebrow text-ivory/50 mb-6">{labels.elsewhere}</p>
            <ul className="space-y-3 text-[0.95rem] font-light">
              {data.instagramUrl && (
                <li>
                  <a
                    href={data.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-ivory/85 hover:text-ivory"
                  >
                    Instagram
                  </a>
                </li>
              )}
              {data.xiaohongshuUrl && (
                <li>
                  <a
                    href={data.xiaohongshuUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-ivory/85 hover:text-ivory"
                  >
                    Xiaohongshu
                  </a>
                </li>
              )}
              {data.wechatHandle && (
                <li className="text-ivory/70">
                  <span className="text-ivory/50">{labels.wechat}&nbsp;·&nbsp;</span>
                  {data.wechatHandle}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-ivory/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[10px] tracking-[0.32em] uppercase text-ivory/45 font-light">
          <span>{labels.copyright}</span>
          <span>{labels.crafted}</span>
        </div>
      </div>
    </footer>
  );
}
