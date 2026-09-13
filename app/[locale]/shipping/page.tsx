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
  const t = await getTranslations({ locale: params.locale, namespace: 'shipping' });
  return { title: `${t('eyebrow')} — SIREN TEARS` };
}

export default async function ShippingPage({
  params
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const [t, settings] = await Promise.all([getTranslations('shipping'), getSiteSettings()]);
  const email = settings?.email ?? fallback.settings.email;

  const sections = [
    { title: t('domestic.title'), body: t('domestic.body') },
    { title: t('international.title'), body: t('international.body') },
    { title: t('duties.title'), body: t('duties.body') },
    { title: t('care.title'), body: t('care.body') }
  ];

  return (
    <>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('intro')}
        imageUrl="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Soft coastal light, New Zealand shoreline"
      />

      <section className="bg-ivory px-6 md:px-12 py-24 md:py-32">
        <div className="mx-auto max-w-[980px]">
          <p className="text-center text-[0.85rem] text-ash/70 font-light mb-16 reveal">
            {t('carrierNote')}
          </p>

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

          <div className="mt-20 pt-12 border-t border-charcoal/10 text-center reveal">
            <p className="eyebrow mb-4">{t('checkTitle')}</p>
            <p className="text-[0.95rem] text-ash font-light mb-6 max-w-md mx-auto">
              {t('checkBody')}
            </p>
            <a
              href="https://www.nzpost.co.nz/tools/rate-finder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] tracking-[0.3em] uppercase text-charcoal link-underline"
            >
              {t('checkCta')} →
            </a>
          </div>

          <div className="mt-20 pt-12 border-t border-charcoal/10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 reveal">
            <p className="text-[0.95rem] text-ash font-light">{t('contactPrompt')}</p>
            {email && (
              <a
                href={`mailto:${email}`}
                className="text-[11px] tracking-[0.3em] uppercase text-charcoal link-underline w-fit"
              >
                {t('contactCta')} — {email}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
