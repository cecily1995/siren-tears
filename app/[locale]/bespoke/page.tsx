import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getSiteSettings } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';
import PageHeader from '@/components/PageHeader';
import BespokeTrackSelector from '@/components/BespokeTrackSelector';

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
      key: 'beaded' as const,
      title: t('handmade.title'),
      subtitle: t('handmade.subtitle'),
      time: t('handmade.time'),
      body: t('handmade.body')
    },
    {
      key: 'gemstone' as const,
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
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        intro={t('intro')}
        imageUrl="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Hands shaping jewellery at a quiet workbench"
      />

      {/* Two selectable production tracks -> reveals the matching form */}
      <BespokeTrackSelector
        tracks={tracks}
        labels={{
          tracksTitle: t('tracksTitle'),
          tracksDisclaimer: t('tracksDisclaimer'),
          chooseHint: t('chooseHint'),
          formTitle: t('formTitle'),
          formIntro: t('formIntro')
        }}
      />

      {/* Process */}
      <section className="bg-ivory px-6 md:px-12 py-16 md:py-32">
        <div className="mx-auto max-w-[1100px]">
          <p className="eyebrow text-center mb-8 md:mb-16">{t('processTitle')}</p>
          <div className="grid grid-cols-4 gap-1.5 md:gap-8">
            {steps.map((s, i) => (
              <div key={i} className="flex items-stretch">
                <article className="reveal text-center flex-1" style={{ transitionDelay: `${i * 120}ms` }}>
                  <div className="text-[8px] md:text-[11px] tracking-[0.2em] md:tracking-[0.4em] uppercase text-gold mb-1.5 md:mb-5 font-light">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="serif-display text-[0.8rem] md:text-[1.3rem] font-light leading-tight mb-1 md:mb-3 text-charcoal">
                    {s.title}
                  </h3>
                  <p className="hidden sm:block text-[0.6rem] md:text-[0.9rem] leading-[1.4] md:leading-[1.85] text-ash font-light">
                    {s.body}
                  </p>
                </article>
                {i < steps.length - 1 && (
                  <div className="flex items-center justify-center text-gold/50 text-xs md:text-xl px-0.5 md:px-2 shrink-0">
                    →
                  </div>
                )}
              </div>
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
    </>
  );
}
