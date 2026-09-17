'use client';

import { useEffect, useRef } from 'react';
import { useHorizontalSwipeLock } from '@/lib/useHorizontalSwipeLock';

type SquareImage = { url?: string; alt?: string; placeholderLabel?: string };

// Continuous, silky auto-scroll that's *also* manually draggable -- a CSS
// keyframe animation alone (the previous approach) can't be interrupted
// and re-driven by a finger mid-gesture, so real dragging never worked
// alongside it. Driven instead by requestAnimationFrame nudging a plain
// pixel offset forward every frame (smooth, constant-speed, no periodic
// jump the way a timed scrollBy was), which is the same value manual
// drag/touch directly updates -- so a finger can grab and move the strip
// at any moment, and auto-scroll picks back up from wherever it was left
// a couple of seconds after release.
//
// The image list is duplicated back-to-back so the loop is seamless: once
// the offset passes one full original-set width, it wraps by subtracting
// that width, landing exactly where the visuals already match.
const SPEED_PX_PER_S = 40;
const RESUME_AFTER_MS = 2000;
const APPROX_ITEM_PX = 340;

export default function SquareImageStrip({ images }: { images: SquareImage[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const setWidthRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const track = images.length > 1 ? [...images, ...images] : images;

  function applyOffset() {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-offsetRef.current}px)`;
    }
  }

  function pauseThenResume() {
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_AFTER_MS);
  }

  useEffect(() => {
    // Measure the width of one original set (half the duplicated track)
    // once it's actually laid out, so wrapping math is accurate rather
    // than a rough estimate.
    const measure = () => {
      if (trackRef.current && images.length > 1) {
        setWidthRef.current = trackRef.current.scrollWidth / 2;
      }
    };
    measure();
    window.addEventListener('resize', measure);
    // A frame later too, in case images hadn't finished laying out yet.
    const t = setTimeout(measure, 200);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, [images.length]);

  useEffect(() => {
    if (images.length < 2) return;
    let raf: number;
    let last = performance.now();
    function tick(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      if (!pausedRef.current && !draggingRef.current) {
        offsetRef.current += SPEED_PX_PER_S * dt;
        const setWidth = setWidthRef.current || images.length * APPROX_ITEM_PX;
        if (offsetRef.current >= setWidth) offsetRef.current -= setWidth;
        applyOffset();
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  function beginDrag(clientX: number) {
    if (images.length < 2) return;
    draggingRef.current = true;
    dragStartXRef.current = clientX;
    dragStartOffsetRef.current = offsetRef.current;
    pauseThenResume();
  }
  function moveDrag(clientX: number) {
    if (!draggingRef.current) return;
    const delta = clientX - dragStartXRef.current;
    let next = dragStartOffsetRef.current - delta;
    const setWidth = setWidthRef.current || images.length * APPROX_ITEM_PX;
    if (setWidth > 0) {
      next = ((next % setWidth) + setWidth) % setWidth;
    }
    offsetRef.current = next;
    applyOffset();
  }
  function endDrag() {
    draggingRef.current = false;
    pauseThenResume();
  }

  useHorizontalSwipeLock(containerRef, moveDrag);

  if (!images.length) return null;

  return (
    <div
      ref={containerRef}
      className="overflow-hidden select-none"
      onTouchStart={(e) => beginDrag(e.touches[0].clientX)}
      onTouchEnd={endDrag}
      onMouseDown={(e) => {
        e.preventDefault();
        beginDrag(e.clientX);
      }}
      onMouseMove={(e) => {
        if (draggingRef.current) moveDrag(e.clientX);
      }}
      onMouseUp={endDrag}
      onMouseLeave={() => {
        if (draggingRef.current) endDrag();
      }}
    >
      <div ref={trackRef} className="flex gap-4 md:gap-6 w-max" style={{ willChange: 'transform' }}>
        {track.map((img, i) => (
          <div
            key={i}
            className="shrink-0 w-[62vw] sm:w-[280px] md:w-[340px] lg:w-[400px] aspect-square overflow-hidden bg-charcoal/5"
          >
            {img.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img.url}
                alt={img.alt || ''}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
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
    </div>
  );
}
