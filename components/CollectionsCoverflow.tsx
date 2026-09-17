'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/routing';

type CoverItem = {
  key: string;
  href: string;
  imageUrl?: string;
  imageAlt?: string;
  title?: string;
};

const AUTO_ADVANCE_MS = 2600;
const RESUME_AFTER_MS = 3500;
const SWIPE_THRESHOLD = 40;

// Same 3D coverflow idea as the homepage Aotearoa carousel, but tuned
// denser per the brief: neighbours sit closer to the centre and tilt more
// sharply, so more covers are visible on screen at once (closer to a
// music-app coverflow than the homepage's more spaced-out version).
// Covers keep their 3:4 ratio regardless of position.
export default function CollectionsCoverflow({ items }: { items: CoverItem[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartX = useRef<number | null>(null);
  const dragging = useRef(false);

  useEffect(() => {
    if (items.length < 2 || paused) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [items.length, paused]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  if (!items.length) return null;

  function pauseThenResume() {
    setPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setPaused(false), RESUME_AFTER_MS);
  }

  function offsetOf(i: number) {
    const n = items.length;
    let raw = i - active;
    if (raw > n / 2) raw -= n;
    if (raw < -n / 2) raw += n;
    return raw;
  }

  function goTo(i: number) {
    setActive(((i % items.length) + items.length) % items.length);
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

  return (
    <div
      className="relative select-none"
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
      <div className="relative mx-auto w-[46%] sm:w-[34%] md:w-[22%] lg:w-[19%] aspect-[3/4]">
        {items.map((item, i) => {
          const offset = offsetOf(i);
          const abs = Math.abs(offset);
          if (abs > 3) return null;

          const translateX = offset * 62;
          const scale = abs === 0 ? 1 : abs === 1 ? 0.8 : abs === 2 ? 0.62 : 0.48;
          const rotateY = abs === 0 ? 0 : offset > 0 ? -42 : 42;
          const opacity = abs === 0 ? 1 : abs === 1 ? 0.75 : abs === 2 ? 0.45 : 0.2;
          const zIndex = 10 - abs;

          return (
            <div
              key={item.key}
              className="absolute inset-0 transition-all duration-[1100ms]"
              style={{
                transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
                opacity,
                zIndex,
                transitionTimingFunction: 'cubic-bezier(0.22, 0.61, 0.36, 1)'
              }}
            >
              {abs === 0 ? (
                <Link
                  href={item.href}
                  className="relative block w-full h-full overflow-hidden bg-charcoal/5 shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
                  onClick={(e) => {
                    if (dragging.current) e.preventDefault();
                  }}
                >
                  {item.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt || item.title || ''}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {item.title && (
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-charcoal/70 to-transparent">
                      <span className="text-[0.85rem] text-ivory font-light">{item.title}</span>
                    </div>
                  )}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={item.title || 'Collection'}
                  className="block w-full h-full overflow-hidden bg-charcoal/5"
                >
                  {item.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt || item.title || ''}
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        {items.map((_, i) => (
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
    </div>
  );
}
