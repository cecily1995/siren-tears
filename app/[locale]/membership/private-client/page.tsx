import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import PageHeader from '@/components/PageHeader';
import PrivateClientPayment from '@/components/PrivateClientPayment';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'membership' });
  return { title: `${t('privateTitle')} — SIREN TEARS` };
}

export default async function PrivateClientPage({ params, searchParams }: { params: { locale: string }; searchParams: { payment?: string } }) {
  setRequestLocale(params.locale);
  const [t, tNav] = await Promise.all([
    getTranslations('membership'),
    getTranslations('nav')
  ]);
  const benefits = t.raw('privateBenefits') as string[];

  return (
    <div className="bg-ivory">
      <PageHeader
        eyebrow={`${t('eyebrow')} · ${t('privateTitle')}`}
        title={t('privateTitle')}
        intro={t('privateSubtitle')}
        imageUrl="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=2000&q=85"
        imageAlt={t('privateTitle')}
      />

      <section className="bg-charcoal text-ivory px-6 md:px-12 py-12 md:py-16">
        <div className="max-w-[760px] mx-auto text-center">
          <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-5">SIREN TEARS ATELIER</p>
          <p className="serif-display text-[clamp(1.45rem,3.2vw,2.35rem)] leading-[1.45] font-light">
            {t('privateQualify')}
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-8 md:py-10 bg-pearl">
        <div className="max-w-[1040px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-charcoal/12 border border-charcoal/12">
            {benefits.map((benefit, index) => (
              <article key={benefit} className="bg-ivory px-5 py-4 md:px-6 md:py-5 flex gap-4 items-start text-left">
                <span className="serif-display text-[1.15rem] text-gold font-light tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-[0.92rem] leading-[1.75] text-charcoal font-light pt-0.5">{benefit}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-10 md:py-12 bg-sandLight/45">
        <div className="max-w-[680px] mx-auto text-left">
          {searchParams.payment === 'success' && (
            <p className="mb-6 border border-gold/30 bg-ivory px-5 py-4 text-[0.88rem] leading-[1.7] text-charcoal">{t('privatePaymentSuccess')}</p>
          )}
          <p className="eyebrow mb-5">{t('privateTitle')}</p>
          <p className="text-[0.92rem] leading-[1.8] text-ash font-light">{t('privateQualify')}</p>
          <p className="mt-4 text-[0.82rem] leading-[1.7] text-gold font-light">{t('privatePriceNote')}</p>
          <div className="mt-8">
            <PrivateClientPayment />
          </div>
          <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link href="/contact" className="border border-charcoal/25 text-charcoal px-8 py-3.5 text-center text-[10px] tracking-[0.28em] uppercase transition-colors hover:border-charcoal">{tNav('enquire')}</Link>
            <Link href="/membership" className="border border-charcoal/25 text-charcoal px-8 py-3.5 text-[10px] tracking-[0.28em] uppercase transition-colors hover:border-charcoal">
              ← {t('eyebrow')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
