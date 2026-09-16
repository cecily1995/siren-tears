'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'next/navigation';

type ShowcaseItem = {
  _id: string;
  caption?: string;
  customerHandle?: string;
  images?: { url?: string; alt?: string }[];
  videoUrl?: string;
};

type Media = { type: 'image' | 'video'; url: string; alt?: string };

function mediaFor(item: ShowcaseItem): Media[] {
  const media: Media[] = (item.images ?? [])
    .filter((img) => !!img.url)
    .map((img) => ({ type: 'image' as const, url: img.url!, alt: img.alt }));
  if (item.videoUrl) media.push({ type: 'video', url: item.videoUrl });
  return media;
}

export default function ShowcaseGrid({ items }: { items: ShowcaseItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  const active = activeIndex !== null ? items[activeIndex] : null;

  // Deep-link support: the homepage teaser links here with ?open=<id> so
  // clicking a photo there opens straight to that submission's own detail,
  // rather than just landing on the top of the full gallery.
  useEffect(() => {
    const openId = searchParams.get('open');
    if (!openId) return;
    const i = items.findIndex((item) => item._id === openId);
    if (i >= 0) {
      setActiveIndex(i);
      setPhotoIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (active === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [active]);

  function open(i: number) {
    setActiveIndex(i);
    setPhotoIndex(0);
  }

  function close() {
    setActiveIndex(null);
  }

  const photos = active ? mediaFor(active) : [];

  function goNext() {
    setPhotoIndex((i) => (i + 1) % photos.length);
  }
  function goPrev() {
    setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
  }

  // Same follow-the-pointer drag + slow ease-out snap as ProductGallery --
  // see there for the fuller explanation of the approach.
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragContainerWidth = useRef(0);
  const dragActive = useRef(false);

  function beginDrag(clientX: number, el: HTMLElement) {
    if (photos.length <= 1) return;
    dragActive.current = true;
    setIsDragging(true);
    dragStartX.current = clientX;
    dragContainerWidth.current = el.getBoundingClientRect().width || 1;
    setDragPx(0);
  }
  function moveDrag(clientX: number) {
    if (!dragActive.current) return;
    let delta = clientX - dragStartX.current;
    if ((photoIndex === 0 && delta > 0) || (photoIndex === photos.length - 1 && delta < 0)) {
      delta *= 0.35;
    }
    setDragPx(delta);
  }
  function endDrag() {
    if (!dragActive.current) return;
    dragActive.current = false;
    const width = dragContainerWidth.current || 1;
    const threshold = width * 0.18;
    if (dragPx <= -threshold) goNext();
    else if (dragPx >= threshold) goPrev();
    setDragPx(0);
    setIsDragging(false);
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
        {items.map((p, i) => {
          const cover = p.images?.[0];
          return (
            <button
              key={p._id ?? i}
              type="button"
              onClick={() => open(i)}
              className="reveal overflow-hidden bg-charcoal/5 frame-zoom relative block w-full text-left"
              style={{ transitionDelay: `${(i % 8) * 90}ms` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-charcoal/5">
                {cover?.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover.url}
                    alt={cover.alt || p.caption || 'Siren Tears, as worn'}
                    className="bg-img absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
              {p.customerHandle && (
                <p className="px-4 py-3 text-[0.8rem] tracking-[0.08em] text-gold font-light">
                  {p.customerHandle}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {active &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-10"
            role="dialog"
            aria-modal="true"
          >
          <div
            className="absolute inset-0 bg-charcoal/90"
            onClick={close}
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-5 right-5 md:top-8 md:right-8 w-9 h-9 flex items-center justify-center text-ivory bg-charcoal/70 rounded-full z-20"
          >
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>

          <div className="relative z-[1] w-full max-w-[900px] max-h-[88dvh] overflow-y-auto bg-ivory">
            <div
              className="relative bg-charcoal/5 select-none h-[60dvh] overflow-hidden"
              onTouchStart={(e) => beginDrag(e.touches[0].clientX, e.currentTarget)}
              onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
              onTouchEnd={endDrag}
              onMouseDown={(e) => {
                e.preventDefault();
                beginDrag(e.clientX, e.currentTarget);
              }}
              onMouseMove={(e) => {
                if (dragActive.current) moveDrag(e.clientX);
              }}
              onMouseUp={endDrag}
              onMouseLeave={() => {
                if (dragActive.current) endDrag();
              }}
            >
              {photos.length > 0 && (
                <div
                  className="flex h-full"
                  style={{
                    width: `${photos.length * 100}%`,
                    transform: `translateX(${
                      (-(photoIndex * 100) + (dragContainerWidth.current ? (dragPx / dragContainerWidth.current) * 100 : 0)) /
                      photos.length
                    }%)`,
                    transition: isDragging ? 'none' : 'transform 420ms cubic-bezier(0.22, 0.61, 0.36, 1)',
                    cursor: isDragging ? 'grabbing' : photos.length > 1 ? 'grab' : undefined
                  }}
                >
                  {photos.map((m, i) => (
                  <div key={m.url + i} className="shrink-0 h-full flex items-center justify-center" style={{ width: `${100 / photos.length}%` }}>
                    {m.type === 'video' ? (
                      <video
                        src={m.url}
                        controls
                        className="max-w-full max-h-full pointer-events-auto"
                        style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.url}
                        alt={m.alt || active?.caption || ''}
                        draggable={false}
                        loading={Math.abs(i - photoIndex) <= 1 ? 'eager' : 'lazy'}
                        className="max-w-full max-h-full object-contain pointer-events-none"
                      />
                    )}
                  </div>
                ))}
                </div>
              )}
              {photos.length > 1 && (
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 pb-3">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPhotoIndex(i)}
                      aria-label={`Photo ${i + 1}`}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        i === photoIndex ? 'bg-charcoal' : 'bg-charcoal/25'
                      }`}
                    />
                  ))}
                </div>
              )}
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous photo"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-charcoal bg-ivory/80"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next photo"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-charcoal bg-ivory/80"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {photos.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {photos.map((m, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPhotoIndex(i)}
                    className={`shrink-0 w-16 h-16 overflow-hidden border relative bg-charcoal/10 ${
                      i === photoIndex ? 'border-charcoal' : 'border-transparent'
                    }`}
                  >
                    {m.type === 'video' ? (
                      <>
                        <video src={m.url} className="w-full h-full object-cover" muted />
                        <span className="absolute inset-0 flex items-center justify-center text-ivory text-[10px]">
                          ▶
                        </span>
                      </>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.url} alt="" className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {(active.caption || active.customerHandle) && (
              <div className="p-6 md:p-8 border-t border-charcoal/10">
                {active.caption && (
                  <p className="serif-display text-[1.2rem] md:text-[1.4rem] font-light leading-[1.5] text-charcoal italic">
                    &ldquo;{active.caption}&rdquo;
                  </p>
                )}
                {active.customerHandle && (
                  <p className="mt-4 text-[0.85rem] tracking-[0.1em] uppercase text-gold font-light">
                    — {active.customerHandle}
                  </p>
                )}
              </div>
            )}
          </div>
          </div>,
          document.body
        )}
    </>
  );
}
