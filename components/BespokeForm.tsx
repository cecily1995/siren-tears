'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type ImageFile = { dataUrl: string; name: string };

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function BespokeForm() {
  const t = useTranslations('bespoke.form');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [imageError, setImageError] = useState('');

  const pieceTypes = ['bracelet', 'necklace', 'ring', 'pendant', 'other'] as const;
  const colours = ['white', 'blue', 'green', 'black', 'champagne', 'other'] as const;
  const budgets = ['b1', 'b2', 'b3', 'b4', 'b5'] as const;

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImageError('');
    const files = Array.from(e.target.files ?? []).slice(0, 6);
    try {
      const withDataUrls = await Promise.all(
        files.map(async (f) => ({ dataUrl: await fileToDataUrl(f), name: f.name }))
      );
      setImages(withDataUrls);
    } catch {
      setImageError(t('imageError'));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get('name')?.toString() || '',
      email: form.get('email')?.toString() || '',
      whatsapp: form.get('whatsapp')?.toString() || '',
      pieceType: form.get('pieceType')?.toString() || '',
      stone: form.get('stone')?.toString() || '',
      colour: form.get('colour')?.toString() || '',
      budget: form.get('budget')?.toString() || '',
      message: form.get('message')?.toString() || '',
      images
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
      <div className="text-center py-16 reveal">
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

  return (
    <form onSubmit={handleSubmit} className="reveal">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        <div>
          <label className={labelClass}>{t('nameLabel')}</label>
          <input name="name" type="text" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('emailLabel')} *</label>
          <input name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('whatsappLabel')}</label>
          <input name="whatsapp" type="tel" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('pieceTypeLabel')}</label>
          <select name="pieceType" className={inputClass}>
            {pieceTypes.map((p) => (
              <option key={p} value={p}>
                {t(`pieceTypes.${p}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>{t('stoneLabel')}</label>
          <input name="stone" type="text" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t('colourLabel')}</label>
          <select name="colour" className={inputClass}>
            {colours.map((c) => (
              <option key={c} value={c}>
                {t(`colours.${c}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>{t('budgetLabel')}</label>
          <select name="budget" className={inputClass}>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {t(`budgets.${b}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>{t('messageLabel')} *</label>
          <textarea
            name="message"
            required
            rows={5}
            placeholder={t('messagePlaceholder')}
            className={`${inputClass} resize-none`}
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>{t('imagesLabel')}</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block w-full text-[0.85rem] font-light text-ash file:mr-4 file:py-2 file:px-4 file:border file:border-charcoal/20 file:bg-transparent file:text-[11px] file:tracking-[0.2em] file:uppercase file:cursor-pointer"
          />
          <p className="mt-2 text-[0.8rem] text-ash/70 font-light">{t('imagesHint')}</p>
          {imageError && <p className="mt-2 text-[0.8rem] text-red-700/80">{imageError}</p>}
          {images.length > 0 && (
            <p className="mt-2 text-[0.8rem] text-gold">{images.length} {t('imagesSelected')}</p>
          )}
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
