'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';

const SUGGESTED_TERMS = ['Crystal', 'Necklace', 'Ring', 'Bracelet', 'Aotearoa', 'Beaded'];

export default function MobileSearchPanel({
  open,
  onClose,
  tiles
}: {
  open: boolean;
  onClose: () => void;
  tiles?: { href?: string; imageUrl?: string; title?: string; ctaLabel?: string }[];
}) {
  const t = useTranslations('shop');
  const router = useRouter();
  const [query, setQuery] = useState('');

  function submit(term?: string) {
    const q = (term ?? query).trim();
    if (!q) return;
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    onClose();
    setQuery('');
  }

  return (
    <div
      className={`fixed inset-0 z-[998] transition-transform duration-[400ms] ease-editorial flex flex-col ${
        open ? 'translate-y-0 pointer-events-auto' : '-translate-y-full pointer-events-none'
      }`}
      style={{ backgroundColor: '#ffffff' }}
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between px-6 py-6 shrink-0 border-b border-charcoal/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex-1"
        >
          <input
            autoFocus={open}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-transparent border-b border-charcoal/25 focus:border-gold outline-none py-2 text-[0.95rem] font-light text-charcoal placeholder:text-ash/50"
          />
        </form>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="w-8 h-8 ml-4 flex items-center justify-center text-charcoal shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <p className="text-[10px] tracking-[0.2em] uppercase text-ash/60 font-light mb-3">
          {t('suggestedTerms')}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8">
          {SUGGESTED_TERMS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => submit(term)}
              className="text-[0.85rem] text-charcoal/75 hover:text-charcoal font-light"
            >
              {term}
            </button>
          ))}
        </div>

        {tiles && tiles.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {tiles.slice(0, 4).map((tile, i) => (
              <Link
                key={i}
                href={tile.href || '/shop'}
                onClick={onClose}
                className="relative block aspect-[3/4] overflow-hidden bg-charcoal/5"
              >
                {tile.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={tile.imageUrl} alt={tile.title || ''} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center border border-dashed border-charcoal/20">
                    <span className="text-[9px] tracking-[0.18em] uppercase text-ash/50 font-light text-center px-3">
                      {tile.title || 'Image coming soon'}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-charcoal/25" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
                  {tile.title && (
                    <span
                      className="serif-display text-[1rem] font-light text-ivory mb-3 leading-tight"
                      style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
                    >
                      {tile.title}
                    </span>
                  )}
                  {tile.ctaLabel && (
                    <span className="text-[9px] tracking-[0.18em] uppercase text-ivory bg-charcoal/70 px-3 py-1.5">
                      {tile.ctaLabel}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
