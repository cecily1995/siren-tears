'use client';

import { useState } from 'react';

type SquareImage = { url?: string; alt?: string; placeholderLabel?: string };

// Continuous, silky auto-scroll -- a CSS animation moving a track at a
// constant speed, not a periodic "jump, pause, jump" (which is what a
// timed scrollBy() produces, and what felt stuttery). The image list is
// duplicated back-to-back so the track can loop seamlessly: animating
// from translateX(0) to translateX(-50%) always ends exactly where the
// second copy visually matches the first, with no visible seam or jump.
// Touching/clicking pauses the animation (via CSS animation-play-state)
// so a visitor can look at a piece without it sliding away underneath
// their finger; it resumes on its own shortly after.
const SPEED_PX_PER_S = 40;

export default function SquareImageStrip({ images }: { images: SquareImage[] }) {
  const [paused, setPaused] = useState(false);

  if (!images.length) return null;

  const track = images.length > 1 ? [...images, ...images] : images;
  // Rough duration so the animation speed feels consistent regardless of
  // how many images there are (more images = a longer track = a longer
  // loop at the same visual speed).
  const approxItemPx = 340;
  const durationS = Math.max(8, (track.length * approxItemPx) / SPEED_PX_PER_S);

  return (
    <div
      className="overflow-hidden select-none"
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setTimeout(() => setPaused(false), 2000)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex gap-4 md:gap-6 w-max"
        style={{
          animation: images.length > 1 ? `square-strip-scroll ${durationS}s linear infinite` : undefined,
          animationPlayState: paused ? 'paused' : 'running'
        }}
      >
        {track.map((img, i) => (
          <div
            key={i}
            className="shrink-0 w-[62vw] sm:w-[280px] md:w-[340px] lg:w-[400px] aspect-square overflow-hidden bg-charcoal/5"
          >
            {img.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover pointer-events-none" draggable={false} />
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
      <style>{`
        @keyframes square-strip-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
