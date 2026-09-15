'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useTranslations } from 'next-intl';

const TAWK_PROPERTY_ID = '6aa8b75747c9e9344a37e240';
const TAWK_WIDGET_ID = '1k2hgobp3';

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget?: () => void;
      showWidget?: () => void;
      toggle?: () => void;
      onLoad?: () => void;
      [key: string]: unknown;
    };
  }
}

/**
 * Loads the real Tawk.to chat (so replies are genuinely live, with the
 * studio owner getting them on the Tawk mobile app), but hides Tawk's own
 * default floating bubble and shows our own premium-styled vertical
 * "CHAT" tab instead -- clicking it opens the actual Tawk chat window via
 * their JS API. Same visual as the original custom tab, same real-time
 * backend as Tawk.
 */
export default function TawkChat() {
  const t = useTranslations('common');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroEl = document.getElementById('top');
    if (!heroEl) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.intersectionRatio < 0.4),
      { threshold: [0, 0.4, 1] }
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  function handleTawkLoad() {
    // Hide Tawk's own floating bubble once it's ready; we use our own
    // trigger tab and call Tawk_API.toggle() to open their real widget.
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.onLoad = () => {
      window.Tawk_API?.hideWidget?.();
    };
  }

  return (
    <>
      <Script id="tawk-to-init" strategy="afterInteractive" onLoad={handleTawkLoad}>
        {`
          var Tawk_API = Tawk_API || {};
          var Tawk_LoadStart = new Date();
        `}
      </Script>
      <Script id="tawk-to-widget" strategy="afterInteractive">
        {`
          (function () {
            var s1 = document.createElement('script'),
              s0 = document.getElementsByTagName('script')[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
          })();
        `}
      </Script>

      <button
        type="button"
        onClick={() => window.Tawk_API?.toggle?.()}
        aria-label={t('chatCta')}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-charcoal text-ivory text-[10px] tracking-[0.28em] uppercase font-light py-4 px-2.5 [writing-mode:vertical-rl] hover:bg-charcoal/90 transition-all duration-300 ${
          visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        {t('chatCta')}
      </button>
    </>
  );
}
