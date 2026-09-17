'use client';

import { useEffect, useRef, useState } from 'react';

type SquareImage = { url?: string; alt?: string; placeholderLabel?: string };

const AUTO_SCROLL_MS = 3000;
const RESUME_AFTER_MS = 4000;

// Uses the browser's own native horizontal scrolling (overflow-x-auto) for
// the manual-swipe part rather than our custom drag machinery.
//
// Two real bugs from the previous version, fixed here:
// 1. `justify-center` on a scrollable flex row with overflowing content is
//    a known browser inconsistency -- it can leave the strip's initial
//    scroll position already near/at the end instead of at the start.
//    Removed; centering is left to the page's own wrapper instead.
// 2. Pausing was wired to the generic `scroll` event, which also fires for
//    scrolling *we* trigger programmatically (scrollBy/scrollTo) -- so
//    every auto-advance immediately re-paused itself, which is why it
//    never visibly auto-scrolled at all. Pausing now only happens on an
//    actual user-initiated gesture (touch/mouse/wheel), never on the
//    scroll event itself.
export default function SquareImageStrip({ images }: { images: SquareImage[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = 0;
  }, []);

  useEffect(() => {
    if (images.length < 2 || paused) return;
    const el = scrollRef.current;
    if (!el) return;
    const timer = setInterval(() => {
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: el.clientWidth / 3, behavior: 'smooth' });
      }
    }, AUTO_SCROLL_MS);
    return () => clearInterval(timer);
  }, [images.length, paused]);

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

  if (!images.length) return null;

  return (
    <div
      ref={scrollRef}
      onTouchStart={pauseThenResume}
      onMouseDown={pauseThenResume}
      onWheel={pauseThenResume}
      className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar"
    >
      {images.map((img, i) => (
        <div
          key={i}
          className="shrink-0 w-[62%] sm:w-[46%] md:w-[340px] lg:w-[400px] aspect-square snap-center overflow-hidden bg-charcoal/5"
        >
          {img.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center border border-dashed border-charcoal/20">
              <span className="text-[9px] tracking-[0.2em] uppercase text-ash/60 font-light text-center px-2">
                {img.placeholderLabel || 'Image coming soon'}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
