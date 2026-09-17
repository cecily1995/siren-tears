import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getFoundersPageSettings } from '@/sanity/lib/queries';
import SwipeGallery from '@/components/SwipeGallery';
import SquareImageStrip from '@/components/SquareImageStrip';
import FoundersVideo from '@/components/FoundersVideo';

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'foundersPage' });
  return { title: `${t('pageTitle')} — SIREN TEARS` };
}

// Consistent gap between every section on this page, per the brief --
// deliberately the same value everywhere rather than varying per-section.
const SECTION_GAP = 'py-8 md:py-10';

export default async function FoundersPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);

  const [t, media] = await Promise.all([getTranslations('foundersPage'), getFoundersPageSettings()]);

  return (
    <div className="bg-ivory">
      <div className="px-6 md:px-12 pt-10 md:pt-14 max-w-[900px] mx-auto">
        <h1 className="serif-display text-[clamp(1.4rem,3vw,2rem)] font-light leading-[1.2] text-charcoal uppercase tracking-[0.02em] text-left">
          {t('pageTitle')}
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-[0.98rem] leading-[1.9] text-ash font-light text-center">
          {t('heroIntro')}
        </p>
      </div>

      <div className={`px-6 md:px-12 max-w-[420px] md:max-w-[640px] mx-auto ${SECTION_GAP}`}>
        <SwipeGallery
          images={[{ url: media?.introImageUrl, placeholderLabel: 'Founder photo — 3:4' }]}
          aspectClassName="aspect-[3/4]"
        />
      </div>

      <div className={`px-6 md:px-12 ${SECTION_GAP}`}>
        <FoundersVideo videoUrl={media?.videoUrl} quote={t('quote')} signature={t('quoteSignature')} />
      </div>

      {/* Our Founders: mobile stacks text above the group photo; desktop
          runs them side by side (text left, photo right). */}
      <div className={`px-6 md:px-12 max-w-[1000px] mx-auto ${SECTION_GAP}`}>
        <div className="md:hidden">
          <p className="eyebrow mb-5 text-left">{t('foundersHeading')}</p>
          <div className="space-y-6 text-left">
            <p className="text-[0.95rem] leading-[1.9] text-ash font-light">{t('para1')}</p>
            <p className="text-[0.95rem] leading-[1.9] text-ash font-light">{t('para2')}</p>
            <p className="text-[0.95rem] leading-[1.9] text-ash font-light">{t('para3')}</p>
          </div>
          <div className="mt-8 max-w-[420px] md:max-w-[640px] mx-auto">
            <SwipeGallery
              images={[{ url: media?.groupPhotoUrl, placeholderLabel: 'Founders group photo — 3:4' }]}
              aspectClassName="aspect-[3/4]"
            />
          </div>
        </div>

        <div className="hidden md:flex gap-16 items-center">
          <div className="flex-1">
            <p className="eyebrow mb-5 text-left">{t('foundersHeading')}</p>
            <div className="space-y-6 text-left">
              <p className="text-[0.98rem] leading-[1.9] text-ash font-light">{t('para1')}</p>
              <p className="text-[0.98rem] leading-[1.9] text-ash font-light">{t('para2')}</p>
              <p className="text-[0.98rem] leading-[1.9] text-ash font-light">{t('para3')}</p>
            </div>
          </div>
          <div className="flex-1">
            <SwipeGallery
              images={[{ url: media?.groupPhotoUrl, placeholderLabel: 'Founders group photo — 3:4' }]}
              aspectClassName="aspect-[3/4]"
            />
          </div>
        </div>
      </div>

      <div className={`px-6 md:px-12 max-w-[1000px] mx-auto ${SECTION_GAP}`}>
        <SquareImageStrip
          images={
            media?.squareImageUrls?.length
              ? media.squareImageUrls.map((url: string) => ({ url }))
              : [
                  { placeholderLabel: 'Square 1' },
                  { placeholderLabel: 'Square 2' },
                  { placeholderLabel: 'Square 3' }
                ]
          }
        />
      </div>

      {/* Full-bleed, edge to edge -- no page padding here on purpose.
          Mobile portrait, desktop landscape. */}
      <div className={SECTION_GAP}>
        <Link href="/responsible-craftsmanship" className="group relative block aspect-[4/5] md:aspect-[16/9] overflow-hidden bg-charcoal/5">
          {media?.finalBannerImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.finalBannerImageUrl}
              alt="Crafted with intention"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center border border-dashed border-charcoal/20">
              <span className="text-[10px] tracking-[0.2em] uppercase text-ash/60 font-light">
                Final banner photo — mobile 4:5 / desktop 16:9
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-charcoal/5 to-transparent" />
          <div
            className="absolute top-0 left-0 p-6 md:p-10 max-w-[360px] text-ivory"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.55)' }}
          >
            <p className="text-[12px] tracking-[0.26em] uppercase font-light mb-3">{t('finalBannerEyebrow')}</p>
            <p className="text-[0.9rem] leading-[1.6] font-light mb-5">{t('finalBannerTagline')}</p>
            <span className="text-[11px] tracking-[0.24em] uppercase link-underline">{t('finalBannerCta')}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
