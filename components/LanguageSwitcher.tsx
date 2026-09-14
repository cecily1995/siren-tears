'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, getPathname, localeNames, localeShortNames } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';

const locales: Locale[] = ['en', 'zh', 'fr', 'de', 'ru', 'ko', 'ja', 'it'];

export default function LanguageSwitcher({ light }: { light: boolean }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const baseTextClass = light ? 'text-ivory/80 hover:text-ivory' : 'text-charcoal/70 hover:text-charcoal';
  const borderClass = light ? 'border-ivory/30 hover:border-ivory/60' : 'border-charcoal/20 hover:border-charcoal/40';
  const panelClass = light
    ? 'bg-charcoal/95 backdrop-blur-md border border-ivory/15 text-ivory'
    : 'bg-pearl/95 backdrop-blur-md border border-charcoal/10 text-charcoal';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`inline-flex items-center gap-2 px-3 py-1.5 border ${borderClass} ${baseTextClass} text-[11px] tracking-[0.28em] uppercase font-light transition-colors duration-500`}
      >
        <span>{localeShortNames[locale]}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
          className={`transition-transform duration-500 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className={`absolute right-0 top-full mt-3 w-44 ${panelClass} shadow-[0_30px_60px_-20px_rgba(38,35,31,0.35)] transition-all duration-500 ease-editorial origin-top-right ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        role="listbox"
        aria-label="Language"
      >
        <ul className="py-2">
          {locales.map((l) => {
            const isActive = l === locale;
            const href = getPathname({ href: pathname, locale: l });
            return (
              <li key={l}>
                <a
                  href={href}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => setOpen(false)}
                  className={`group w-full text-left px-5 py-2.5 flex items-center justify-between gap-3 text-[12px] font-light transition-colors duration-300 ${
                    light
                      ? isActive
                        ? 'text-ivory'
                        : 'text-ivory/65 hover:text-ivory'
                      : isActive
                        ? 'text-charcoal'
                        : 'text-charcoal/65 hover:text-charcoal'
                  }`}
                >
                  <span className="tracking-wide">{localeNames[l]}</span>
                  <span className={`text-[10px] tracking-[0.28em] uppercase ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                    {localeShortNames[l]}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
