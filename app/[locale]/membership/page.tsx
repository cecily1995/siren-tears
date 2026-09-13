import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getSiteSettings } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';
import PageHeader from '@/components/PageHeader';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'membership' });
  return { title: `${t('eyebrow')} — SIREN TEARS` };
}

export default async function MembershipPage({
  params
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const [t, settings] = await Promise.all([getTranslations('membership'), getSiteSettings()]);
  const email = settings?.email ?? fallback.settings.email;

  const circleBenefits = t.raw('circleBenefits') as string[];
  const privateBenefits = t.raw('privateBenefits') as string[];

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} intro={t('subtitle')} />

      <section className="bg-pearl px-6 md:px-12 py-24 md:py-32">
        <div className="mx-auto max-w-[1100px] grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-10">
          {/* Siren Circle */}
          <article className="reveal bg-ivory border border-charcoal/12 p-10 md:p-12 flex flex-col">
            <p className="eyebrow mb-3">{t('circleTitle')}</p>
            <p className="text-[0.95rem] text-gold font-light mb-8">{t('circleFree')}</p>
            <ul className="space-y-4 flex-1">
              {circleBenefits.map((b, i) => (
                <li key={i} className="text-[0.92rem] leading-[1.8] text-ash font-light pl-5 relative">
                  <span className="absolute left-0 top-[0.6em] w-1.5 h-1.5 rounded-full bg-gold/70" />
                  {b}
                </li>
              ))}
            </ul>
            {email && (
              <a
                href={`mailto:${email}?subject=${encodeURIComponent(t('circleCta'))}`}
                className="mt-10 text-[11px] tracking-[0.32em] uppercase text-charcoal link-underline w-fit"
              >
                {t('circleCta')}
              </a>
            )}
          </article>

          {/* Private Client — distinguished with a charcoal border/accent, not a solid black fill */}
          <article
            className="reveal bg-sandLight/40 border-2 border-charcoal p-10 md:p-12 flex flex-col"
            style={{ transitionDelay: '120ms' }}
          >
            <p className="eyebrow mb-3">{t('privateTitle')}</p>
            <p className="text-[0.95rem] text-ash font-light mb-8">{t('privateSubtitle')}</p>
            <ul className="space-y-4 flex-1">
              {privateBenefits.map((b, i) => (
                <li key={i} className="text-[0.92rem] leading-[1.8] text-ash font-light pl-5 relative">
                  <span className="absolute left-0 top-[0.6em] w-1.5 h-1.5 rounded-full bg-gold/70" />
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-10 text-[0.82rem] text-ash/70 font-light leading-relaxed">
              {t('privateQualify')}
            </p>
          </article>
        </div>

        <div className="mt-20 max-w-xl mx-auto text-center reveal">
          <div className="mx-auto h-px w-16 bg-gold/60 mb-8" />
          <p className="text-[0.9rem] text-ash font-light leading-relaxed">{t('comingSoonNote')}</p>
        </div>
      </section>
    </>
  );
}
