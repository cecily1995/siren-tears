import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getSiteSettings } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'custom' });
  return { title: `${t('eyebrow')} — SIREN TEARS` };
}

export default async function CustomPage({
  params
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const [t, settings] = await Promise.all([getTranslations('custom'), getSiteSettings()]);
  const email = settings?.email ?? fallback.settings.email;
  const instagramUrl = settings?.instagramUrl ?? fallback.settings.instagramUrl;

  const steps = [
    { title: t('steps.one.title'), body: t('steps.one.body') },
    { title: t('steps.two.title'), body: t('steps.two.body') },
    { title: t('steps.three.title'), body: t('steps.three.body') }
  ];

  return (
    <>
      <section className="relative bg-charcoal text-ivory px-6 md:px-12 pt-40 pb-24 md:pt-48 md:pb-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.14] pointer-events-none"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 15%, rgba(245, 215, 165, 0.55) 0%, rgba(245, 215, 165, 0) 70%)'
          }}
        />
        <div className="relative mx-auto max-w-[820px] text-center reveal">
          <p className="eyebrow text-gold/85 mb-6">{t('eyebrow')}</p>
          <h1 className="serif-display text-[clamp(2.2rem,4.8vw,3.8rem)] font-light leading-[1.12]">
            {t('title')}
          </h1>
          <p className="mt-7 max-w-xl mx-auto text-[0.98rem] leading-[1.95] text-ivory/70 font-light">
            {t('intro')}
          </p>
        </div>
      </section>

      <section className="bg-pearl px-6 md:px-12 py-24 md:py-32">
        <div className="mx-auto max-w-[1100px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            {steps.map((s, i) => (
              <article
                key={i}
                className="reveal text-center md:text-left"
                style={{ transitionDelay: `${i * 140}ms` }}
              >
                <div className="text-[11px] tracking-[0.4em] uppercase text-gold mb-6 font-light">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h2 className="serif-display text-[1.6rem] md:text-[1.85rem] font-light leading-tight mb-5 text-charcoal">
                  {s.title}
                </h2>
                <p className="text-[0.95rem] leading-[1.9] text-ash font-light max-w-sm md:max-w-none mx-auto">
                  {s.body}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-24 md:mt-28 max-w-2xl mx-auto text-center reveal">
            <div className="mx-auto h-px w-16 bg-gold/60 mb-10" />
            <p className="eyebrow mb-4">{t('noteTitle')}</p>
            <p className="text-[0.95rem] leading-[1.9] text-ash font-light">{t('note')}</p>
          </div>
        </div>
      </section>

      <section className="bg-charcoal text-ivory px-6 md:px-12 py-24 md:py-32 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.1] pointer-events-none"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 100%, rgba(245, 215, 165, 0.55) 0%, rgba(245, 215, 165, 0) 70%)'
          }}
        />
        <div className="relative mx-auto max-w-[700px] text-center reveal">
          <h2 className="serif-display text-[clamp(1.9rem,3.6vw,2.6rem)] font-light leading-[1.15]">
            {t('ctaTitle')}
          </h2>
          <p className="mt-6 text-[0.98rem] leading-[1.9] text-ivory/70 font-light">
            {t('ctaBody')}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            {email && (
              <a
                href={`mailto:${email}`}
                className="text-[11px] tracking-[0.32em] uppercase text-ivory link-underline"
              >
                {t('emailCta')}
              </a>
            )}
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] tracking-[0.32em] uppercase text-ivory/85 link-underline"
              >
                {t('instagramCta')}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
