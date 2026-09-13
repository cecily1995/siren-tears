'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

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
const PIECE_TYPES = ['bracelet', 'necklace', 'ring', 'pendant', 'other'] as const;

export default function BespokeForm() {
  const t = useTranslations('bespoke.form');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [birthday, setBirthday] = useState('');
  const [pieceType, setPieceType] = useState<(typeof PIECE_TYPES)[number]>('bracelet');
  const [colours, setColours] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);

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
      setStatus('success');
    } catch {
      setErrorMsg(t('errorGeneric'));
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-16">
        <p className="serif-display text-[1.8rem] font-light mb-5 text-charcoal">
          {t('successTitle')}
        </p>
        <p className="text-[0.95rem] leading-[1.9] text-ash font-light max-w-md mx-auto">
          {t('successBody')}
        </p>
      </div>
    );
  }

  const inputClass =
    'w-full bg-transparent border-b border-charcoal/20 focus:border-gold outline-none py-3 text-[0.95rem] font-light text-charcoal placeholder:text-ash/50 transition-colors';
  const labelClass = 'block text-[11px] tracking-[0.28em] uppercase text-ash mb-2 font-light';
  const chipBase =
    'text-[11px] tracking-[0.16em] uppercase font-light px-4 py-2 border transition-colors';

  return (
    <form onSubmit={handleSubmit} className="reveal">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        <div>
          <label className={labelClass}>{t('nameLabel')} *</label>
          <input name="name" type="text" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('emailLabel')} *</label>
          <input name="email" type="email" required className={inputClass} />
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
          <div className="md:col-span-2 -mt-4">
            <p className="text-[0.82rem] text-gold font-light">
              {t('zodiacLabel')}: {zodiac}
            </p>
          </div>
        )}

        <div className="md:col-span-2">
          <label className={labelClass}>{t('pieceTypeLabel')}</label>
          <div className="flex flex-wrap gap-3">
            {PIECE_TYPES.map((p) => (
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
            <label className={labelClass}>{t('wristSizeLabel')}</label>
            <input name="wristSize" type="text" inputMode="decimal" className={inputClass} />
          </div>
        )}
        {pieceType === 'ring' && (
          <div>
            <label className={labelClass}>{t('ringSizeLabel')}</label>
            <input name="ringSize" type="text" className={inputClass} />
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
          <label className={labelClass}>{t('noteLabel')}</label>
          <textarea name="note" rows={3} className={`${inputClass} resize-none`} />
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
