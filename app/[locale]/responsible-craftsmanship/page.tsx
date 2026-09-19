import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getResponsibleCraftsmanshipSettings } from '@/sanity/lib/queries';
import SquareImageStrip from '@/components/SquareImageStrip';
import TextOverlayCarousel from '@/components/TextOverlayCarousel';

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'responsibleCraftsmanshipPage' });
  return { title: `${t('pageTitle')} — SIREN TEARS` };
}

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center border border-dashed border-charcoal/20">
      <span className="text-[10px] tracking-[0.2em] uppercase text-ash/60 font-light text-center px-4">{label}</span>
    </div>
  );
}

export default async function ResponsibleCraftsmanshipPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);

  const [t, media] = await Promise.all([
    getTranslations('responsibleCraftsmanshipPage'),
    getResponsibleCraftsmanshipSettings()
  ]);

  const sections = t.raw('sections') as { key: string; title: string; tagline: string; body: string }[];
  const [craftedWithIntention, naturalMaterials, madeByHand, madeToOrder, oneOfOne, responsibleByDesign, signaturePackaging] =
    sections;

  return (
    <div className="bg-ivory">
      <div className="px-6 md:px-12 pt-[72px] md:pt-24 pb-3 md:pb-4">
        <h1 className="serif-display text-[clamp(1.5rem,3.2vw,2.1rem)] font-light leading-[1.2] text-charcoal uppercase tracking-[0.02em] text-left">
          {t('pageTitle')}
        </h1>
      </div>

      {/* Crafted With Intention -- tiny, left-aligned, sharing the same
          horizontal inset as Image A below it. Wrapped in the same
          max-w-[1100px] centered column every section on this page uses,
          so it lines up with everything else rather than hugging the raw
          page edge on wide screens. */}
      <div className="px-6 md:px-12 max-w-[1100px] mx-auto reveal">
        <div className="max-w-[380px] text-left">
          <p className="eyebrow mb-1.5 text-[9px]">{craftedWithIntention.title}</p>
          <p className="text-[0.72rem] font-light text-charcoal mb-1">{craftedWithIntention.tagline}</p>
          <p className="text-[0.68rem] leading-[1.6] text-ash font-light">{craftedWithIntention.body}</p>
        </div>
      </div>

      {/* Image A: generous side margins -- visually the smallest photo on
          the page. Left-aligned within the same 1100px column as the text
          above it on mobile; desktop only: bigger and centered. */}
      <div className="px-6 md:px-12 max-w-[1100px] mx-auto mt-6 mb-10 md:mb-14">
        <div className="relative aspect-[3/4] max-w-[380px] md:max-w-[520px] md:mx-auto overflow-hidden bg-charcoal/5">
          {media?.craftedWithIntentionImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.craftedWithIntentionImageUrl}
              alt={craftedWithIntention.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <ImagePlaceholder label={`${craftedWithIntention.title} — photo`} />
          )}
        </div>
      </div>

      {/* Image B: same 3:4 ratio, much narrower side margins -- reads as
          noticeably larger. Multiple photos cross-fade + are swipeable;
          "Natural Materials" is overlaid text, fixed regardless of which
          photo is showing. */}
      <div className="px-3 md:px-8 mb-14 md:mb-20">
        {media?.naturalMaterialsImageUrls?.length ? (
          <TextOverlayCarousel
            images={media.naturalMaterialsImageUrls}
            className="aspect-[3/4] max-w-[1100px] md:max-w-[650px] mx-auto overflow-hidden bg-charcoal"
          >
            <div className="absolute inset-0 bg-charcoal/25 pointer-events-none" />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 text-ivory pointer-events-none"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
            >
              <p className="text-[11px] tracking-[0.28em] uppercase font-light mb-4" style={{ color: '#e9dcc2' }}>
                {naturalMaterials.title}
              </p>
              <p className="serif-display text-[1.2rem] md:text-[1.5rem] font-light leading-[1.4] mb-4 max-w-lg">
                {naturalMaterials.tagline}
              </p>
              <p className="text-[0.85rem] leading-[1.7] font-light max-w-md">{naturalMaterials.body}</p>
            </div>
          </TextOverlayCarousel>
        ) : (
          <div className="relative aspect-[3/4] max-w-[1100px] md:max-w-[650px] mx-auto overflow-hidden bg-charcoal">
            <ImagePlaceholder label={`${naturalMaterials.title} — photo`} />
            <div className="absolute inset-0 bg-charcoal/25" />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 text-ivory"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
            >
              <p className="text-[11px] tracking-[0.28em] uppercase font-light mb-4" style={{ color: '#e9dcc2' }}>
                {naturalMaterials.title}
              </p>
              <p className="serif-display text-[1.2rem] md:text-[1.5rem] font-light leading-[1.4] mb-4 max-w-lg">
                {naturalMaterials.tagline}
              </p>
              <p className="text-[0.85rem] leading-[1.7] font-light max-w-md">{naturalMaterials.body}</p>
            </div>
          </div>
        )}
      </div>

      {/* Made By Hand + Made To Order: two plain text blocks, stacked,
          nothing else between them. Same shared 1100px column as the rest
          of the page. */}
      <div className="px-6 md:px-12 max-w-[1100px] mx-auto reveal mb-10 md:mb-14">
        <div className="max-w-[560px] text-left">
          <p className="eyebrow mb-2">{madeByHand.title}</p>
          <p className="text-[0.95rem] font-light text-charcoal mb-2">{madeByHand.tagline}</p>
          <p className="text-[0.85rem] leading-[1.7] text-ash font-light">{madeByHand.body}</p>
        </div>
      </div>
      <div className="px-6 md:px-12 max-w-[1100px] mx-auto reveal mb-14 md:mb-20">
        <div className="max-w-[560px] text-left">
          <p className="eyebrow mb-2">{madeToOrder.title}</p>
          <p className="text-[0.95rem] font-light text-charcoal mb-2">{madeToOrder.tagline}</p>
          <p className="text-[0.85rem] leading-[1.7] text-ash font-light">{madeToOrder.body}</p>
        </div>
      </div>

      {/* Square image strip */}
      <div className="px-6 md:px-12 max-w-[1100px] mx-auto mb-14 md:mb-20">
        <SquareImageStrip
          images={
            media?.squareImageUrls?.length
              ? media.squareImageUrls.map((url: string) => ({ url }))
              : [{ placeholderLabel: 'Square 1' }, { placeholderLabel: 'Square 2' }, { placeholderLabel: 'Square 3' }]
          }
        />
      </div>

      {/* One Of One text */}
      <div className="px-6 md:px-12 max-w-[1100px] mx-auto reveal mb-6 md:mb-8">
        <div className="max-w-[560px] text-left">
          <p className="eyebrow mb-2">{oneOfOne.title}</p>
          <p className="text-[0.95rem] font-light text-charcoal mb-2">{oneOfOne.tagline}</p>
          <p className="text-[0.85rem] leading-[1.7] text-ash font-light">{oneOfOne.body}</p>
        </div>
      </div>

      {/* One Of One: video now, not a photo -- always 16:9 (was 3:4 on
          mobile), full-bleed with no side margin. Shorter vertical margin
          than before since a 16:9 video is much flatter than a 3:4 photo,
          so it doesn't need as much breathing room around it. */}
      <div className="mb-8 md:mb-10">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-charcoal/5">
          {media?.oneOfOneVideoUrl ? (
            <video
              src={media.oneOfOneVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <ImagePlaceholder label={`${oneOfOne.title} — video`} />
          )}
        </div>
      </div>

      {/* Signature Packaging: image left, text right (right-aligned). */}
      <div className="px-6 md:px-12 max-w-[1100px] mx-auto mb-14 md:mb-20">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
          <div className="flex-1 w-full">
            <div className="relative aspect-[3/4] max-w-[420px] mx-auto overflow-hidden bg-charcoal/5">
              {media?.signaturePackagingImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={media.signaturePackagingImageUrl}
                  alt={signaturePackaging.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <ImagePlaceholder label={`${signaturePackaging.title} — photo`} />
              )}
            </div>
          </div>
          <div className="flex-1 text-right reveal">
            <p className="eyebrow mb-2">{signaturePackaging.title}</p>
            <p className="text-[0.95rem] font-light text-charcoal mb-2">{signaturePackaging.tagline}</p>
            <p className="text-[0.85rem] leading-[1.7] text-ash font-light ml-auto max-w-md">{signaturePackaging.body}</p>
          </div>
        </div>
      </div>

      {/* Image D: narrow side margins, "Responsible By Design" overlaid,
          fixed regardless of which photo is used. Desktop only: landscape
          orientation and larger overlay text; mobile keeps the 3:4
          portrait treatment. */}
      <div className="px-3 md:px-8 pb-16 md:pb-24">
        <div className="relative aspect-[3/4] md:aspect-[16/9] max-w-[1100px] mx-auto overflow-hidden bg-charcoal">
          {media?.responsibleByDesignImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.responsibleByDesignImageUrl}
              alt={responsibleByDesign.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <ImagePlaceholder label={`${responsibleByDesign.title} — photo`} />
          )}
          <div className="absolute inset-0 bg-charcoal/25" />
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 text-ivory"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
          >
            <p className="text-[11px] md:text-[13px] tracking-[0.28em] uppercase font-light mb-4" style={{ color: '#e9dcc2' }}>
              {responsibleByDesign.title}
            </p>
            <p className="serif-display text-[1.2rem] md:text-[2rem] font-light leading-[1.4] mb-4 max-w-lg md:max-w-2xl">
              {responsibleByDesign.tagline}
            </p>
            <p className="text-[0.85rem] md:text-[1.05rem] leading-[1.7] font-light max-w-md md:max-w-xl">
              {responsibleByDesign.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
