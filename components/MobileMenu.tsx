'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';

const COLLECTION_NAMES = [
  'Mosaic',
  'Last Queen',
  'Golden Age',
  "Siren's Chain",
  'Violet Hour',
  'One Hue'
];

const SHOP_CATEGORIES = [
  { key: 'rings', category: 'ring' },
  { key: 'braceletChain', category: 'braceletChain' },
  { key: 'braceletBead', category: 'braceletBead' },
  { key: 'necklaces', category: 'necklace' },
  { key: 'pendants', category: 'pendant' },
  { key: 'bangles', category: 'bangle' }
] as const;

const simpleLinks = [
  { href: '/new-arrivals', key: 'newArrivals' },
  { href: '/journal', key: 'journal' },
  { href: '/worn-by-you', key: 'gallery' },
  { href: '/bespoke', key: 'bespoke' },
  { href: '/membership', key: 'membership' }
] as const;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
      aria-hidden="true"
    >
      <path d="M2 1L8.5 5.5L2 10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MobileMenu({ dark }: { dark: boolean }) {
  const t = useTranslations('nav');
  const tShop = useTranslations('shop');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<'collections' | 'shop' | null>(null);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [member, setMember] = useState<{
    firstName?: string;
    isMember?: boolean;
    memberCode?: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Re-check every time the menu opens (not just once on first mount) --
    // otherwise logging in or completing a purchase in the same session
    // wouldn't be reflected here until a full page reload.
    if (!open) return;
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => setMember(data?.member ?? null))
      .catch(() => setMember(null));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  function closeAll() {
    setOpen(false);
    setExpanded(null);
    setSearchOpen(false);
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    closeAll();
  }

  const itemClass =
    'flex items-center justify-between w-full py-3.5 text-left serif-display text-[1.05rem] font-light text-charcoal';
  const subItemClass =
    'block py-2.5 text-[0.85rem] tracking-[0.05em] uppercase text-ash font-light';

  const panel = (
    <div
      className={`fixed inset-0 z-[999] transition-transform duration-[400ms] ease-editorial flex flex-col ${
        open ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
      }`}
      style={{ backgroundColor: '#ffffff' }}
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between px-6 py-6 shrink-0 border-b border-charcoal/10">
        <span className="font-serif text-[1.05rem] tracking-[0.42em] uppercase text-charcoal">
          Siren&nbsp;Tears
        </span>
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setSearchOpen((s) => !s)}
            aria-label="Search"
            className="w-8 h-8 flex items-center justify-center text-charcoal"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
              <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={closeAll}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center text-charcoal"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={submitSearch} className="px-6 py-4 border-b border-charcoal/10 shrink-0">
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tShop('searchPlaceholder')}
            className="w-full bg-transparent border-b border-charcoal/25 focus:border-gold outline-none py-2 text-[0.95rem] font-light text-charcoal placeholder:text-ash/50"
          />
        </form>
      )}

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-10">
        {/* Collections — expandable */}
        <div className="border-b border-charcoal/10">
          <button
            type="button"
            className={itemClass}
            onClick={() => setExpanded(expanded === 'collections' ? null : 'collections')}
          >
            {t('collections')}
            <Chevron open={expanded === 'collections'} />
          </button>
          {expanded === 'collections' && (
            <div className="pb-4 pl-1">
              {COLLECTION_NAMES.map((name) => (
                <Link
                  key={name}
                  href={`/shop?line=beaded&collection=${encodeURIComponent(name)}`}
                  onClick={closeAll}
                  className={subItemClass}
                >
                  {name}
                </Link>
              ))}
              <Link href="/shop?line=aotearoa" onClick={closeAll} className={subItemClass}>
                {tShop('lineFilters.aotearoa')}
              </Link>
              <Link
                href="/collections"
                onClick={closeAll}
                className="block mt-3 pt-3 border-t border-charcoal/10 text-[0.8rem] tracking-[0.08em] uppercase text-charcoal font-light link-underline w-fit"
              >
                {t('collections')} →
              </Link>
            </div>
          )}
        </div>

        {/* Shop — expandable */}
        <div className="border-b border-charcoal/10">
          <button
            type="button"
            className={itemClass}
            onClick={() => setExpanded(expanded === 'shop' ? null : 'shop')}
          >
            {t('shop')}
            <Chevron open={expanded === 'shop'} />
          </button>
          {expanded === 'shop' && (
            <div className="pb-4 pl-1">
              <Link href="/shop" onClick={closeAll} className={subItemClass}>
                {tShop('filters.all')}
              </Link>
              {SHOP_CATEGORIES.map((c) => (
                <Link
                  key={c.key}
                  href={`/shop?category=${c.category}`}
                  onClick={closeAll}
                  className={subItemClass}
                >
                  {tShop(`filters.${c.key}`)}
                </Link>
              ))}
              <Link href="/shop?category=archive" onClick={closeAll} className={subItemClass}>
                {tShop('filters.archive')}
              </Link>
            </div>
          )}
        </div>

        {/* Simple links */}
        {simpleLinks.map((l) => (
          <Link
            key={l.key}
            href={l.href}
            onClick={closeAll}
            className={`${itemClass} border-b border-charcoal/10`}
          >
            {t(l.key)}
          </Link>
        ))}

        <div className="mt-8 flex flex-col gap-4">
          <Link
            href="/founders"
            onClick={closeAll}
            className="text-[11px] tracking-[0.32em] uppercase text-ash"
          >
            {t('founders')}
          </Link>
          <Link
            href="/responsible-craftsmanship"
            onClick={closeAll}
            className="text-[11px] tracking-[0.32em] uppercase text-ash"
          >
            {t('ourCommitment')}
          </Link>
          <Link
            href="/contact"
            onClick={closeAll}
            className="text-[11px] tracking-[0.32em] uppercase text-ash"
          >
            {t('enquire')}
          </Link>
          {member === null ? (
            <Link
              href="/account"
              onClick={closeAll}
              className="text-[11px] tracking-[0.32em] uppercase text-ash"
            >
              {t('signIn')}
            </Link>
          ) : member.isMember ? (
            <Link href="/account" onClick={closeAll} className="text-[11px] tracking-[0.32em] uppercase">
              <span className="text-charcoal">{member.firstName || t('account')}</span>
              {member.memberCode && <span className="text-gold"> · {member.memberCode}</span>}
            </Link>
          ) : (
            <Link
              href="/account"
              onClick={closeAll}
              className="text-[11px] tracking-[0.32em] uppercase text-charcoal"
            >
              {member.firstName || t('account')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );

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

      {/* Rendered via portal directly under <body>, so it is never nested
          inside the fixed, backdrop-filter'd header -- an ancestor with a
          transform/filter/backdrop-filter creates a new containing block for
          position:fixed descendants, which was clipping this panel down to
          the header's own small bounding box instead of the full viewport. */}
      {mounted && createPortal(panel, document.body)}
    </div>
  );
}
