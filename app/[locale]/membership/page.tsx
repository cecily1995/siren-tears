import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/PageHeader';
import MembershipJoinForm from '@/components/MembershipJoinForm';
import MemberGiftTeaser from '@/components/MemberGiftTeaser';
import { Link } from '@/i18n/routing';

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

  const [t] = await Promise.all([getTranslations('membership')]);

  const circleBenefits = t.raw('circleBenefits') as string[];
  const privateBenefits = t.raw('privateBenefits') as string[];

  return (
    <>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('subtitle')}
        imageUrl="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Warm gold and champagne stone detail"
      />

      <section className="bg-pearl px-6 md:px-12 py-14 md:py-20">
        <div className="mx-auto max-w-[640px] space-y-14">
          {/* Siren Circle */}
          <div>
            <article className="reveal bg-ivory border border-charcoal/12 p-6 md:p-8 flex flex-col">
              <p className="eyebrow mb-3">{t('circleTitle')}</p>
              <p className="text-[0.95rem] text-gold font-light mb-5">{t('circleFree')}</p>
              <ul className="space-y-3">
                {circleBenefits.map((b, i) => (
                  <li key={i} className="text-[0.92rem] leading-[1.7] text-ash font-light pl-5 relative">
                    <span className="absolute left-0 top-[0.6em] w-1.5 h-1.5 rounded-full bg-gold/70" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <MemberGiftTeaser />
              </div>
            </article>

            <div className="mt-7 reveal">
              <div className="text-center mb-5">
                <p className="eyebrow mb-4">{t('circleCta')}</p>
              </div>
              <MembershipJoinForm />
            </div>
          </div>

          <div className="h-px bg-charcoal/10" />

          {/* Private Client — distinguished with a charcoal border/accent, not a solid black fill */}
          <Link
            href="/membership/private-client"
            className="reveal group block bg-sandLight/40 border-2 border-charcoal p-6 md:p-8 transition-colors duration-300 hover:bg-charcoal hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <div className="flex items-start justify-between gap-6 mb-3">
              <p className="eyebrow group-hover:text-gold transition-colors">{t('privateTitle')}</p>
              <span className="text-[1.25rem] leading-none font-light transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
            </div>
            <p className="text-[0.95rem] text-ash group-hover:text-ivory/75 font-light mb-5 transition-colors">{t('privateSubtitle')}</p>
            <ul className="space-y-3 flex-1">
              {privateBenefits.map((b, i) => (
                <li key={i} className="text-[0.92rem] leading-[1.7] text-ash group-hover:text-ivory/80 font-light pl-5 relative transition-colors">
                  <span className="absolute left-0 top-[0.6em] w-1.5 h-1.5 rounded-full bg-gold/70" />
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-7 text-[0.82rem] text-ash/70 group-hover:text-ivory/70 font-light leading-relaxed transition-colors">
              {t('privateQualify')}
            </p>
            <p className="mt-4 text-[0.78rem] text-gold font-light leading-relaxed">
              {t('privatePriceNote')}
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
