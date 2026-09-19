import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/PageHeader';
import { Link } from '@/i18n/routing';

export const revalidate = 3600;

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'faqPage' });
  return { title: `${t('title')} — SIREN TEARS` };
}

export default async function FaqPage({
  params
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  const t = await getTranslations('faqPage');
  const items = t.raw('items') as { q: string; a: string }[];

  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title={t('title')}
        imageUrl="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Natural stone texture"
      />

      <section className="bg-ivory px-6 md:px-12 py-8 md:py-10">
        <div className="mx-auto max-w-[820px] divide-y divide-charcoal/10">
          {items.map((item, i) => (
            <div key={i} className="py-4 reveal" style={{ transitionDelay: `${(i % 6) * 60}ms` }}>
              <h2 className="serif-display text-[1.2rem] font-light text-charcoal mb-3">{item.q}</h2>
              <p className="text-[0.92rem] leading-[1.75] text-ash font-light">{item.a}</p>
              {i === 2 && (
                <p className="mt-3 text-[0.92rem] leading-[1.75] text-ash font-light">
                  {t('shippingExtra')}{' '}
                  <Link href="/membership" className="text-gold hover:text-gold/80 link-underline">
                    → {t('joinLink')}
                  </Link>
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
