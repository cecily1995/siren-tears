'use client';

import { useRef, useState } from 'react';

type GalleryImage = { url: string; alt?: string };

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
  const touchStartX = useRef<number | null>(null);

  if (!images.length) {
    return <div className="aspect-[4/5] bg-charcoal/5" />;
  }

  function goTo(i: number) {
    setActive(Math.max(0, Math.min(images.length - 1, i)));
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      goTo(delta < 0 ? active + 1 : active - 1);
    }
    touchStartX.current = null;
  }

  return (
    <div>
      {/* Main image */}
      <div
        className="relative aspect-[4/5] overflow-hidden bg-charcoal/5"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active].url}
          alt={images[active].alt || productName}
          className={`w-full h-full object-cover ${isSold ? 'grayscale opacity-70' : ''}`}
        />
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
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? 'w-4 bg-ivory' : 'w-1.5 bg-ivory/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop thumbnail strip -- click any to swap the main image */}
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
