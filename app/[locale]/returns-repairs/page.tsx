import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import ReturnsRepairsForm from '@/components/ReturnsRepairsForm';

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'returnsRepairsPage' });
  return { title: `${t('title')} — SIREN TEARS` };
}

export default async function ReturnsRepairsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);

  const t = await getTranslations('returnsRepairsPage');

  const body = 'text-[0.72rem] leading-[1.85] text-ash font-light';
  const sectionTitle = 'text-[0.72rem] tracking-[0.14em] uppercase text-charcoal font-normal mb-2 mt-7';

  return (
    <div className="bg-ivory">
      <div className="px-6 md:px-12 pt-28 md:pt-32 pb-14 md:pb-20 max-w-[720px] mx-auto text-left">
        <h1 className="serif-display text-[1.6rem] md:text-[2rem] font-normal text-charcoal mb-8">
          {t('title')}
        </h1>

        <p className={body}>{t('intro1')}</p>
        <p className={`${body} mt-3`}>{t('intro2')}</p>
        <p className={`${body} mt-3`}>{t('intro3')}</p>
        <p className={`${body} mt-3`}>{t('intro4')}</p>
        <p className={`${body} mt-3`}>{t('intro5')}</p>
        <p className={`${body} mt-3`}>{t('intro6')}</p>

        <p className={sectionTitle}>{t('changeOfMindTitle')}</p>
        <p className={body}>{t('changeOfMindBody1')}</p>
        <p className={`${body} mt-3`}>{t('changeOfMindBody2')}</p>

        <p className={sectionTitle}>{t('naturalVariationTitle')}</p>
        <p className={body}>{t('naturalVariationBody1')}</p>
        <p className={`${body} mt-3`}>{t('naturalVariationBody2')}</p>
        <p className={`${body} mt-3`}>{t('naturalVariationBody3')}</p>

        <p className={sectionTitle}>{t('somethingWrongTitle')}</p>
        <p className={body}>{t('somethingWrongBody1')}</p>
        <p className={`${body} mt-3`}>{t('somethingWrongBody2')}</p>
        <p className={`${body} mt-3`}>{t('somethingWrongBody3')}</p>

        <p className={sectionTitle}>{t('repairsTitle')}</p>
        <p className={body}>{t('repairsBody1')}</p>
        <p className={`${body} mt-3`}>{t('repairsBody2')}</p>
        <p className={`${body} mt-3`}>{t('repairsBody3')}</p>
        <p className={`${body} mt-3`}>{t('repairsBody4')}</p>
        <p className={`${body} mt-3`}>{t('repairsShippingNote')}</p>

        <p className={sectionTitle}>{t('beforeConfirmTitle')}</p>
        <p className={body}>{t('beforeConfirmIntro')}</p>
        <ul className="mt-3 space-y-3">
          <li>
            <p className="text-[0.72rem] tracking-[0.08em] uppercase text-charcoal font-normal">{t('stoneLabel')}</p>
            <p className={body}>{t('stoneBody')}</p>
          </li>
          <li>
            <p className="text-[0.72rem] tracking-[0.08em] uppercase text-charcoal font-normal">{t('detailsLabel')}</p>
            <p className={body}>{t('detailsBody')}</p>
          </li>
          <li>
            <p className="text-[0.72rem] tracking-[0.08em] uppercase text-charcoal font-normal">{t('pieceLabel')}</p>
            <p className={body}>{t('pieceBody')}</p>
          </li>
        </ul>

        <p className={`${body} mt-7`}>{t('closingBody')}</p>
        <p className={`${body} mt-2`}>{t('closingLine')}</p>

        <p className={`${sectionTitle} mt-12`}>{t('contactIntroTitle')}</p>
        <p className={body}>{t('contactIntroBody1')}</p>
        <p className={`${body} mt-3`}>{t('contactIntroBody2')}</p>

        <div className="mt-6">
          <ReturnsRepairsForm />
        </div>
      </div>
    </div>
  );
}
