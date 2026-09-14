'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const RING_TABLE: { mm: string; us: string; uk: string }[] = [
  { mm: '14.1 / 44.2', us: '3', uk: 'F' },
  { mm: '14.9 / 46.8', us: '4', uk: 'H½' },
  { mm: '15.7 / 49.3', us: '5', uk: 'K½' },
  { mm: '16.5 / 51.9', us: '6', uk: 'M½' },
  { mm: '17.3 / 54.4', us: '7', uk: 'O½' },
  { mm: '18.1 / 57.0', us: '8', uk: 'Q½' },
  { mm: '18.9 / 59.5', us: '9', uk: 'S½' },
  { mm: '19.8 / 62.1', us: '10', uk: 'U½' }
];

const WRIST_TABLE: { cm: string; label: string }[] = [
  { cm: '14 – 15', label: 'XS' },
  { cm: '15 – 16', label: 'S' },
  { cm: '16 – 17.5', label: 'M' },
  { cm: '17.5 – 19', label: 'L' },
  { cm: '19 – 21', label: 'XL' }
];

function SizeGuideModal({
  initialTab,
  onClose
}: {
  initialTab: 'ring' | 'bracelet';
  onClose: () => void;
}) {
  const t = useTranslations('sizeGuide');
  const [tab, setTab] = useState<'ring' | 'bracelet'>(initialTab);

  const tabBtn = (active: boolean) =>
    `flex-1 py-3 text-[11px] tracking-[0.24em] uppercase font-light border-b-2 transition-colors ${
      active ? 'border-charcoal text-charcoal' : 'border-transparent text-ash/60 hover:text-ash'
    }`;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-charcoal/50 px-0 md:px-6"
      onClick={onClose}
    >
      <div
        className="bg-ivory w-full md:max-w-[560px] max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-ivory flex items-center justify-between px-6 pt-6 pb-2 border-b border-charcoal/10">
          <p className="eyebrow">{t('title')}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-charcoal/50 hover:text-charcoal text-xl leading-none px-1"
          >
            ×
          </button>
        </div>

        <div className="flex border-b border-charcoal/10">
          <button type="button" onClick={() => setTab('ring')} className={tabBtn(tab === 'ring')}>
            {t('ringTab')}
          </button>
          <button type="button" onClick={() => setTab('bracelet')} className={tabBtn(tab === 'bracelet')}>
            {t('braceletTab')}
          </button>
        </div>

        <div className="p-6 md:p-8">
          {tab === 'ring' ? (
            <>
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
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SizeGuideTrigger({
  type = 'ring',
  className
}: {
  type?: 'ring' | 'bracelet';
  className?: string;
}) {
  const t = useTranslations('sizeGuide');
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          'inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.18em] uppercase text-gold hover:text-gold/80 link-underline font-light mt-1.5'
        }
      >
        {t('triggerLabel')} →
      </button>
      {open && <SizeGuideModal initialTab={type} onClose={() => setOpen(false)} />}
    </>
  );
}
