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
  explore: string;
  shopHeader: string;
  support: string;
  shipping: string;
  bespoke: string;
  gallery: string;
  membership: string;
  shop: string;
  collections: string;
  journal: string;
  care: string;
  faq: string;
  privacy: string;
  terms: string;
  aboutLabel: string;
  account: string;
};

import { Link } from '@/i18n/routing';

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
      <div className="relative mx-auto max-w-[1480px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-14 md:gap-8">
          <div className="md:col-span-4 reveal">
            <p className="eyebrow text-gold/80 mb-6">{labels.contact}</p>
            <h2 className="serif-display text-[clamp(2.2rem,4.4vw,3.6rem)] font-light leading-[1.05] tracking-wide">
              {data.brandName ?? 'SIREN TEARS'}
            </h2>
            <p className="mt-7 max-w-md text-[0.95rem] leading-[1.95] text-ivory/70 font-light">
              {data.tagline || labels.tagline}
            </p>
          </div>

          <div className="md:col-span-2 reveal" style={{ transitionDelay: '60ms' }}>
            <p className="eyebrow text-ivory/50 mb-6">{labels.shopHeader}</p>
            <ul className="space-y-3 text-[0.95rem] font-light">
              <li>
                <Link href="/shop" className="link-underline text-ivory/85 hover:text-ivory">
                  {labels.shop}
                </Link>
              </li>
              <li>
                <Link href="/collections" className="link-underline text-ivory/85 hover:text-ivory">
                  {labels.collections}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 reveal" style={{ transitionDelay: '110ms' }}>
            <p className="eyebrow text-ivory/50 mb-6">{labels.explore}</p>
            <ul className="space-y-3 text-[0.95rem] font-light">
              <li>
                <Link href="/#journal" className="link-underline text-ivory/85 hover:text-ivory">
                  {labels.journal}
                </Link>
              </li>
              <li>
                <Link href="/worn-by-you" className="link-underline text-ivory/85 hover:text-ivory">
                  {labels.gallery}
                </Link>
              </li>
              <li>
                <Link href="/account" className="link-underline text-ivory/85 hover:text-ivory">
                  {labels.account}
                </Link>
              </li>
              <li>
                <Link href="/bespoke" className="link-underline text-ivory/85 hover:text-ivory">
                  {labels.bespoke}
                </Link>
              </li>
              <li>
                <Link href="/membership" className="link-underline text-ivory/85 hover:text-ivory">
                  {labels.membership}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 reveal" style={{ transitionDelay: '160ms' }}>
            <p className="eyebrow text-ivory/50 mb-6">{labels.support}</p>
            <ul className="space-y-3 text-[0.95rem] font-light">
              <li>
                <Link href="/#about" className="link-underline text-ivory/85 hover:text-ivory">
                  {labels.aboutLabel}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="link-underline text-ivory/85 hover:text-ivory">
                  {labels.shipping}
                </Link>
              </li>
              <li>
                <Link href="/care" className="link-underline text-ivory/85 hover:text-ivory">
                  {labels.care}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="link-underline text-ivory/85 hover:text-ivory">
                  {labels.faq}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 reveal" style={{ transitionDelay: '210ms' }}>
            <p className="eyebrow text-ivory/50 mb-6">{labels.studio}</p>
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="block text-[0.95rem] font-light text-ivory link-underline mb-3 break-all"
              >
                {data.email}
              </a>
            )}
            <p className="text-[0.85rem] text-ivory/60 font-light leading-relaxed mb-6">
              {labels.byAppointment}
              <br />
              {labels.region}
            </p>
            <ul className="space-y-2.5 text-[0.85rem] font-light">
              {data.instagramUrl && (
                <li>
                  <a
                    href={data.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-ivory/80 hover:text-ivory"
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
                    className="link-underline text-ivory/80 hover:text-ivory"
                  >
                    Xiaohongshu
                  </a>
                </li>
              )}
              {data.wechatHandle && (
                <li className="text-ivory/65">
                  <span className="text-ivory/45">{labels.wechat}&nbsp;·&nbsp;</span>
                  {data.wechatHandle}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-ivory/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[10px] tracking-[0.3em] uppercase text-ivory/45 font-light">
          <span>{labels.copyright}</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-ivory/70 transition-colors">
              {labels.privacy}
            </Link>
            <Link href="/terms" className="hover:text-ivory/70 transition-colors">
              {labels.terms}
            </Link>
            <span>{labels.crafted}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
