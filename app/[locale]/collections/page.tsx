import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getCollections } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'collectionsPage' });
  return { title: `${t('eyebrow')} — SIREN TEARS` };
}

const AOTEAROA_CATEGORIES = ['rings', 'necklaces', 'bracelets', 'bangles'] as const;
const AOTEAROA_CATEGORY_VALUE: Record<(typeof AOTEAROA_CATEGORIES)[number], string> = {
  rings: 'ring',
  necklaces: 'necklace',
  bracelets: 'bracelet',
  bangles: 'bangle'
};

export default async function CollectionsPage({
  params
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const [t, tShop, collections] = await Promise.all([
    getTranslations('collectionsPage'),
    getTranslations('shop'),
    getCollections()
  ]);
  const items = collections?.length ? collections : fallback.collections;

  return (
    <>
      <section className="relative bg-pearl text-charcoal px-6 md:px-12 pt-40 pb-16 md:pt-48 md:pb-20 overflow-hidden">
        <div className="relative mx-auto max-w-[820px] text-center reveal">
          <p className="eyebrow mb-6">{t('eyebrow')}</p>
          <h1 className="serif-display text-[clamp(2rem,4.4vw,3.4rem)] font-light leading-[1.18] text-charcoal">
            {t('title')}
          </h1>
        </div>
      </section>

      {/* Beaded Collections */}
      <section className="bg-ivory px-6 md:px-12 pt-4 pb-24 md:pb-32">
        <div className="mx-auto max-w-[1480px]">
          <div className="max-w-2xl mx-auto text-center mb-16 reveal">
            <p className="eyebrow mb-5">{t('beadedEyebrow')}</p>
            <p className="text-[0.98rem] leading-[1.9] text-ash font-light">{t('beadedIntro')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {items.map((c: any, i: number) => (
              <Link
                key={c._id ?? i}
                href="/shop"
                className="group reveal frame-zoom relative overflow-hidden bg-charcoal/5 aspect-[4/5]"
                style={{ transitionDelay: `${(i % 6) * 100}ms` }}
              >
                <div
                  className="bg-img absolute inset-0 bg-center bg-cover"
                  style={{ backgroundImage: `url(${c.coverUrl})` }}
                  role="img"
                  aria-label={c.coverAlt || c.title || ''}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="absolute inset-0 flex flex-col justify-end p-7 text-ivory">
                  <h2 className="serif-display text-[1.7rem] font-light leading-tight tracking-wide">
                    {c.title}
                  </h2>
                  {c.subtitle && (
                    <p className="mt-2 text-[0.85rem] text-ivory/85 font-light leading-[1.7] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-editorial">
                      {c.subtitle}
                    </p>
                  )}
                  <span className="mt-4 text-[10px] tracking-[0.3em] uppercase text-ivory/85 link-underline w-fit">
                    {t('shopLine')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Aotearoa — Gemstone Jewellery */}
      <section className="bg-pearl px-6 md:px-12 py-24 md:py-32">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-2xl mx-auto text-center mb-16 reveal">
            <p className="eyebrow mb-5">{t('aotearoaEyebrow')}</p>
            <h2 className="serif-display text-[clamp(1.8rem,3.6vw,2.6rem)] font-light leading-[1.15] mb-6 text-charcoal">
              {t('aotearoaTitle')}
            </h2>
            <p className="text-[0.98rem] leading-[1.9] text-ash font-light">{t('aotearoaIntro')}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {AOTEAROA_CATEGORIES.map((cat, i) => (
              <Link
                key={cat}
                href={`/shop?category=${AOTEAROA_CATEGORY_VALUE[cat]}`}
                className="reveal border border-charcoal/15 hover:border-gold/60 transition-colors bg-ivory text-center py-10 px-4"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <span className="text-[11px] tracking-[0.28em] uppercase text-charcoal font-light">
                  {tShop(`filters.${cat}`)}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-14 text-center reveal">
            <Link
              href="/shop"
              className="text-[11px] tracking-[0.32em] uppercase text-charcoal link-underline"
            >
              {t('shopLine')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
