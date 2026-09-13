import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getBuyerShowcase, getSiteSettings } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';
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
  const items = photos ?? [];

  return (
    <>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        imageUrl="https://images.unsplash.com/photo-1767131636996-ae27286d36fb?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Calm ocean water meeting a quiet rocky coastline"
      >
        <p className="mt-7 max-w-xl mx-auto text-[0.98rem] leading-[1.95] text-ash font-light">
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
                @sirentears_1995
              </a>
            </>
          )}
        </p>
      </PageHeader>

      <section className="bg-ivory px-6 md:px-12 py-24 md:py-32">
        <div className="mx-auto max-w-[1480px]">
          {items.length > 0 ? (
            <ShowcaseGrid items={items} />
          ) : (
            <div className="max-w-lg mx-auto text-center py-16 reveal">
              <p className="serif-display text-[1.6rem] font-light mb-5 text-charcoal">
                {t('emptyTitle')}
              </p>
              <p className="text-[0.95rem] leading-[1.9] text-ash font-light">
                {t('emptyBody')}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
