'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';

const links = [
  { href: '/#collections', key: 'collections' },
  { href: '/#story', key: 'featured' },
  { href: '/#journal', key: 'journal' },
  { href: '/gallery', key: 'gallery' },
  { href: '/custom', key: 'custom' },
  { href: '/shipping', key: 'shipping' },
  { href: '/#about', key: 'about' }
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
        <Link href="/#top" className="relative flex items-center shrink-0" aria-label="Siren Tears — Home">
          <Image
            src="/logo/siren-tears-logo-full.png"
            alt="Siren Tears"
            width={320}
            height={121}
            priority
            className={`h-9 md:h-11 w-auto transition-opacity duration-700 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
          />
          <Image
            src="/logo/siren-tears-logo-full-ivory.png"
            alt=""
            aria-hidden="true"
            width={320}
            height={121}
            priority
            className={`h-9 md:h-11 w-auto absolute left-0 top-1/2 -translate-y-1/2 transition-opacity duration-700 ${scrolled ? 'opacity-0' : 'opacity-100'}`}
          />
        </Link>

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
