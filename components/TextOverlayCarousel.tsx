'use client';

import { useEffect, useRef, useState } from 'react';
import { useHorizontalSwipeLock } from '@/lib/useHorizontalSwipeLock';

const ROTATE_MS = 4500;
const FADE_MS = 1000;
const RESUME_AFTER_MS = 4000;
const SWIPE_THRESHOLD = 40;

// A banner-style block: several background photos cross-fading on a loop
// behind fixed overlay content (title/tagline/body passed as children),
// with manual swipe/drag also able to jump between them. Auto-rotation
// pauses for a few seconds after any manual interaction.
export default function TextOverlayCarousel({
  images,
  children,
  className = ''
}: {
  images: string[];
  children: React.ReactNode;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (images.length < 2 || paused) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [images.length, paused]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  function pauseThenResume() {
    setPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setPaused(false), RESUME_AFTER_MS);
  }

  function goTo(i: number) {
    setActive(((i % images.length) + images.length) % images.length);
    pauseThenResume();
  }

  function handleMove(clientX: number) {
    if (dragStartX.current === null) return;
    const delta = clientX - dragStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      goTo(active + (delta < 0 ? 1 : -1));
      dragStartX.current = clientX;
    }
  }

  useHorizontalSwipeLock(containerRef, handleMove);

  if (!images.length) return null;

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      onTouchStart={(e) => {
        dragStartX.current = e.touches[0].clientX;
        pauseThenResume();
      }}
      onMouseDown={(e) => {
        dragStartX.current = e.clientX;
        pauseThenResume();
      }}
      onMouseMove={(e) => {
        if (e.buttons === 1) handleMove(e.clientX);
      }}
      onMouseUp={() => {
        dragStartX.current = null;
      }}
      onMouseLeave={() => {
        dragStartX.current = null;
      }}
    >
      {images.map((url, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={url + i}
          src={url}
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: i === active ? 1 : 0, transition: `opacity ${FADE_MS}ms ease-in-out` }}
        />
      ))}
      {children}
      {images.length > 1 && (
        <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Image ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'w-4 bg-ivory' : 'w-1.5 bg-ivory/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
