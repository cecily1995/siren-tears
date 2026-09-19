import type { Metadata } from 'next';
import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getBuyerShowcase, getSiteSettings } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';
import { translateText } from '@/lib/translate';
import PageHeader from '@/components/PageHeader';
import ShowcaseGrid from '@/components/ShowcaseGrid';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'gallery' });
  return { title: `${t('eyebrow')} — SIREN TEARS` };
}

export default async function GalleryPage({
  params
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const [t, photos, settings] = await Promise.all([
    getTranslations('gallery'),
    getBuyerShowcase(),
    getSiteSettings()
  ]);
  const instagramUrl = settings?.instagramUrl ?? fallback.settings.instagramUrl;
  const rawItems = photos ?? [];
  const items = await Promise.all(
    rawItems.map(async (item: any) => ({ ...item, caption: await translateText(item.caption, locale) }))
  );

  return (
    <>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        titleClassName="serif-display text-[1.15rem] md:text-[clamp(2.2rem,4.8vw,3.8rem)] font-light leading-[1.12] text-charcoal"
        imageUrl="https://images.unsplash.com/photo-1767131636996-ae27286d36fb?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Calm ocean water meeting a quiet rocky coastline"
      >
        <p className="mt-4 max-w-xl text-[0.98rem] leading-[1.7] text-ash font-light">
          {t('intro')}
          {instagramUrl && (
            <>
              {' '}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-charcoal link-underline"
              >
                @sirentears.jewellry
              </a>
            </>
          )}
        </p>
      </PageHeader>

      <section className="bg-ivory px-6 md:px-12 py-14 md:py-20">
        <div className="mx-auto max-w-[1480px]">
          {items.length > 0 ? (
            <Suspense fallback={null}>
              <ShowcaseGrid items={items} />
            </Suspense>
          ) : (
            <div className="max-w-lg mx-auto text-center py-16 reveal">
              <p className="serif-display text-[1.6rem] font-light mb-5 text-charcoal">
                {t('emptyTitle')}
              </p>
              <p className="text-[0.95rem] leading-[1.75] text-ash font-light">
                {t('emptyBody')}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
