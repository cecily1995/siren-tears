import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getSiteSettings, getContactPageSettings } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'contactPage' });
  return { title: `${t('title')} — SIREN TEARS` };
}

function TilePlaceholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center border border-dashed border-charcoal/20">
      <span className="text-[10px] tracking-[0.2em] uppercase text-ash/60 font-light text-center px-4">{label}</span>
    </div>
  );
}

export default async function ContactPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);

  const [t, settings, media] = await Promise.all([
    getTranslations('contactPage'),
    getSiteSettings(),
    getContactPageSettings()
  ]);
  const data = settings ?? fallback.settings;

  const methods = [
    data.email && { label: t('email'), href: `mailto:${data.email}` },
    data.whatsappUrl && { label: t('whatsapp'), href: data.whatsappUrl },
    data.instagramUrl && { label: t('instagram'), href: data.instagramUrl },
    data.tiktokUrl && { label: t('tiktok'), href: data.tiktokUrl },
    data.xiaohongshuUrl && { label: t('xiaohongshu'), href: data.xiaohongshuUrl },
    data.douyinUrl && { label: t('douyin'), href: data.douyinUrl }
  ].filter(Boolean) as { label: string; href: string }[];

  const smallTiles = [
    { href: '/shipping', label: t('shippingLabel'), image: media?.shippingImageUrl },
    { href: '/care', label: t('careLabel'), image: media?.careImageUrl },
    { href: '/faq', label: t('faqLabel'), image: media?.faqImageUrl },
    { href: '/size-guide', label: t('sizeGuideLabel'), image: media?.sizeGuideImageUrl }
  ];

  return (
    <div className="bg-ivory">
      <div className="px-6 md:px-12 pt-[72px] md:pt-24 pb-5 md:pb-0 max-w-[820px] mx-auto text-left">
        <h1 className="serif-display text-[1.8rem] md:text-[2.2rem] font-light text-charcoal mb-2">
          {t('eyebrow')}
        </h1>
        <p className="text-[1rem] md:text-[1.1rem] font-light text-charcoal/80 mb-2">{t('title')}</p>
        <p className="text-[0.85rem] leading-[1.65] text-ash font-light max-w-lg">{t('intro')}</p>

        {methods.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-x-3 gap-y-2 max-w-lg">
            {methods.map((m) => (
              <a
                key={m.label}
                href={m.href}
                target={m.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={m.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="text-[0.7rem] tracking-[0.12em] uppercase text-charcoal/75 hover:text-charcoal transition-colors"
              >
                {m.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 md:px-0 pb-3 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {smallTiles.map((tile) => (
            <Link key={tile.href} href={tile.href} className="group relative block aspect-[3/4] overflow-hidden bg-charcoal/5">
              {tile.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tile.image}
                  alt={tile.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <TilePlaceholder label={`${tile.label} — photo`} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-charcoal/5 to-transparent" />
              <span
                className="absolute bottom-3 left-3 text-[10px] tracking-[0.2em] uppercase text-ivory font-light"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
              >
                {tile.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-0 pb-12 md:pb-16 w-full">
        <Link href="/returns-repairs" className="group relative block aspect-[16/9] overflow-hidden bg-charcoal/5">
          {media?.returnsImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.returnsImageUrl}
              alt={t('returnsLabel')}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <TilePlaceholder label={`${t('returnsLabel')} — photo`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-charcoal/5 to-transparent" />
          <span
            className="absolute bottom-3 left-3 text-[10px] tracking-[0.2em] uppercase text-ivory font-light"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
          >
            {t('returnsLabel')}
          </span>
        </Link>
      </div>
    </div>
  );
}
