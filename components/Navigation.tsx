'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
import BagIcon from './BagIcon';
import WishlistIcon from './WishlistIcon';
import MobileSearchPanel from './MobileSearchPanel';
import AnnouncementBar, { type AnnouncementItem } from './AnnouncementBar';

const SHOP_CATEGORIES = [
  { key: 'rings', category: 'ring' },
  { key: 'braceletChain', category: 'braceletChain' },
  { key: 'braceletBead', category: 'braceletBead' },
  { key: 'necklaces', category: 'necklace' },
  { key: 'pendants', category: 'pendant' },
  { key: 'bangles', category: 'bangle' }
] as const;

const ourWorldLinks = [
  { href: '/journal', key: 'journal' },
  { href: '/membership', key: 'membership' },
  { href: '/worn-by-you', key: 'gallery' },
  { href: '/brand-story', key: 'about' },
  { href: '/founders', key: 'founders' },
  { href: '/responsible-craftsmanship', key: 'ourCommitment' }
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
    <div className="relative flex h-4 items-center" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`inline-flex h-4 items-center leading-none bg-transparent border-none p-0 cursor-pointer text-[11px] tracking-[0.28em] uppercase font-light transition-colors duration-500 ${
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

export default function Navigation({
  searchPanelTiles,
  collectionNames,
  announcementItems = []
}: {
  searchPanelTiles?: { href?: string; imageUrl?: string; title?: string; ctaLabel?: string }[];
  collectionNames: string[];
  announcementItems?: AnnouncementItem[];
}) {
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
  const [searchOpen, setSearchOpen] = useState(false);

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
    return <AnnouncementBar items={announcementItems} />;
  }

  return (
    <>
    <AnnouncementBar items={announcementItems} />
    <header
      className={`fixed top-7 inset-x-0 z-50 transition-all duration-700 ease-editorial ${
        scrolled
          ? 'bg-ivory border-b border-charcoal/10 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      {/* Centered wordmark -- hidden only during the homepage's very first
          (unscrolled) view, where the hero already carries the full logo
          mark; visible the moment you scroll on the homepage, and on
          every other page regardless of scroll, so there's always a way
          back to the homepage now that the corner logo is gone. */}
      {(!isHome || scrolled) && (
        <Link
          href="/#top"
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[1.05rem] md:text-[1.15rem] tracking-[0.42em] uppercase whitespace-nowrap ${
            scrolled ? 'text-charcoal' : 'text-ivory'
          } transition-colors duration-700`}
        >
          Siren&nbsp;Tears
        </Link>
      )}

      <div className="mx-auto max-w-[1480px] px-6 md:px-12 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <MobileMenu
            dark={scrolled}
            searchPanelTiles={searchPanelTiles}
            collectionNames={collectionNames}
          />

          <nav className="hidden lg:flex items-center gap-8">
            <NavDropdown label={t('collections')} scrolled={scrolled}>
              <div className="space-y-2.5">
                {collectionNames.map((name) => (
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

            <Link
              href="/bespoke"
              className={`inline-flex h-4 items-center leading-none text-[11px] tracking-[0.28em] uppercase font-light transition-colors duration-500 ${
                scrolled ? 'text-charcoal/70 hover:text-charcoal' : 'text-ivory/80 hover:text-ivory'
              }`}
            >
              {t('bespoke')}
            </Link>

            <NavDropdown label={t('ourWorld')} scrolled={scrolled}>
              <div className="space-y-2.5">
                {ourWorldLinks.map((l) => (
                  <Link
                    key={l.key}
                    href={l.href}
                    className="block text-[0.85rem] text-charcoal/80 hover:text-charcoal font-light whitespace-nowrap"
                  >
                    {t(l.key)}
                  </Link>
                ))}
              </div>
            </NavDropdown>
          </nav>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label={t('search')}
            className={`hidden lg:inline-flex transition-colors duration-500 ${
              scrolled ? 'text-charcoal/70 hover:text-charcoal' : 'text-ivory/80 hover:text-ivory'
            }`}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.3" />
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
          <Link
            href="/contact"
            className={`hidden md:inline-flex items-center leading-none text-[11px] tracking-[0.28em] uppercase font-light transition-colors duration-500 ${
              scrolled ? 'text-charcoal/70 hover:text-charcoal' : 'text-ivory/80 hover:text-ivory'
            }`}
          >
            {t('enquire')}
          </Link>
          <Link
            href="/account/orders"
            className={`hidden md:inline-flex items-center leading-none text-[11px] tracking-[0.28em] uppercase font-light transition-colors duration-500 ${
              scrolled ? 'text-charcoal/70 hover:text-charcoal' : 'text-ivory/80 hover:text-ivory'
            }`}
          >
            {t('myOrders')}
          </Link>
          <Link
            href="/account"
            className={`hidden md:inline-flex items-center leading-none text-[11px] tracking-[0.28em] uppercase font-light transition-colors duration-500 ${
              scrolled ? 'text-charcoal/70 hover:text-charcoal' : 'text-ivory/80 hover:text-ivory'
            }`}
          >
            {t('account')}
          </Link>
          <LanguageSwitcher light={light} />
          <WishlistIcon light={light} />
          <BagIcon light={light} />
        </div>
      </div>
    </header>
      <MobileSearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} tiles={searchPanelTiles} />
    </>
  );
}
