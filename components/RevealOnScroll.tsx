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
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
    }

    // Initial scan for this render of the page.
    Array.from(document.querySelectorAll<HTMLElement>('.reveal')).forEach(observeEl);

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
