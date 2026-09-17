import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getResponsibleCraftsmanshipSettings } from '@/sanity/lib/queries';

const SECTION_IMAGE_KEYS: Record<string, string> = {
  craftedWithIntention: 'craftedWithIntentionImageUrl',
  naturalMaterials: 'naturalMaterialsImageUrl',
  madeByHand: 'madeByHandImageUrl',
  madeToOrder: 'madeToOrderImageUrl',
  oneOfOne: 'oneOfOneImageUrl',
  responsibleByDesign: 'responsibleByDesignImageUrl',
  signaturePackaging: 'signaturePackagingImageUrl'
};

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'responsibleCraftsmanshipPage' });
  return { title: `${t('pageTitle')} — SIREN TEARS` };
}

export default async function ResponsibleCraftsmanshipPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);

  const [t, media] = await Promise.all([
    getTranslations('responsibleCraftsmanshipPage'),
    getResponsibleCraftsmanshipSettings()
  ]);

  const sections = t.raw('sections') as { key: string; title: string; tagline: string; body: string }[];

  return (
    <div className="bg-ivory">
      <div className="px-6 md:px-12 pt-28 md:pt-32 pb-10 md:pb-14">
        <h1 className="serif-display text-[clamp(1.5rem,3.2vw,2.1rem)] font-light leading-[1.2] text-charcoal uppercase tracking-[0.02em] text-left">
          {t('pageTitle')}
        </h1>
      </div>

      {sections.map((section, i) => {
        const imageUrl = media?.[SECTION_IMAGE_KEYS[section.key]] as string | undefined;
        const imageOnRight = i % 2 === 0;

        return (
          <section key={section.key} className="px-6 md:px-12 py-10 md:py-14">
            <div className="mx-auto max-w-[1100px]">
              <div className={`flex flex-col ${imageOnRight ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}>
                <div className="flex-1 text-left reveal">
                  <p className="eyebrow mb-3">{section.title}</p>
                  <h2 className="serif-display text-[clamp(1.3rem,2.6vw,1.8rem)] font-light leading-[1.3] mb-4 text-charcoal">
                    {section.tagline}
                  </h2>
                  <p className="text-[0.9rem] leading-[1.85] text-ash font-light max-w-md">{section.body}</p>
                </div>
                <div className="flex-1 w-full">
                  <div className="relative aspect-[4/5] max-w-[420px] mx-auto overflow-hidden bg-charcoal/5">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt={section.title} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center border border-dashed border-charcoal/20">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-ash/60 font-light text-center px-4">
                          {section.title} — photo
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
