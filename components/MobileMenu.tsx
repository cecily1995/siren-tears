'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const links = [
  { href: '/collections', key: 'collections' },
  { href: '/shop', key: 'shop' },
  { href: '/#journal', key: 'journal' },
  { href: '/worn-by-you', key: 'gallery' },
  { href: '/bespoke', key: 'bespoke' },
  { href: '/membership', key: 'membership' }
] as const;

export default function MobileMenu({ dark }: { dark: boolean }) {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="flex flex-col items-start justify-center gap-[5px] w-8 h-8 shrink-0"
      >
        <span className={`block h-px w-6 ${dark ? 'bg-charcoal' : 'bg-ivory'} transition-colors duration-500`} />
        <span className={`block h-px w-6 ${dark ? 'bg-charcoal' : 'bg-ivory'} transition-colors duration-500`} />
        <span className={`block h-px w-4 ${dark ? 'bg-charcoal' : 'bg-ivory'} transition-colors duration-500`} />
      </button>

      <div
        className={`fixed inset-0 z-[60] bg-ivory transition-transform duration-[400ms] ease-editorial ${
          open ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <span className="font-serif text-[1.05rem] tracking-[0.42em] uppercase text-charcoal">
            Siren&nbsp;Tears
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center text-charcoal"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col items-center justify-center gap-8 px-6 pt-10">
          {links.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              onClick={() => setOpen(false)}
              className="serif-display text-[1.6rem] font-light text-charcoal"
            >
              {t(l.key)}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="mt-6 text-[11px] tracking-[0.32em] uppercase text-ash"
          >
            {t('enquire')}
          </Link>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="text-[11px] tracking-[0.32em] uppercase text-ash"
          >
            {t('account')}
          </Link>
        </nav>
      </div>
    </div>
  );
}
