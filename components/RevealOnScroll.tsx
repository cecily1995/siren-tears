'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Re-scan on every route change (client-side navigation does not remount
    // this component since it lives in the shared layout), and also catch
    // elements that get added to the DOM slightly after mount (e.g. content
    // that streams in) via a MutationObserver.
    let obs: IntersectionObserver | null = null;
    let mutationObs: MutationObserver | null = null;

    const supportsIO = typeof window !== 'undefined' && 'IntersectionObserver' in window;

    const revealImmediately = (el: HTMLElement) => el.classList.add('is-visible');

    const observeEl = (el: HTMLElement) => {
      if (el.classList.contains('is-visible')) return;
      if (!supportsIO) {
        revealImmediately(el);
        return;
      }
      obs!.observe(el);
    };

    if (supportsIO) {
      obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs!.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: '0px 0px 0px 0px' }
      );
    }

    // Initial scan for this render of the page.
    Array.from(document.querySelectorAll<HTMLElement>('.reveal')).forEach(observeEl);

    // Safety net: anything already sitting inside the viewport right now
    // (typical for above-the-fold content right after a page load) should
    // never have to wait on the observer's first callback -- images that
    // haven't finished loading yet can throw off an element's measured
    // position for a moment, which was leaving some on-screen content
    // stuck invisible until a scroll event happened to trigger a re-check.
    // Check directly and reveal immediately wherever it's already true.
    requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)').forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) revealImmediately(el);
      });
    });

    // Catch anything added after the initial scan (streaming/late content).
    mutationObs = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.classList.contains('reveal')) observeEl(node);
          node.querySelectorAll?.('.reveal').forEach((el) => observeEl(el as HTMLElement));
        });
      }
    });
    mutationObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      obs?.disconnect();
      mutationObs?.disconnect();
    };
    // Re-run this whole setup whenever the route changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
