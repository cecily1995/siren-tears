import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/PageHeader';
import MembershipJoinForm from '@/components/MembershipJoinForm';

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

      <section className="bg-pearl px-6 md:px-12 py-24 md:py-32">
        <div className="mx-auto max-w-[640px] space-y-20">
          {/* Siren Circle */}
          <div>
            <article className="reveal bg-ivory border border-charcoal/12 p-10 md:p-12 flex flex-col">
              <p className="eyebrow mb-3">{t('circleTitle')}</p>
              <p className="text-[0.95rem] text-gold font-light mb-8">{t('circleFree')}</p>
              <ul className="space-y-4">
                {circleBenefits.map((b, i) => (
                  <li key={i} className="text-[0.92rem] leading-[1.8] text-ash font-light pl-5 relative">
                    <span className="absolute left-0 top-[0.6em] w-1.5 h-1.5 rounded-full bg-gold/70" />
                    {b}
                  </li>
                ))}
              </ul>
            </article>

            <div className="mt-10 reveal">
              <div className="text-center mb-8">
                <p className="eyebrow mb-4">{t('circleCta')}</p>
              </div>
              <MembershipJoinForm />
            </div>
          </div>

          <div className="h-px bg-charcoal/10" />

          {/* Private Client — distinguished with a charcoal border/accent, not a solid black fill */}
          <article
            className="reveal bg-sandLight/40 border-2 border-charcoal p-10 md:p-12 flex flex-col"
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
            <p className="mt-4 text-[0.78rem] text-gold font-light leading-relaxed">
              {t('privatePriceNote')}
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
