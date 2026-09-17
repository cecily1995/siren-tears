'use client';

import { useRef, useState } from 'react';
import { useHorizontalSwipeLock } from '@/lib/useHorizontalSwipeLock';

type GalleryImage = { url: string; alt?: string };

// Quiet-luxury swipe/drag: the whole image strip tracks the finger/cursor
// 1:1 while dragging (no transition), then eases to rest over ~400ms once
// released -- never an instant cut, never a bouncy overshoot. All images
// are mounted at once in a single wide flex row and we only ever move that
// row, so switching between adjacent (already-loaded) images never
// re-fetches or flashes -- it's a pure transform, not a src swap.
const SNAP_MS = 420;
const EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)';

export default function ProductGallery({
  images,
  productName,
  isSold,
  statusLabel
}: {
  images: GalleryImage[];
  productName: string;
  isSold?: boolean;
  statusLabel?: string | null;
}) {
  const [active, setActive] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const containerWidth = useRef(0);
  const pointerActive = useRef(false);

  function goTo(i: number) {
    setActive(Math.max(0, Math.min(images.length - 1, i)));
  }

  function beginDrag(clientX: number, el: HTMLElement) {
    pointerActive.current = true;
    setIsDragging(true);
    startX.current = clientX;
    containerWidth.current = el.getBoundingClientRect().width || 1;
    setDragPx(0);
  }

  function moveDrag(clientX: number) {
    if (!pointerActive.current) return;
    let delta = clientX - startX.current;
    // A touch of resistance at the very ends so it doesn't feel like it's
    // trying to pull past the first/last image forever.
    if ((active === 0 && delta > 0) || (active === images.length - 1 && delta < 0)) {
      delta *= 0.35;
    }
    setDragPx(delta);
  }

  function endDrag() {
    if (!pointerActive.current) return;
    pointerActive.current = false;
    const width = containerWidth.current || 1;
    const threshold = width * 0.18;
    if (dragPx <= -threshold) goTo(active + 1);
    else if (dragPx >= threshold) goTo(active - 1);
    setDragPx(0);
    setIsDragging(false);
  }

  useHorizontalSwipeLock(containerRef, moveDrag);

  if (!images.length) {
    return <div className="aspect-[4/5] bg-charcoal/5" />;
  }

  const offsetPercent = -(active * 100);
  const dragPercent = containerWidth.current ? (dragPx / containerWidth.current) * 100 : 0;

  return (
    <div>
      {/* Main image strip */}
      <div
        ref={containerRef}
        className="relative aspect-[4/5] overflow-hidden bg-charcoal/5 select-none"
        onTouchStart={(e) => beginDrag(e.touches[0].clientX, e.currentTarget)}
        onTouchEnd={endDrag}
        onMouseDown={(e) => {
          e.preventDefault();
          beginDrag(e.clientX, e.currentTarget);
        }}
        onMouseMove={(e) => {
          if (pointerActive.current) moveDrag(e.clientX);
        }}
        onMouseUp={endDrag}
        onMouseLeave={() => {
          if (pointerActive.current) endDrag();
        }}
      >
        <div
          ref={trackRef}
          className="flex h-full"
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(${offsetPercent / images.length + dragPercent / images.length}%)`,
            transition: isDragging ? 'none' : `transform ${SNAP_MS}ms ${EASE}`,
            cursor: isDragging ? 'grabbing' : images.length > 1 ? 'grab' : undefined
          }}
        >
          {images.map((img, i) => (
            <div key={i} className="shrink-0 h-full" style={{ width: `${100 / images.length}%` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt || productName}
                draggable={false}
                loading={Math.abs(i - active) <= 1 ? 'eager' : 'lazy'}
                className={`w-full h-full object-cover pointer-events-none ${isSold ? 'grayscale opacity-70' : ''}`}
              />
            </div>
          ))}
        </div>

        {statusLabel && (
          <span className="absolute top-4 left-4 bg-ivory/95 text-charcoal text-[10px] tracking-[0.24em] uppercase px-3 py-1.5 font-light">
            {statusLabel}
          </span>
        )}

        {/* Mobile page dots */}
        {images.length > 1 && (
          <div className="md:hidden absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Image ${i + 1} of ${images.length}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'w-4 bg-ivory' : 'w-1.5 bg-ivory/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop thumbnail strip -- click any to jump the main image */}
      {images.length > 1 && (
        <div className="hidden md:grid mt-4 grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show image ${i + 1}`}
              className={`aspect-square overflow-hidden bg-charcoal/5 transition-opacity ${
                i === active ? 'ring-1 ring-charcoal' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
