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

          <div className="mt-24 pt-12 border-t border-charcoal/10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 reveal">
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
