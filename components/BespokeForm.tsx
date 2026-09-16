'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import SizeGuideTrigger from './SizeGuideTrigger';

const ZODIAC_RANGES: { name: string; start: [number, number]; end: [number, number] }[] = [
  { name: 'Capricorn', start: [12, 22], end: [1, 19] },
  { name: 'Aquarius', start: [1, 20], end: [2, 18] },
  { name: 'Pisces', start: [2, 19], end: [3, 20] },
  { name: 'Aries', start: [3, 21], end: [4, 19] },
  { name: 'Taurus', start: [4, 20], end: [5, 20] },
  { name: 'Gemini', start: [5, 21], end: [6, 20] },
  { name: 'Cancer', start: [6, 21], end: [7, 22] },
  { name: 'Leo', start: [7, 23], end: [8, 22] },
  { name: 'Virgo', start: [8, 23], end: [9, 22] },
  { name: 'Libra', start: [9, 23], end: [10, 22] },
  { name: 'Scorpio', start: [10, 23], end: [11, 21] },
  { name: 'Sagittarius', start: [11, 22], end: [12, 21] }
];

function zodiacFromDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const match = ZODIAC_RANGES.find(({ start, end }) => {
    const afterStart = m > start[0] || (m === start[0] && day >= start[1]);
    const beforeEnd = m < end[0] || (m === end[0] && day <= end[1]);
    if (start[0] > end[0]) return afterStart || beforeEnd; // wraps year (Capricorn)
    return afterStart && beforeEnd;
  });
  return match?.name ?? '';
}

const COLOURS = ['pink', 'white', 'red', 'yellow', 'purple', 'green', 'blue', 'brown', 'orange'] as const;
const STYLES = ['silver', 'gold'] as const;
const PIECE_TYPES_BY_TRACK: Record<'beaded' | 'gemstone', readonly string[]> = {
  beaded: ['bracelet', 'necklace', 'other'],
  gemstone: ['ring', 'pendant', 'other']
};
const WHATSAPP_NUMBER = '64274326262';

export default function BespokeForm({ track }: { track: 'beaded' | 'gemstone' }) {
  const t = useTranslations('bespoke.form');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [birthday, setBirthday] = useState('');
  const pieceTypes = PIECE_TYPES_BY_TRACK[track];
  const [pieceType, setPieceType] = useState<string>(pieceTypes[0]);
  const [colours, setColours] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [requestId, setRequestId] = useState('');
  const [copied, setCopied] = useState(false);

  const zodiac = useMemo(() => zodiacFromDate(birthday), [birthday]);

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get('name')?.toString() || '',
      email: form.get('email')?.toString() || '',
      gender: form.get('gender')?.toString() || '',
      birthday,
      zodiac,
      productionTrack: track,
      pieceType,
      wristSize: pieceType === 'bracelet' ? form.get('wristSize')?.toString() || '' : '',
      ringSize: pieceType === 'ring' ? form.get('ringSize')?.toString() || '' : '',
      colours,
      styles,
      note: form.get('note')?.toString() || ''
    };

    try {
      const res = await fetch('/api/bespoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || t('errorGeneric'));
        setStatus('error');
        return;
      }
      setRequestId(data.id || '');
      setStatus('success');
    } catch {
      setErrorMsg(t('errorGeneric'));
      setStatus('error');
    }
  }

  if (status === 'success') {
    const shareLink =
      requestId && typeof window !== 'undefined'
        ? `${window.location.origin}/bespoke/request/${requestId}`
        : '';

    function copyLink() {
      if (!shareLink) return;
      navigator.clipboard.writeText(shareLink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }

    return (
      <div className="text-center py-16">
        <p className="serif-display text-[1.8rem] font-light mb-5 text-charcoal">
          {t('successTitle')}
        </p>
        <p className="text-[0.95rem] leading-[1.9] text-ash font-light max-w-md mx-auto mb-8">
          {t('successBody')}
        </p>

        {shareLink && (
          <div className="max-w-md mx-auto border border-charcoal/12 bg-ivory p-6 mb-8">
            <p className="text-[10px] tracking-[0.24em] uppercase text-ash/60 mb-3">
              {t('shareLinkLabel')}
            </p>
            <p className="text-[0.82rem] text-charcoal font-light break-all mb-4">{shareLink}</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <button
                type="button"
                onClick={copyLink}
                className="text-[11px] tracking-[0.28em] uppercase text-charcoal link-underline"
              >
                {copied ? t('linkCopied') : t('copyLink')}
              </button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `${t('whatsappPrefix')} ${shareLink}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] tracking-[0.28em] uppercase text-gold link-underline"
              >
                {t('contactNowCta')}
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  const inputClass =
    'w-full bg-white border border-charcoal/20 focus:border-charcoal outline-none px-3.5 py-2.5 text-[0.8rem] font-light text-charcoal placeholder:text-ash/60 placeholder:uppercase placeholder:tracking-[0.08em] placeholder:text-[0.7rem] transition-colors';
  const labelClass = 'block text-[9px] tracking-[0.2em] uppercase text-ash/70 mb-1.5 font-light';
  const chipBase =
    'text-[11px] tracking-[0.16em] uppercase font-light px-4 py-2 border transition-colors';

  return (
    <form onSubmit={handleSubmit} className="reveal">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
        <div>
          <input name="name" type="text" required placeholder={`${t('nameLabel')} *`} className={inputClass} />
        </div>
        <div>
          <input name="email" type="email" required placeholder={`${t('emailLabel')} *`} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('genderLabel')}</label>
          <select name="gender" className={inputClass}>
            <option value="female">{t('genders.female')}</option>
            <option value="male">{t('genders.male')}</option>
            <option value="other">{t('genders.other')}</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>{t('birthdayLabel')}</label>
          <input
            name="birthday"
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className={inputClass}
          />
        </div>
        {zodiac && (
          <div className="md:col-span-2 -mt-2">
            <p className="text-[0.82rem] text-gold font-light">
              {t('zodiacLabel')}: {zodiac}
            </p>
          </div>
        )}

        <div className="md:col-span-2">
          <label className={labelClass}>{t('pieceTypeLabel')}</label>
          <div className="flex flex-wrap gap-3">
            {pieceTypes.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPieceType(p)}
                className={`${chipBase} ${
                  pieceType === p
                    ? 'border-charcoal text-charcoal bg-sandLight/40'
                    : 'border-charcoal/20 text-ash hover:border-charcoal/40'
                }`}
              >
                {t(`pieceTypes.${p}`)}
              </button>
            ))}
          </div>
        </div>

        {pieceType === 'bracelet' && (
          <div>
            <input name="wristSize" type="text" inputMode="decimal" placeholder={t('wristSizeLabel')} className={inputClass} />
            <SizeGuideTrigger type="bracelet" />
          </div>
        )}
        {pieceType === 'ring' && (
          <div>
            <input name="ringSize" type="text" placeholder={t('ringSizeLabel')} className={inputClass} />
            <SizeGuideTrigger type="ring" />
          </div>
        )}

        <div className="md:col-span-2">
          <label className={labelClass}>{t('coloursLabel')}</label>
          <div className="flex flex-wrap gap-3">
            {COLOURS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggle(colours, c, setColours)}
                className={`${chipBase} ${
                  colours.includes(c)
                    ? 'border-charcoal text-charcoal bg-sandLight/40'
                    : 'border-charcoal/20 text-ash hover:border-charcoal/40'
                }`}
              >
                {t(`colours2.${c}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>{t('styleLabel')}</label>
          <div className="flex flex-wrap gap-3">
            {STYLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggle(styles, s, setStyles)}
                className={`${chipBase} ${
                  styles.includes(s)
                    ? 'border-charcoal text-charcoal bg-sandLight/40'
                    : 'border-charcoal/20 text-ash hover:border-charcoal/40'
                }`}
              >
                {t(`styles.${s}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <textarea name="note" rows={3} placeholder={t('noteLabel')} className={`${inputClass} resize-none`} />
        </div>
      </div>

      {status === 'error' && (
        <p className="mt-6 text-[0.85rem] text-red-700/80 font-light">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-10 text-[11px] tracking-[0.32em] uppercase text-ivory bg-charcoal px-10 py-4 hover:bg-charcoal/85 transition-colors disabled:opacity-60"
      >
        {status === 'submitting' ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
