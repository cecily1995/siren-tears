import { useEffect, type RefObject } from 'react';

// React's synthetic onTouchMove is attached as a passive listener under the
// hood, so calling e.preventDefault() inside it does nothing on many
// browsers -- the page still scrolls/pans underneath whatever custom drag
// a component is doing, which is exactly the "whole screen moves while
// dragging a gallery" bug. The fix is a real native listener registered
// with { passive: false }, which this hook sets up.
//
// It also only blocks the page's own scroll once a gesture has clearly
// declared itself horizontal (moved further sideways than up/down) -- a
// visitor scrolling the page vertically over a gallery should still be able
// to, uninterrupted.
export function useHorizontalSwipeLock(
  ref: RefObject<HTMLElement>,
  onMove: (clientX: number) => void
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let axis: 'x' | 'y' | null = null;

    function onTouchStart(e: TouchEvent) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      axis = null;
    }

    function onTouchMove(e: TouchEvent) {
      const touch = e.touches[0];
      if (axis === null) {
        const dx = Math.abs(touch.clientX - startX);
        const dy = Math.abs(touch.clientY - startY);
        if (dx < 4 && dy < 4) return;
        axis = dx > dy ? 'x' : 'y';
      }
      if (axis === 'x') {
        e.preventDefault();
        onMove(touch.clientX);
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, [ref, onMove]);
}
