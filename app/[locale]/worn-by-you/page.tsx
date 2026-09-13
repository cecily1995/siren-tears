import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getBuyerShowcase, getSiteSettings } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';
import PageHeader from '@/components/PageHeader';

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
        imageUrl="https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Soft natural light, everyday moments"
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
            <div className="columns-2 md:columns-3 lg:columns-4 gap-5 md:gap-6 [column-fill:_balance]">
              {items.map((p: any, i: number) => (
                <figure
                  key={p._id ?? i}
                  className="reveal mb-5 md:mb-6 break-inside-avoid overflow-hidden bg-charcoal/5 frame-zoom relative"
                  style={{ transitionDelay: `${(i % 8) * 90}ms` }}
                >
                  {p.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt={p.imageAlt || p.caption || 'Siren Tears, as worn'}
                      className="bg-img w-full h-auto block"
                      loading="lazy"
                    />
                  )}
                  {(p.caption || p.customerHandle) && (
                    <figcaption className="p-4 text-[0.85rem] text-ash font-light leading-relaxed">
                      {p.caption}
                      {p.caption && p.customerHandle && ' — '}
                      {p.customerHandle && (
                        <span className="text-gold">{p.customerHandle}</span>
                      )}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
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
