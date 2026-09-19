import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getBrandStory } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';
import { translateText } from '@/lib/translate';

type StorySpan = { _key?: string; _type?: string; text?: string; marks?: string[] };
type StoryBlock = { _key?: string; _type?: string; children?: StorySpan[] };

async function translateStoryBody(body: StoryBlock[] | undefined, locale: string) {
  return Promise.all((body ?? []).map(async (block) => ({
    ...block,
    children: await Promise.all((block.children ?? []).map(async (span) => ({
      ...span,
      text: await translateText(span.text, locale)
    })))
  })));
}

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
  const [translatedEyebrow, translatedTitle, translatedParagraphs, translatedBody, translatedStats] = await Promise.all([
    translateText(rawData.eyebrow, locale),
    translateText(rawData.title, locale),
    Promise.all((rawData.paragraphs ?? []).map((p: string) => translateText(p, locale))),
    translateStoryBody(rawData.body, locale),
    Promise.all(
      (rawData.stats ?? []).map(async (s: { value?: string; label?: string }) => ({
        value: s.value,
        label: await translateText(s.label, locale)
      }))
    )
  ]);
  const data = { ...rawData, eyebrow: translatedEyebrow, title: translatedTitle, paragraphs: translatedParagraphs, body: translatedBody, stats: translatedStats };
  const displayImage = data.imageUrl || fallback.brandStory.imageUrl;

  return (
    <div className="bg-ivory">
      <div className="pt-[72px] md:pt-24 pb-8 md:pb-10 text-left">
        <div className="px-6 md:px-12 max-w-[1080px] mx-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/siren-tears-logo-full.png"
          alt="Siren Tears"
          className="w-[150px] md:w-[180px] h-auto mb-8 md:mb-10"
        />
        </div>

        {/* This image used to sit as a full-bleed background behind
            centered ivory text on a dark overlay -- now a plain 16:9
            display image under the logo, ahead of the (left-aligned,
            plain white background) text. */}
        {displayImage && (
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-charcoal/5 mb-8 md:mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImage}
              alt={data.imageAlt || ''}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        <div className="px-6 md:px-12 max-w-[1080px] mx-auto">
        <p className="eyebrow text-gold mb-3">{data.eyebrow || t('pageTitle')}</p>
        {data.title && (
          <h1 className="serif-display text-[1.5rem] md:text-[1.8rem] font-semibold leading-[1.2] text-charcoal mb-6">
            {data.title}
          </h1>
        )}

        <div className="space-y-3 text-[0.8rem] md:text-[0.85rem] leading-[1.7] text-ash font-light">
          {data.body?.length
            ? data.body.map((block: StoryBlock, i: number) => (
                <p key={block._key ?? i} className="whitespace-pre-line">
                  {(block.children ?? []).map((span, j) => span.marks?.includes('strong')
                    ? <strong key={span._key ?? j} className="font-medium text-charcoal">{span.text}</strong>
                    : <span key={span._key ?? j}>{span.text}</span>)}
                </p>
              ))
            : (data.paragraphs ?? []).map((p: string, i: number) => (
                <p key={i} className="whitespace-pre-line">{p}</p>
              ))}
        </div>

        {data.stats && data.stats.length > 0 && (
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            {data.stats.map((s: { value?: string; label?: string }, i: number) => (
              <div key={i} className="border-t border-charcoal/15 pt-4">
                <div className="serif-display text-[1.4rem] md:text-[1.6rem] font-light leading-none text-charcoal">
                  {s.value}
                </div>
                <div className="mt-2 text-[9px] tracking-[0.2em] uppercase text-ash/70 font-light">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
