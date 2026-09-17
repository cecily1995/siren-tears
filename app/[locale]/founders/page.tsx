import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import SwipeGallery from '@/components/SwipeGallery';

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'foundersPage' });
  return { title: `${t('pageTitle')} — SIREN TEARS` };
}

export default async function FoundersPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);

  const t = await getTranslations('foundersPage');

  return (
    <div className="bg-ivory">
      <div className="px-6 md:px-12 py-16 md:py-24 max-w-[720px] mx-auto text-center">
        <h1 className="serif-display text-[clamp(1.7rem,4vw,2.6rem)] font-light leading-[1.2] text-charcoal uppercase tracking-[0.02em]">
          {t('pageTitle')}
        </h1>

        {/* Part one: opening line, a photo, then the quote and signature --
            mirrors the reference page's intro + pull-quote structure. */}
        <p className="mt-8 text-[0.98rem] md:text-[1.05rem] leading-[1.9] text-ash font-light">
          {t('heroIntro')}
        </p>
      </div>

      <div className="px-6 md:px-12 max-w-[520px] mx-auto mb-12 md:mb-16">
        <SwipeGallery
          images={[{ placeholderLabel: 'Founder image 01' }]}
          aspectClassName="aspect-[4/5]"
        />
      </div>

      <div className="px-6 md:px-12 max-w-[720px] mx-auto text-center mb-20 md:mb-28">
        <p className="serif-display italic text-[1.3rem] md:text-[1.7rem] font-light leading-[1.5] text-charcoal">
          &ldquo;{t('quote')}&rdquo;
        </p>
        <p className="mt-5 text-[11px] tracking-[0.28em] uppercase text-gold font-light">
          {t('quoteSignature')}
        </p>
      </div>

      {/* Part two: Our Founders -- the fuller story, then a swipeable set
          of founder photos (starts with placeholders; real photography to
          be added later without needing any layout change). */}
      <div className="px-6 md:px-12 max-w-[720px] mx-auto text-center mb-10 md:mb-14">
        <p className="eyebrow mb-5">{t('foundersHeading')}</p>
        <div className="space-y-6 text-left">
          <p className="text-[0.95rem] md:text-[1rem] leading-[1.9] text-ash font-light">{t('para1')}</p>
          <p className="text-[0.95rem] md:text-[1rem] leading-[1.9] text-ash font-light">{t('para2')}</p>
          <p className="text-[0.95rem] md:text-[1rem] leading-[1.9] text-ash font-light">{t('para3')}</p>
        </div>
      </div>

      <div className="px-6 md:px-12 max-w-[720px] mx-auto pb-20 md:pb-28">
        <SwipeGallery
          images={[
            { placeholderLabel: 'Founder image 01' },
            { placeholderLabel: 'Founder image 02' }
          ]}
          aspectClassName="aspect-[4/5]"
        />
      </div>
    </div>
  );
}
