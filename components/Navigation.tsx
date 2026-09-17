'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
import BagIcon from './BagIcon';
import WishlistIcon from './WishlistIcon';

const COLLECTION_NAMES = ['Mosaic', 'Last Queen', 'Golden Age', "Siren's Chain", 'Violet Hour', 'One Hue'];

const SHOP_CATEGORIES = [
  { key: 'rings', category: 'ring' },
  { key: 'braceletChain', category: 'braceletChain' },
  { key: 'braceletBead', category: 'braceletBead' },
  { key: 'necklaces', category: 'necklace' },
  { key: 'pendants', category: 'pendant' },
  { key: 'bangles', category: 'bangle' }
] as const;

const simpleLinks = [
  { href: '/journal', key: 'journal' },
  { href: '/worn-by-you', key: 'gallery' },
  { href: '/bespoke', key: 'bespoke' },
  { href: '/membership', key: 'membership' }
] as const;

function NavDropdown({
  label,
  scrolled,
  children
}: {
  label: string;
  scrolled: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`bg-transparent border-none p-0 cursor-pointer text-[11px] tracking-[0.28em] uppercase font-light transition-colors duration-500 ${
          scrolled ? 'text-charcoal/70 hover:text-charcoal' : 'text-ivory/80 hover:text-ivory'
        }`}
      >
        {label}
      </button>
      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-4 min-w-[220px] bg-ivory border border-charcoal/10 shadow-[0_16px_40px_rgba(0,0,0,0.1)] py-4 px-5 text-center"
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function Navigation() {
  const t = useTranslations('nav');
  const tShop = useTranslations('shop');
  const pathname = usePathname();
  // Only the homepage opens with a full-bleed dark Hero photo behind the
  // header, which is the one place a transparent/light-text nav actually
  // makes sense. Every other page has a light background from the very
  // top, so the header must be solid immediately -- otherwise light text
  // on transparent over a light page reads as "the header disappeared".
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const light = !scrolled;

  // Checkout and the order confirmation page get their own minimal header
  // (logo + bag icon only) -- the full site nav would be a distraction
  // during payment, per the checkout brief.
  if (pathname === '/checkout' || pathname.startsWith('/order-confirmation')) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ease-editorial ${
        scrolled
          ? 'bg-ivory border-b border-charcoal/10 py-4'
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
          <NavDropdown label={t('collections')} scrolled={scrolled}>
            <div className="space-y-2.5">
              {COLLECTION_NAMES.map((name) => (
                <Link
                  key={name}
                  href={`/shop?line=beaded&collection=${encodeURIComponent(name)}`}
                  className="block text-[0.85rem] text-charcoal/80 hover:text-charcoal font-light whitespace-nowrap"
                >
                  {name}
                </Link>
              ))}
              <Link
                href="/shop?line=aotearoa"
                className="block text-[0.85rem] text-charcoal/80 hover:text-charcoal font-light whitespace-nowrap"
              >
                {tShop('lineFilters.aotearoa')}
              </Link>
              <Link
                href="/collections"
                className="block mt-3 pt-3 border-t border-charcoal/10 text-[10px] tracking-[0.2em] uppercase text-charcoal font-light link-underline"
              >
                {t('collections')} →
              </Link>
            </div>
          </NavDropdown>

          <NavDropdown label={t('shop')} scrolled={scrolled}>
            <div className="space-y-2.5">
              <Link href="/shop" className="block text-[0.85rem] text-charcoal/80 hover:text-charcoal font-light whitespace-nowrap">
                {tShop('filters.all')}
              </Link>
              <Link
                href="/new-arrivals"
                className="block text-[0.85rem] text-gold hover:text-charcoal font-light whitespace-nowrap"
              >
                {t('newArrivals')}
              </Link>
              {SHOP_CATEGORIES.map((c) => (
                <Link
                  key={c.key}
                  href={`/shop?category=${c.category}`}
                  className="block text-[0.85rem] text-charcoal/80 hover:text-charcoal font-light whitespace-nowrap"
                >
                  {tShop(`filters.${c.key}`)}
                </Link>
              ))}
              <Link
                href="/shop?category=archive"
                className="block text-[0.85rem] text-charcoal/80 hover:text-charcoal font-light whitespace-nowrap"
              >
                {tShop('filters.archive')}
              </Link>
            </div>
          </NavDropdown>

          {simpleLinks.map((l) => (
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
            href="/contact"
            className={`hidden md:inline-block text-[11px] tracking-[0.28em] uppercase font-light transition-colors duration-500 ${
              scrolled ? 'text-charcoal/70 hover:text-charcoal' : 'text-ivory/80 hover:text-ivory'
            }`}
          >
            {t('enquire')}
          </Link>
          <LanguageSwitcher light={light} />
          <WishlistIcon light={light} />
          <BagIcon light={light} />
        </div>
      </div>
    </header>
  );
}
