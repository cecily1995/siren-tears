'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A smoother version of the "next section pulls up and covers the previous
 * one" effect. Unlike a plain position:sticky stack (which snaps abruptly
 * once the boundary is reached), this tracks scroll progress through a
 * dedicated "reveal zone" the height of one viewport, and continuously
 * interpolates the "above" panel's position — so it visibly rises into
 * place over a scroll distance, and reverses just as smoothly when
 * scrolling back up.
 */
export default function PullUpStack({
  below,
  above
}: {
  below: React.ReactNode;
  above: React.ReactNode;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const belowWrapRef = useRef<HTMLDivElement>(null);
  const aboveRef = useRef<HTMLDivElement>(null);
  const [belowHeight, setBelowHeight] = useState(0);

  useEffect(() => {
    function measure() {
      if (belowWrapRef.current) setBelowHeight(belowWrapRef.current.offsetHeight);
    }
    measure();
    window.addEventListener('resize', measure);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro && belowWrapRef.current) ro.observe(belowWrapRef.current);
    return () => {
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!belowHeight) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let lastProgress = -1;

    function update() {
      raf = requestAnimationFrame(update);
      const outer = outerRef.current;
      const aboveEl = aboveRef.current;
      if (!outer || !aboveEl) return;

      const rect = outer.getBoundingClientRect();
      const scrolledIntoWrapper = -rect.top;
      const progress = Math.min(1, Math.max(0, scrolledIntoWrapper / belowHeight));

      if (Math.abs(progress - lastProgress) < 0.002) return;
      lastProgress = progress;

      if (reduceMotion) {
        aboveEl.style.transform = progress > 0.5 ? 'translateY(0%)' : 'translateY(100%)';
      } else {
        aboveEl.style.transform = `translateY(${(1 - progress) * 100}%)`;
      }
    }

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [belowHeight]);

  return (
    <div
      ref={outerRef}
      className="relative"
      style={{ height: belowHeight ? `calc(${belowHeight}px + 100vh)` : undefined }}
    >
      <div ref={belowWrapRef} className="sticky top-0">
        {below}
      </div>
      <div
        ref={aboveRef}
        className="sticky top-0 h-screen overflow-y-auto no-scrollbar will-change-transform"
        style={{ transform: 'translateY(100%)' }}
      >
        {above}
      </div>
    </div>
  );
}
