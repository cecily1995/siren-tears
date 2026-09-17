'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/routing';
import WishlistButton from './WishlistButton';
import { useHorizontalSwipeLock } from '@/lib/useHorizontalSwipeLock';

type Product = {
  _id: string;
  name?: string;
  slug?: { current?: string };
  stone?: string;
  price?: number;
  images?: { url?: string; alt?: string }[];
};

type Labels = {
  eyebrow: string;
  title: string;
  intro?: string;
  oneOfOne: string;
  cta: string;
  viewAll?: string;
};

const AUTO_ADVANCE_MS = 2600;
const RESUME_AFTER_MS = 3500;
const SWIPE_THRESHOLD = 40;

export default function AotearoaTeaser({
  items,
  labels,
  bannerImageUrl
}: {
  items: Product[];
  labels: Labels;
  bannerImageUrl?: string;
}) {
  const slides = items.slice(0, 8);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartX = useRef<number | null>(null);
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [slides.length, paused]);

  // Pausing is temporary: any interaction (a swipe, a click, just resting a
  // finger on it) pauses the auto-advance, but it always resumes on its
  // own a few seconds after the *last* interaction, rather than staying
  // paused forever the moment someone so much as touches it.
  function pauseThenResume() {
    setPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setPaused(false), RESUME_AFTER_MS);
  }

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  if (!slides.length) return null;

  function offsetOf(i: number) {
    const n = slides.length;
    let raw = i - active;
    if (raw > n / 2) raw -= n;
    if (raw < -n / 2) raw += n;
    return raw;
  }

  function goTo(i: number) {
    setActive(((i % slides.length) + slides.length) % slides.length);
    pauseThenResume();
  }

  function handleDragStart(x: number) {
    dragStartX.current = x;
    dragging.current = true;
    pauseThenResume();
  }
  function handleDragEnd(x: number) {
    if (!dragging.current || dragStartX.current === null) return;
    const delta = x - dragStartX.current;
    if (delta > SWIPE_THRESHOLD) goTo(active - 1);
    else if (delta < -SWIPE_THRESHOLD) goTo(active + 1);
    dragging.current = false;
    dragStartX.current = null;
  }

  useHorizontalSwipeLock(containerRef, () => undefined);

  return (
    <section className="bg-pearl pt-6 pb-14 md:pt-8 md:pb-20 overflow-hidden">
      {/* Full-bleed banner: photo with title/intro/CTA overlaid. The photo,
          the AOTEAROA wordmark, and "View All" are all separate links to
          the same destination -- three ways in, one place they go. */}
      <div className="relative mx-auto max-w-[1480px] px-6 md:px-12 mb-10 md:mb-16 reveal">
        <Link
          href="/shop?line=aotearoa"
          className="relative block aspect-[3/4] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-charcoal/5 group"
        >
          <img
            src={bannerImageUrl || '/images/aotearoa-banner.jpg'}
            alt="Aotearoa gemstone jewellery, worn by the sea"
            className="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.03]"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(20,24,26,0.34) 0%, rgba(20,24,26,0.05) 45%, rgba(20,24,26,0.12) 100%)' }}
          />
          <div
            className="absolute inset-0 flex flex-col justify-start px-6 py-8 md:px-14 md:py-14 text-ivory"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            <span className="serif-display font-light uppercase tracking-[0.06em] text-[2.6rem] md:text-[clamp(2.4rem,4.2vw,4rem)] leading-none mb-3 md:mb-5">
              {labels.eyebrow}
            </span>
            <span className="text-[1.05rem] md:text-[1.2rem] font-light leading-[1.5] max-w-[420px]">
              {labels.title}
            </span>
            {labels.intro && (
              <span className="mt-1 text-[1.05rem] md:text-[1.2rem] font-light leading-[1.5] max-w-[420px]">
                {labels.intro}
              </span>
            )}
          </div>
          <span
            className="absolute bottom-6 left-6 md:bottom-10 md:left-14 text-[14px] md:text-[13px] tracking-[0.32em] uppercase text-ivory link-underline"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            {labels.cta}
          </span>
        </Link>
      </div>

      {/* 3D coverflow carousel -- the active piece sits centered and large;
          neighbours recede into perspective on either side. Advances
          automatically on a loop, resuming a few seconds after any
          interaction (click, drag, touch) rather than staying paused
          forever the moment someone touches it. Drag/swipe left-right to
          move through it manually. */}
      <div
        ref={containerRef}
        className="relative mx-auto max-w-[1480px] px-6 select-none"
        style={{ perspective: '1400px' }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseUp={(e) => handleDragEnd(e.clientX)}
        onMouseLeave={() => {
          dragging.current = false;
          dragStartX.current = null;
        }}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
      >
        <div className="relative mx-auto w-[52%] sm:w-[38%] md:w-[26%] lg:w-[22%] aspect-[3/4]">
          {slides.map((p, i) => {
            const offset = offsetOf(i);
            const abs = Math.abs(offset);
            if (abs > 2) return null;

            const translateX = offset * 108;
            const scale = abs === 0 ? 1 : abs === 1 ? 0.74 : 0.54;
            const rotateY = abs === 0 ? 0 : offset > 0 ? -32 : 32;
            const opacity = abs === 0 ? 1 : abs === 1 ? 0.55 : 0.22;
            const zIndex = 10 - abs;

            return (
              <div
                key={p._id}
                className="absolute inset-0 transition-all duration-[1100ms]"
                style={{
                  transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
                  opacity,
                  zIndex,
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              >
                {abs === 0 ? (
                  <Link
                    href={`/shop/${p.slug?.current ?? ''}`}
                    className="relative block w-full h-full overflow-hidden bg-charcoal/5 shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
                    onClick={(e) => {
                      if (dragging.current) e.preventDefault();
                    }}
                  >
                    {p.images?.[0]?.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.images[0].url}
                        alt={p.images[0].alt || p.name || ''}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <WishlistButton
                      productId={p._id}
                      slug={p.slug?.current ?? ''}
                      name={p.name ?? ''}
                      price={p.price}
                      imageUrl={p.images?.[0]?.url}
                    />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={p.name || 'Product'}
                    className="block w-full h-full overflow-hidden bg-charcoal/5"
                  >
                    {p.images?.[0]?.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.images[0].url}
                        alt={p.images[0].alt || p.name || ''}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Quiet position dots -- editorial, not a loud slider UI. */}
        <div className="mt-6 md:mt-8 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-[3px] rounded-full transition-all duration-500 ${
                i === active ? 'w-6 bg-charcoal' : 'w-[3px] bg-charcoal/25'
              }`}
            />
          ))}
        </div>

        <div className="mt-6 md:mt-8 text-center">
          <Link
            href="/shop?line=aotearoa"
            className="text-[11px] tracking-[0.32em] uppercase text-charcoal link-underline"
          >
            {labels.viewAll || labels.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
