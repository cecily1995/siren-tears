import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/PageHeader';

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'sizeGuide' });
  return { title: `${t('title')} — SIREN TEARS` };
}

const RING_TABLE = [
  { mm: '14.1 / 44.2', us: '3', uk: 'F' },
  { mm: '14.9 / 46.8', us: '4', uk: 'H½' },
  { mm: '15.7 / 49.3', us: '5', uk: 'K½' },
  { mm: '16.5 / 51.9', us: '6', uk: 'M½' },
  { mm: '17.3 / 54.4', us: '7', uk: 'O½' },
  { mm: '18.1 / 57.0', us: '8', uk: 'Q½' },
  { mm: '18.9 / 59.5', us: '9', uk: 'S½' },
  { mm: '19.8 / 62.1', us: '10', uk: 'U½' }
];

const WRIST_TABLE = [
  { cm: '14 – 15', label: 'XS' },
  { cm: '15 – 16', label: 'S' },
  { cm: '16 – 17.5', label: 'M' },
  { cm: '17.5 – 19', label: 'L' },
  { cm: '19 – 21', label: 'XL' }
];

export default async function SizeGuidePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations('sizeGuide');

  return (
    <>
      <PageHeader eyebrow={t('title')} title={t('title')} />
      <section className="bg-ivory px-6 md:px-12 py-12 md:py-16">
        <div className="mx-auto max-w-[720px] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          <div>
            <p className="eyebrow mb-6">{t('ringTab')}</p>
            <p className="text-[0.9rem] text-charcoal font-light leading-relaxed mb-2">
              {t('ringMethod1Title')}
            </p>
            <p className="text-[0.85rem] text-ash font-light leading-relaxed mb-5">
              {t('ringMethod1Body')}
            </p>
            <p className="text-[0.9rem] text-charcoal font-light leading-relaxed mb-2">
              {t('ringMethod2Title')}
            </p>
            <p className="text-[0.85rem] text-ash font-light leading-relaxed mb-6">
              {t('ringMethod2Body')}
            </p>

            <p className="text-[10px] tracking-[0.2em] uppercase text-ash/60 mb-3">
              {t('ringTableTitle')}
            </p>
            <table className="w-full text-[0.82rem] font-light border-collapse">
              <thead>
                <tr className="border-b border-charcoal/15 text-ash/70">
                  <th className="text-left py-2 font-light">{t('ringColCircumference')}</th>
                  <th className="text-left py-2 font-light">{t('ringColUS')}</th>
                  <th className="text-left py-2 font-light">{t('ringColUK')}</th>
                </tr>
              </thead>
              <tbody>
                {RING_TABLE.map((r) => (
                  <tr key={r.us} className="border-b border-charcoal/8 text-charcoal">
                    <td className="py-2">{r.mm} mm</td>
                    <td className="py-2">{r.us}</td>
                    <td className="py-2">{r.uk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-[0.78rem] text-ash/70 font-light leading-relaxed">
              {t('ringNote')}
            </p>
          </div>

          <div>
            <p className="eyebrow mb-6">{t('braceletTab')}</p>
            <p className="text-[0.9rem] text-charcoal font-light leading-relaxed mb-2">
              {t('braceletMethodTitle')}
            </p>
            <p className="text-[0.85rem] text-ash font-light leading-relaxed mb-6">
              {t('braceletMethodBody')}
            </p>

            <p className="text-[10px] tracking-[0.2em] uppercase text-ash/60 mb-3">
              {t('braceletTableTitle')}
            </p>
            <table className="w-full text-[0.82rem] font-light border-collapse">
              <thead>
                <tr className="border-b border-charcoal/15 text-ash/70">
                  <th className="text-left py-2 font-light">{t('braceletColWrist')}</th>
                  <th className="text-left py-2 font-light">{t('braceletColSize')}</th>
                </tr>
              </thead>
              <tbody>
                {WRIST_TABLE.map((w) => (
                  <tr key={w.label} className="border-b border-charcoal/8 text-charcoal">
                    <td className="py-2">{w.cm} cm</td>
                    <td className="py-2">{w.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-[0.78rem] text-ash/70 font-light leading-relaxed">
              {t('braceletNote')}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
