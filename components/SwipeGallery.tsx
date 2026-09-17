'use client';

import { useRef, useState } from 'react';

type SlideImage = { url?: string; alt?: string; placeholderLabel?: string };

// Same follow-the-pointer drag + slow ease-out snap as ProductGallery/the
// Worn By You lightbox -- kept as its own small component (rather than
// reusing ProductGallery directly) so pages like this one can drop in a
// simple swipeable set of images without touching product-page code at all.
const SNAP_MS = 420;
const EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)';

export default function SwipeGallery({
  images,
  aspectClassName = 'aspect-[4/5]'
}: {
  images: SlideImage[];
  aspectClassName?: string;
}) {
  const [active, setActive] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const containerWidth = useRef(0);
  const pointerActive = useRef(false);

  if (!images.length) return null;

  function goTo(i: number) {
    setActive(Math.max(0, Math.min(images.length - 1, i)));
  }

  function beginDrag(clientX: number, el: HTMLElement) {
    if (images.length <= 1) return;
    pointerActive.current = true;
    setIsDragging(true);
    startX.current = clientX;
    containerWidth.current = el.getBoundingClientRect().width || 1;
    setDragPx(0);
  }
  function moveDrag(clientX: number) {
    if (!pointerActive.current) return;
    let delta = clientX - startX.current;
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

  const offsetPercent = -(active * 100);
  const dragPercent = containerWidth.current ? (dragPx / containerWidth.current) * 100 : 0;

  return (
    <div>
      <div
        className={`relative ${aspectClassName} overflow-hidden bg-charcoal/5 select-none`}
        onTouchStart={(e) => beginDrag(e.touches[0].clientX, e.currentTarget)}
        onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
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
              {img.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img.url}
                  alt={img.alt || ''}
                  draggable={false}
                  loading={Math.abs(i - active) <= 1 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-charcoal/5 border border-dashed border-charcoal/20">
                  <span className="text-[10px] tracking-[0.24em] uppercase text-ash/60 font-light">
                    {img.placeholderLabel || 'Image coming soon'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Image ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'w-4 bg-charcoal' : 'w-1.5 bg-charcoal/25'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
