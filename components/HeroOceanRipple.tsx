'use client';

import { useEffect, useRef } from 'react';

/**
 * Adds a very slow, very subtle shimmer to the *lower* portion of the hero
 * photo (the water), while the sky / horizon stays completely untouched.
 *
 * How it works: a hidden <img> loads the same photo purely as a pixel
 * source. A <canvas> sits on top of the existing (untouched) hero
 * background image, sized to the hero section. Each frame, only the rows
 * within the "water band" are redrawn from the source image with a tiny,
 * slowly-evolving horizontal offset (a couple of px at most near the
 * bottom, tapering to zero at the horizon). Everywhere else the canvas is
 * left fully transparent, so the original photo (and its existing Ken
 * Burns zoom) shows through completely unmodified.
 *
 * Respects prefers-reduced-motion (renders nothing, static photo only),
 * pauses when the tab is hidden or the hero is scrolled out of view, and
 * runs at a low, throttled frame rate since the motion is intentionally
 * near-imperceptible.
 */
export default function HeroOceanRipple({
  src,
  waterBandStart = 0.56,
  waterBandEnd = 0.98
}: {
  src?: string;
  waterBandStart?: number;
  waterBandEnd?: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!src) return;
    if (typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) return; // static photo only, by design

    const section = sectionRef.current;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!section || !img || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let disposed = false;
    let tabVisible = !document.hidden;
    let inView = true;

    const isNarrow = () => window.innerWidth < 768;

    function sizeCanvas() {
      const rect = section!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, isNarrow() ? 1 : 1.5);
      canvas!.width = Math.max(1, Math.round(rect.width * dpr));
      canvas!.height = Math.max(1, Math.round(rect.height * dpr));
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;
    }

    function draw(time: number) {
      raf = requestAnimationFrame(draw);
      if (disposed || !tabVisible || !inView) return;

      const targetFps = isNarrow() ? 10 : 16;
      const interval = 1000 / targetFps;
      const last = (draw as any)._last ?? 0;
      if (time - last < interval) return;
      (draw as any)._last = time;

      const cw = canvas!.width;
      const ch = canvas!.height;
      const iw = img!.naturalWidth;
      const ih = img!.naturalHeight;
      if (!iw || !ih || !cw || !ch) return;

      // object-fit: cover geometry, matching the underlying photo's own framing.
      const containerRatio = cw / ch;
      const imgRatio = iw / ih;
      let drawW: number, drawH: number, offsetX: number, offsetY: number;
      if (imgRatio > containerRatio) {
        drawH = ch;
        drawW = ch * imgRatio;
        offsetX = (cw - drawW) / 2;
        offsetY = 0;
      } else {
        drawW = cw;
        drawH = cw / imgRatio;
        offsetX = 0;
        offsetY = (ch - drawH) / 2;
      }

      const bandTop = offsetY + drawH * waterBandStart;
      const bandBottom = offsetY + drawH * waterBandEnd;
      const bandHeight = Math.max(1, bandBottom - bandTop);

      ctx!.clearRect(0, Math.max(0, bandTop - 4), cw, bandHeight + 8);

      const strip = isNarrow() ? 5 : 3;
      const maxAmpPx = (isNarrow() ? 1.4 : 2.2) * (cw / (isNarrow() ? 400 : 1400) + 0.6);
      const t = time * 0.001;

      for (let y = bandTop; y < bandBottom; y += strip) {
        const progress = (y - bandTop) / bandHeight; // 0 at horizon edge, 1 at foot of frame
        const amp = progress * progress * maxAmpPx; // ease-in so the line near the horizon is essentially still
        // Two slightly de-tuned sine waves so the loop is not obviously periodic.
        const wobble =
          Math.sin(y * 0.012 + t * 0.11) * 0.6 + Math.sin(y * 0.021 - t * 0.07 + 1.3) * 0.4;
        const dx = wobble * amp;

        const srcY = ((y - offsetY) / drawH) * ih;
        const srcH = (strip / drawH) * ih;
        if (srcY < 0 || srcY >= ih) continue;

        ctx!.drawImage(
          img!,
          0,
          srcY,
          iw,
          Math.min(srcH, ih - srcY),
          offsetX + dx,
          y,
          drawW,
          strip + 1
        );
      }
    }

    function start() {
      sizeCanvas();
      raf = requestAnimationFrame(draw);
    }

    if (img.complete && img.naturalWidth > 0) {
      start();
    } else {
      img.addEventListener('load', start, { once: true });
    }

    const onResize = () => sizeCanvas();
    window.addEventListener('resize', onResize);

    const onVisibility = () => {
      tabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    io.observe(section);

    const onMotionChange = () => {
      if (reduceMotion.matches) {
        disposed = true;
        cancelAnimationFrame(raf);
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      }
    };
    reduceMotion.addEventListener?.('change', onMotionChange);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
      reduceMotion.removeEventListener?.('change', onMotionChange);
    };
  }, [src, waterBandStart, waterBandEnd]);

  if (!src) return null;

  return (
    <div ref={sectionRef} className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {/* Hidden — exists only to decode pixels for the canvas to draw from. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute w-px h-px opacity-0 -z-10"
        loading="eager"
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
