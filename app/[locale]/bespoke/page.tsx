import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getSiteSettings } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';
import BespokeForm from '@/components/BespokeForm';
import PageHeader from '@/components/PageHeader';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'bespoke' });
  return { title: `${t('eyebrow')} — SIREN TEARS` };
}

const WHATSAPP_NUMBER = '64274326262'; // +64 27 432 6262

export default async function BespokePage({
  params
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const [t, settings] = await Promise.all([getTranslations('bespoke'), getSiteSettings()]);
  const email = settings?.email ?? fallback.settings.email;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  const tracks = [
    {
      title: t('handmade.title'),
      subtitle: t('handmade.subtitle'),
      time: t('handmade.time'),
      body: t('handmade.body')
    },
    {
      title: t('gemstone.title'),
      subtitle: t('gemstone.subtitle'),
      time: t('gemstone.time'),
      body: t('gemstone.body')
    }
  ];

  const steps = [
    { title: t('steps.tell.title'), body: t('steps.tell.body') },
    { title: t('steps.source.title'), body: t('steps.source.body') },
    { title: t('steps.design.title'), body: t('steps.design.body') },
    { title: t('steps.create.title'), body: t('steps.create.body') }
  ];

  return (
    <>
      {/* Hero */}
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />

      {/* Two production tracks */}
      <section className="bg-pearl px-6 md:px-12 py-24 md:py-32">
        <div className="mx-auto max-w-[1100px]">
          <p className="eyebrow text-center mb-4">{t('tracksTitle')}</p>
          <div className="mx-auto h-px w-16 bg-gold/60 mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8">
            {tracks.map((track, i) => (
              <article
                key={i}
                className="reveal border border-charcoal/12 p-9 md:p-11 bg-ivory"
                style={{ transitionDelay: `${i * 140}ms` }}
              >
                <p className="text-[11px] tracking-[0.32em] uppercase text-gold mb-4 font-light">
                  {track.subtitle}
                </p>
                <h2 className="serif-display text-[1.5rem] md:text-[1.7rem] font-light leading-tight mb-3 text-charcoal">
                  {track.title}
                </h2>
                <p className="text-[1rem] font-light text-charcoal mb-5">{track.time}</p>
                <p className="text-[0.92rem] leading-[1.9] text-ash font-light">{track.body}</p>
              </article>
            ))}
          </div>

          <p className="mt-10 text-center text-[0.82rem] text-ash/70 font-light max-w-2xl mx-auto leading-relaxed">
            {t('tracksDisclaimer')}
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="bg-ivory px-6 md:px-12 py-24 md:py-32">
        <div className="mx-auto max-w-[1100px]">
          <p className="eyebrow text-center mb-16">{t('processTitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {steps.map((s, i) => (
              <article
                key={i}
                className="reveal text-center"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5 font-light">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="serif-display text-[1.3rem] font-light leading-tight mb-3 text-charcoal">
                  {s.title}
                </h3>
                <p className="text-[0.9rem] leading-[1.85] text-ash font-light">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Prefer to talk first? — positioned before the form as an alternative, not a redundant follow-up */}
      <section className="bg-sandLight/40 px-6 md:px-12 py-14">
        <div className="mx-auto max-w-[820px] flex flex-col sm:flex-row items-center justify-center gap-x-10 gap-y-4 text-center sm:text-left reveal">
          <p className="text-[0.9rem] text-ash font-light">{t('contactTitle')}</p>
          <div className="flex items-center gap-8">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] tracking-[0.3em] uppercase text-charcoal link-underline"
            >
              {t('whatsappCta')}
            </a>
            {email && (
              <a
                href={`mailto:${email}`}
                className="text-[11px] tracking-[0.3em] uppercase text-charcoal/85 link-underline"
              >
                {t('emailCta')}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Bespoke request form */}
      <section className="bg-pearl px-6 md:px-12 py-24 md:py-32">
        <div className="mx-auto max-w-[760px]">
          <div className="text-center mb-14 reveal">
            <p className="eyebrow mb-4">{t('formTitle')}</p>
            <p className="text-[0.95rem] leading-[1.9] text-ash font-light max-w-md mx-auto">
              {t('formIntro')}
            </p>
          </div>
          <BespokeForm />
        </div>
      </section>
    </>
  );
}
