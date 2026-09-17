import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getCollections } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';
import PageHeader from '@/components/PageHeader';
import CollectionsCoverflow from '@/components/CollectionsCoverflow';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'collectionsPage' });
  return { title: `${t('eyebrow')} — SIREN TEARS` };
}

export default async function CollectionsPage({
  params
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const [t, collections] = await Promise.all([getTranslations('collectionsPage'), getCollections()]);
  const items = collections?.length ? collections : fallback.collections;

  return (
    <>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        imageUrl="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Crystal jewellery resting on warm linen"
      />

      {/* Beaded Collections -- dense 3D coverflow, each cover locked to its
          own collection (line=beaded + that exact collection name) so
          browsing from here never mixes in other collections' pieces. */}
      <section className="bg-ivory px-6 md:px-12 pt-2 pb-14 md:pb-20">
        <div className="mx-auto max-w-[1480px]">
          <div className="max-w-2xl mb-8 md:mb-10 reveal">
            <p className="eyebrow mb-3">{t('beadedEyebrow')}</p>
            <p className="text-[0.95rem] leading-[1.8] text-ash font-light">{t('beadedIntro')}</p>
          </div>

          <CollectionsCoverflow
            items={items.map((c: any, i: number) => ({
              key: c._id ?? String(i),
              href: `/shop?line=beaded&collection=${encodeURIComponent(c.title ?? '')}`,
              imageUrl: c.coverUrl,
              imageAlt: c.coverAlt || c.title || '',
              title: c.title
            }))}
          />
        </div>
      </section>

      {/* Aotearoa -- Gemstone Jewellery: one tall banner, not a category
          grid. Locked to line=aotearoa so the Shop page's own category
          filter (used once you land there) only ever narrows within this
          line, never pulling in Beaded pieces. */}
      <section className="bg-pearl px-6 md:px-12 pt-8 pb-14 md:pt-10 md:pb-20">
        <div className="mx-auto max-w-[1480px]">
          <div className="max-w-2xl mb-8 md:mb-10 reveal">
            <p className="eyebrow mb-3">{t('aotearoaEyebrow')}</p>
            <h2 className="serif-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-light leading-[1.2] mb-4 text-charcoal">
              {t('aotearoaTitle')}
            </h2>
            <p className="text-[0.95rem] leading-[1.8] text-ash font-light">{t('aotearoaIntro')}</p>
          </div>

          <Link
            href="/shop?line=aotearoa"
            className="group reveal relative block mx-auto max-w-[420px] aspect-[9/16] overflow-hidden bg-charcoal/5 frame-zoom"
          >
            <img
              src="/images/aotearoa-banner.jpg"
              alt="Aotearoa gemstone jewellery"
              className="bg-img absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-left">
              <span className="text-[11px] tracking-[0.28em] uppercase text-ivory font-light link-underline">
                {t('shopLine')}
              </span>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
