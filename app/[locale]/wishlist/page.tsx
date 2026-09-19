'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import InlineLoginForm from '@/components/InlineLoginForm';
import { useWishlist } from '@/lib/wishlist-context';
import Money from '@/components/Money';

function CloseButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push('/');
      }}
      aria-label="Close"
      className="fixed top-[72px] right-6 md:top-24 md:right-10 z-[60] w-8 h-8 flex items-center justify-center text-charcoal/60 hover:text-charcoal"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function CompactHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="relative px-6 md:px-12 pt-[72px] md:pt-24 pb-5 md:pb-6 max-w-[820px] mx-auto text-left">
      <CloseButton />
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="serif-display text-[1.6rem] md:text-[2rem] font-light text-charcoal">{title}</h1>
      {intro && <p className="mt-3 text-[0.9rem] leading-[1.7] text-ash font-light max-w-lg">{intro}</p>}
    </div>
  );
}

export default function WishlistPage() {
  const t = useTranslations('wishlist');
  const { items, remove } = useWishlist();
  const [statusBySlug, setStatusBySlug] = useState<Record<string, string>>({});
  const [authChecked, setAuthChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setLoggedIn(Boolean(data.member));
      })
      .catch(() => {
        /* treat a failed check as logged out */
      })
      .finally(() => {
        if (!cancelled) setAuthChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!items.length) return;
    const slugs = items.map((i) => i.slug).filter(Boolean).join(',');
    fetch(`/api/wishlist-status?slugs=${encodeURIComponent(slugs)}`)
      .then((res) => res.json())
      .then((data) => {
        const map: Record<string, string> = {};
        (data.products || []).forEach((p: { slug: string; status?: string }) => {
          if (p.status) map[p.slug] = p.status;
        });
        setStatusBySlug(map);
      })
      .catch(() => {
        /* fine -- just won't show live sold status */
      });
  }, [items]);

  if (!authChecked) {
    return (
      <div className="relative min-h-[60vh]">
        <CloseButton />
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <>
        <CompactHeader eyebrow={t('eyebrow')} title={t('title')} />
        <section className="bg-ivory px-6 md:px-12">
          <InlineLoginForm onSuccess={() => setLoggedIn(true)} />
        </section>
      </>
    );
  }

  return (
    <>
      <CompactHeader eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />
      <section className="bg-ivory px-6 md:px-12 py-10 md:py-14">
        <div className="mx-auto max-w-[1200px]">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[0.95rem] text-ash font-light mb-6">{t('empty')}</p>
              <Link
                href="/shop"
                className="text-[11px] tracking-[0.3em] uppercase text-charcoal link-underline"
              >
                {t('discoverCta')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {items.map((item) => {
                const liveStatus = statusBySlug[item.slug];
                const isSold = liveStatus === 'sold';
                const isReserved = liveStatus === 'reserved';
                return (
                  <div key={item.productId} className="reveal">
                    <Link href={`/shop/${item.slug}`} className="group block">
                      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/5 frame-zoom">
                        {item.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className={`bg-img w-full h-full object-cover transition-all duration-700 ${
                              isSold ? 'grayscale opacity-70' : ''
                            }`}
                          />
                        )}
                        {(isSold || isReserved) && (
                          <span className="absolute top-3 left-3 bg-ivory/95 text-charcoal text-[10px] tracking-[0.24em] uppercase px-3 py-1.5 font-light">
                            {isSold ? t('sold') : t('reserved')}
                          </span>
                        )}
                      </div>
                      <div className="mt-4">
                        <h3 className="serif-display text-[1.05rem] font-light text-charcoal leading-tight">
                          {item.name}
                        </h3>
                        {typeof item.price === 'number' && (
                          <p className="mt-1 text-[0.9rem] text-charcoal font-light"><Money amount={item.price} /></p>
                        )}
                      </div>
                    </Link>
                    <div className="mt-2 flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => remove(item.productId)}
                        className="text-[10px] tracking-[0.2em] uppercase text-ash/60 hover:text-charcoal link-underline"
                      >
                        {t('remove')}
                      </button>
                      {isSold && (
                        <Link
                          href="/shop"
                          className="text-[10px] tracking-[0.2em] uppercase text-gold hover:text-gold/80 link-underline"
                        >
                          {t('discoverAnother')}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
