import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/PageHeader';

export const revalidate = 3600;

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'care' });
  return { title: `${t('eyebrow')} — SIREN TEARS` };
}

export default async function CarePage({
  params
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const t = await getTranslations('care');

  const sections = [
    { title: t('water.title'), body: t('water.body') },
    { title: t('perfume.title'), body: t('perfume.body') },
    { title: t('storage.title'), body: t('storage.body') },
    { title: t('cleaning.title'), body: t('cleaning.body') }
  ];

  return (
    <>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('intro')}
        imageUrl="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Natural stone, soft light"
      />

      <section className="bg-ivory px-6 md:px-12 py-24 md:py-32">
        <div className="mx-auto max-w-[980px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-16">
            {sections.map((s, i) => (
              <article key={i} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5 font-light">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h2 className="serif-display text-[1.5rem] md:text-[1.7rem] font-light leading-tight mb-4 text-charcoal">
                  {s.title}
                </h2>
                <p className="text-[0.95rem] leading-[1.9] text-ash font-light">{s.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-24 pt-12 border-t border-charcoal/10 text-center reveal">
            <p className="text-[0.9rem] text-ash/80 font-light max-w-xl mx-auto leading-relaxed">
              {t('note')}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
