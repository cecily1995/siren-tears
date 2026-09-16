'use client';

import { useEffect, useRef, useState } from 'react';
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
  const touchStartX = useRef<number | null>(null);
  const searchParams = useSearchParams();

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
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || photos.length <= 1) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  }

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-5 md:gap-6 [column-fill:_balance]">
        {items.map((p, i) => {
          const cover = p.images?.[0];
          return (
            <button
              key={p._id ?? i}
              type="button"
              onClick={() => open(i)}
              className="reveal mb-5 md:mb-6 break-inside-avoid overflow-hidden bg-charcoal/5 frame-zoom relative block w-full text-left"
              style={{ transitionDelay: `${(i % 8) * 90}ms` }}
            >
              {cover?.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cover.url}
                  alt={cover.alt || p.caption || 'Siren Tears, as worn'}
                  className="bg-img w-full h-auto block min-h-[120px]"
                />
              )}
              {p.customerHandle && (
                <p className="px-4 py-3 text-[0.8rem] tracking-[0.08em] text-gold font-light">
                  {p.customerHandle}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {active && (
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
            className="absolute top-5 right-5 md:top-8 md:right-8 w-9 h-9 flex items-center justify-center text-ivory z-10"
          >
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>

          <div className="relative z-[1] w-full max-w-[900px] max-h-[88dvh] overflow-y-auto bg-ivory">
            <div
              className="relative bg-charcoal/5 touch-pan-y select-none"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {photos[photoIndex] &&
                (photos[photoIndex].type === 'video' ? (
                  <video
                    key={photos[photoIndex].url}
                    src={photos[photoIndex].url}
                    controls
                    className="w-full h-auto max-h-[60dvh] mx-auto block"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photos[photoIndex].url}
                    alt={photos[photoIndex].alt || active?.caption || ''}
                    className="w-full h-auto max-h-[60dvh] object-contain mx-auto block"
                  />
                ))}
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
        </div>
      )}
    </>
  );
}
