'use client';

import { useEffect, useRef, useState } from 'react';

type SquareImage = { url?: string; alt?: string; placeholderLabel?: string };

const AUTO_SCROLL_MS = 3000;
const RESUME_AFTER_MS = 4000;

// Uses the browser's own native horizontal scrolling (overflow-x-auto) for
// the manual-swipe part rather than our custom drag machinery -- native
// scroll already handles touch correctly with no risk of fighting the
// page's own vertical scroll, so there's nothing to "fix" here the way the
// transform-based carousels needed. Auto-advance just calls scrollBy() on
// an interval, and pauses for a few seconds after the visitor scrolls it
// themselves.
export default function SquareImageStrip({ images }: { images: SquareImage[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      onScroll={pauseThenResume}
      onTouchStart={pauseThenResume}
      className="flex gap-3 md:gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar"
    >
      {images.map((img, i) => (
        <div
          key={i}
          className="shrink-0 w-[31%] md:w-[23%] aspect-square snap-center overflow-hidden bg-charcoal/5"
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
