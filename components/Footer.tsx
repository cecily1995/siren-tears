type FooterData = {
  brandName?: string;
  tagline?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  whatsappUrl?: string;
  xiaohongshuUrl?: string;
  douyinUrl?: string;
  wechatHandle?: string;
  email?: string;
};

type Labels = {
  contact: string;
  enquire: string;
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
  assistance: string;
  returnsRepairs: string;
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
  sizeGuide: string;
  privacy: string;
  terms: string;
  aboutLabel: string;
  foundersLabel: string;
  ourCommitmentLabel: string;
  account: string;
  joinListHeading: string;
  joinListBody: string;
  joinListPlaceholder: string;
  joinListSuccess: string;
};

import { Link } from '@/i18n/routing';
import FooterAccordionSection from './FooterAccordionSection';
import CurrencySelector from './CurrencySelector';
import NewsletterSignup from './NewsletterSignup';

export default function Footer({ data, labels }: { data: FooterData; labels: Labels }) {
  return (
    <footer
      id="contact"
      className="bg-pearl text-charcoal px-6 md:px-12 pt-16 md:pt-16 pb-10 md:pb-12 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.1] pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 20%, rgba(245, 215, 165, 0.55) 0%, rgba(245, 215, 165, 0) 70%)'
        }}
      />
      <div className="relative mx-auto max-w-[1480px]">
        <div className="reveal mb-8 md:mb-0">
          <p className="eyebrow text-gold/80 mb-4">{labels.contact}</p>
          <h2 className="serif-display text-[clamp(1.4rem,2.4vw,1.9rem)] font-light leading-[1.1] tracking-wide">
            {data.brandName ?? 'SIREN TEARS'}
          </h2>
          <p className="mt-4 max-w-md text-[0.95rem] leading-[1.75] text-charcoal/70 font-light">
            {data.tagline || labels.tagline}
          </p>
          <div className="mt-6">
            <NewsletterSignup
              heading={labels.joinListHeading}
              body={labels.joinListBody}
              placeholder={labels.joinListPlaceholder}
              successMessage={labels.joinListSuccess}
            />
          </div>
        </div>

        {/* Desktop: full column grid, unchanged */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 md:mt-14">
          <div className="reveal" style={{ transitionDelay: '60ms' }}>
            <p className="eyebrow text-charcoal/50 mb-6">{labels.shopHeader}</p>
            <ul className="space-y-3 text-[0.95rem] font-light">
              <li>
                <Link href="/shop" className="link-underline text-charcoal/85 hover:text-charcoal">
                  {labels.shop}
                </Link>
              </li>
              <li>
                <Link href="/collections" className="link-underline text-charcoal/85 hover:text-charcoal">
                  {labels.collections}
                </Link>
              </li>
              <li>
                <Link href="/membership" className="link-underline text-charcoal/85 hover:text-charcoal">
                  {labels.membership}
                </Link>
              </li>
              <li>
                <Link href="/bespoke" className="link-underline text-charcoal/85 hover:text-charcoal">
                  {labels.bespoke}
                </Link>
              </li>
            </ul>
          </div>

          <div className="reveal" style={{ transitionDelay: '110ms' }}>
            <p className="eyebrow text-charcoal/50 mb-6">{labels.assistance}</p>
            <ul className="space-y-3 text-[0.95rem] font-light">
              <li>
                <Link href="/shipping" className="link-underline text-charcoal/85 hover:text-charcoal">
                  {labels.shipping}
                </Link>
              </li>
              <li>
                <Link href="/care" className="link-underline text-charcoal/85 hover:text-charcoal">
                  {labels.care}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="link-underline text-charcoal/85 hover:text-charcoal">
                  {labels.faq}
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="link-underline text-charcoal/85 hover:text-charcoal">
                  {labels.sizeGuide}
                </Link>
              </li>
              <li>
                <Link href="/returns-repairs" className="link-underline text-charcoal/85 hover:text-charcoal">
                  {labels.returnsRepairs}
                </Link>
              </li>
            </ul>
          </div>

          <div className="reveal" style={{ transitionDelay: '160ms' }}>
            <p className="eyebrow text-charcoal/50 mb-6">{labels.support}</p>
            <ul className="space-y-3 text-[0.95rem] font-light">
              <li>
                <Link href="/brand-story" className="link-underline text-charcoal/85 hover:text-charcoal">
                  {labels.aboutLabel}
                </Link>
              </li>
              <li>
                <Link href="/founders" className="link-underline text-charcoal/85 hover:text-charcoal">
                  {labels.foundersLabel}
                </Link>
              </li>
              <li>
                <Link href="/responsible-craftsmanship" className="link-underline text-charcoal/85 hover:text-charcoal">
                  {labels.ourCommitmentLabel}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="link-underline text-charcoal/85 hover:text-charcoal">
                  {labels.enquire}
                </Link>
              </li>
            </ul>
          </div>

          <div className="reveal" style={{ transitionDelay: '210ms' }}>
            <p className="eyebrow text-charcoal/50 mb-6">{labels.studio}</p>
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="block text-[0.95rem] font-light text-charcoal link-underline mb-3 break-all"
              >
                {data.email}
              </a>
            )}
            <p className="text-[0.85rem] text-charcoal/60 font-light leading-relaxed mb-6">
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
                    className="link-underline text-charcoal/80 hover:text-charcoal"
                  >
                    Instagram
                  </a>
                </li>
              )}
              {data.tiktokUrl && (
                <li>
                  <a
                    href={data.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-charcoal/80 hover:text-charcoal"
                  >
                    TikTok
                  </a>
                </li>
              )}
              {data.whatsappUrl && (
                <li>
                  <a
                    href={data.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-charcoal/80 hover:text-charcoal"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {data.xiaohongshuUrl && (
                <li>
                  <a
                    href={data.xiaohongshuUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-charcoal/80 hover:text-charcoal"
                  >
                    RedNote
                  </a>
                </li>
              )}
              {data.douyinUrl && (
                <li>
                  <a
                    href={data.douyinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-charcoal/80 hover:text-charcoal"
                  >
                    Douyin
                  </a>
                </li>
              )}
              {data.wechatHandle && (
                <li className="text-charcoal/65">
                  <span className="text-charcoal/45">{labels.wechat}&nbsp;·&nbsp;</span>
                  {data.wechatHandle}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Mobile: collapsible accordion sections */}
        <div className="md:hidden border-t border-charcoal/15">
          <FooterAccordionSection title={labels.shopHeader}>
            <ul className="space-y-3 text-[0.95rem] font-light">
              <li>
                <Link href="/shop" className="link-underline text-charcoal/85">
                  {labels.shop}
                </Link>
              </li>
              <li>
                <Link href="/collections" className="link-underline text-charcoal/85">
                  {labels.collections}
                </Link>
              </li>
              <li>
                <Link href="/membership" className="link-underline text-charcoal/85">
                  {labels.membership}
                </Link>
              </li>
              <li>
                <Link href="/bespoke" className="link-underline text-charcoal/85">
                  {labels.bespoke}
                </Link>
              </li>
            </ul>
          </FooterAccordionSection>

          <FooterAccordionSection title={labels.assistance}>
            <ul className="space-y-3 text-[0.95rem] font-light">
              <li>
                <Link href="/shipping" className="link-underline text-charcoal/85">
                  {labels.shipping}
                </Link>
              </li>
              <li>
                <Link href="/care" className="link-underline text-charcoal/85">
                  {labels.care}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="link-underline text-charcoal/85">
                  {labels.faq}
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="link-underline text-charcoal/85">
                  {labels.sizeGuide}
                </Link>
              </li>
              <li>
                <Link href="/returns-repairs" className="link-underline text-charcoal/85">
                  {labels.returnsRepairs}
                </Link>
              </li>
            </ul>
          </FooterAccordionSection>

          <FooterAccordionSection title={labels.support}>
            <ul className="space-y-3 text-[0.95rem] font-light">
              <li>
                <Link href="/brand-story" className="link-underline text-charcoal/85">
                  {labels.aboutLabel}
                </Link>
              </li>
              <li>
                <Link href="/founders" className="link-underline text-charcoal/85">
                  {labels.foundersLabel}
                </Link>
              </li>
              <li>
                <Link href="/responsible-craftsmanship" className="link-underline text-charcoal/85">
                  {labels.ourCommitmentLabel}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="link-underline text-charcoal/85">
                  {labels.enquire}
                </Link>
              </li>
            </ul>
          </FooterAccordionSection>

          <FooterAccordionSection title={labels.studio}>
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="block text-[0.9rem] font-light text-charcoal link-underline mb-3 break-all"
              >
                {data.email}
              </a>
            )}
            <p className="text-[0.85rem] text-charcoal/60 font-light leading-relaxed mb-5">
              {labels.byAppointment}
              <br />
              {labels.region}
            </p>
            <ul className="space-y-2.5 text-[0.85rem] font-light">
              {data.instagramUrl && (
                <li>
                  <a href={data.instagramUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-charcoal/80">
                    Instagram
                  </a>
                </li>
              )}
              {data.tiktokUrl && (
                <li>
                  <a href={data.tiktokUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-charcoal/80">
                    TikTok
                  </a>
                </li>
              )}
              {data.whatsappUrl && (
                <li>
                  <a href={data.whatsappUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-charcoal/80">
                    WhatsApp
                  </a>
                </li>
              )}
              {data.xiaohongshuUrl && (
                <li>
                  <a href={data.xiaohongshuUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-charcoal/80">
                    RedNote
                  </a>
                </li>
              )}
              {data.douyinUrl && (
                <li>
                  <a href={data.douyinUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-charcoal/80">
                    Douyin
                  </a>
                </li>
              )}
              {data.wechatHandle && (
                <li className="text-charcoal/65">
                  <span className="text-charcoal/45">{labels.wechat}&nbsp;·&nbsp;</span>
                  {data.wechatHandle}
                </li>
              )}
            </ul>
          </FooterAccordionSection>
        </div>

        <div className="mt-10 md:mt-20 pt-6 md:pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 text-[9px] md:text-[10px] tracking-[0.25em] md:tracking-[0.3em] uppercase text-charcoal/45 font-light">
          <span>{labels.copyright}</span>
          <div className="flex items-center gap-5 md:gap-6">
            <Link href="/privacy" className="hover:text-charcoal/70 transition-colors">
              {labels.privacy}
            </Link>
            <Link href="/terms" className="hover:text-charcoal/70 transition-colors">
              {labels.terms}
            </Link>
            <span className="hidden md:inline">{labels.crafted}</span>
            <CurrencySelector />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo/siren-tears-mermaid-mark.png"
              alt="Siren Tears"
              className="h-4 md:h-5 w-auto object-contain opacity-70"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
