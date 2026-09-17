import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getBrandStory } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';
import { translateText } from '@/lib/translate';

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'brandStory' });
  return { title: `${t('pageTitle')} — SIREN TEARS` };
}

export default async function BrandStoryPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);

  const [t, story] = await Promise.all([getTranslations('brandStory'), getBrandStory()]);

  const rawData = story ?? fallback.brandStory;
  const [translatedEyebrow, translatedTitle, translatedParagraphs, translatedStats] = await Promise.all([
    translateText(rawData.eyebrow, locale),
    translateText(rawData.title, locale),
    Promise.all((rawData.paragraphs ?? []).map((p: string) => translateText(p, locale))),
    Promise.all(
      (rawData.stats ?? []).map(async (s: { value?: string; label?: string }) => ({
        value: s.value,
        label: await translateText(s.label, locale)
      }))
    )
  ]);
  const data = { ...rawData, eyebrow: translatedEyebrow, title: translatedTitle, paragraphs: translatedParagraphs, stats: translatedStats };
  const bgUrl = data.imageUrl || fallback.brandStory.imageUrl;

  return (
    <section className="relative bg-charcoal text-ivory overflow-hidden">
      {/* Deep, story-toned ocean background — darker and more atmospheric
          than the Hero's warm treatment, since this is meant to feel like
          settling in to read rather than a bright landing moment. */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${bgUrl})` }}
        role="img"
        aria-label={data.imageAlt || ''}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,14,18,0.88) 0%, rgba(12,16,20,0.82) 35%, rgba(10,13,17,0.9) 100%)'
        }}
      />
      <div
        className="absolute inset-0 opacity-60 mix-blend-soft-light"
        style={{
          background:
            'radial-gradient(65% 50% at 50% 15%, rgba(120,150,165,0.5) 0%, rgba(120,150,165,0) 70%)'
        }}
      />

      <div className="relative px-6 md:px-12 pt-36 pb-24 md:pt-44 md:pb-32">
        <div className="mx-auto max-w-[760px] text-center reveal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/siren-tears-logo-full-ivory.png"
            alt="Siren Tears"
            className="mx-auto w-full max-w-[420px] h-auto opacity-90 mb-10 md:mb-14"
          />
          <p className="eyebrow text-gold/90 mb-6">{data.eyebrow || t('pageTitle')}</p>
          {data.title && (
            <h1 className="serif-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-light leading-[1.12]">
              {data.title}
            </h1>
          )}

          <div className="mt-10 mx-auto h-px w-16 bg-gold/50" />

          <div className="mt-10 space-y-6 text-[0.98rem] md:text-[1.02rem] leading-[1.95] text-ivory/80 font-light text-left md:text-center">
            {(data.paragraphs ?? []).map((p: string, i: number) => (
              <p key={i} className="whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>

          {data.stats && data.stats.length > 0 && (
            <div className="mt-14 grid grid-cols-3 gap-6 max-w-md mx-auto">
              {data.stats.map((s: { value?: string; label?: string }, i: number) => (
                <div key={i} className="border-t border-ivory/20 pt-5">
                  <div className="serif-display text-[1.8rem] md:text-[2.2rem] font-light leading-none text-ivory">
                    {s.value}
                  </div>
                  <div className="mt-3 text-[9px] md:text-[10px] tracking-[0.24em] uppercase text-ivory/60 font-light">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
