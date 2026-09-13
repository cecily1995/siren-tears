'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';

const links = [
  { href: '/collections', key: 'collections' },
  { href: '/shop', key: 'shop' },
  { href: '/#journal', key: 'journal' },
  { href: '/worn-by-you', key: 'gallery' },
  { href: '/bespoke', key: 'bespoke' },
  { href: '/membership', key: 'membership' }
] as const;

export default function Navigation() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const light = !scrolled;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ease-editorial ${
        scrolled
          ? 'bg-ivory/90 backdrop-blur-md border-b border-charcoal/10 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto max-w-[1480px] px-6 md:px-12 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 shrink-0">
          <MobileMenu dark={scrolled} />
          <Link
            href="/#top"
            className={`font-serif text-[1.05rem] md:text-[1.15rem] tracking-[0.42em] uppercase shrink-0 ${
              scrolled ? 'text-charcoal' : 'text-ivory'
            } transition-colors duration-700`}
          >
            Siren&nbsp;Tears
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className={`text-[11px] tracking-[0.28em] uppercase font-light transition-colors duration-500 ${
                scrolled ? 'text-charcoal/70 hover:text-charcoal' : 'text-ivory/80 hover:text-ivory'
              }`}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <Link
            href="/account"
            className={`hidden md:inline-block text-[11px] tracking-[0.28em] uppercase font-light transition-colors duration-500 ${
              scrolled ? 'text-charcoal/70 hover:text-charcoal' : 'text-ivory/80 hover:text-ivory'
            }`}
          >
            {t('account')}
          </Link>
          <Link
            href="/#contact"
            className={`hidden md:inline-block text-[11px] tracking-[0.28em] uppercase font-light transition-colors duration-500 ${
              scrolled ? 'text-charcoal/70 hover:text-charcoal' : 'text-ivory/80 hover:text-ivory'
            }`}
          >
            {t('enquire')}
          </Link>
          <LanguageSwitcher light={light} />
        </div>
      </div>
    </header>
  );
}
