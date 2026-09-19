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
 * their JS API.
 *
 * Important: Tawk_API.onLoad must be assigned in the SAME synchronous
 * script block that creates Tawk_API, before the external embed script is
 * inserted -- an inline <script>'s "load" event isn't a reliable signal
 * (browsers don't consistently fire one for inline scripts the way they
 * do for scripts with a src), so this can't depend on Next's Script
 * onLoad callback firing at the right time. Everything Tawk-related runs
 * in one inline script instead.
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

  return (
    <>
      <Script id="tawk-to-widget" strategy="afterInteractive">
        {`
          var Tawk_API = Tawk_API || {};
          var Tawk_LoadStart = new Date();
          Tawk_API.onLoad = function () {
            if (Tawk_API.hideWidget) Tawk_API.hideWidget();
          };
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
        className={`fixed right-4 bottom-5 md:right-7 md:bottom-7 z-40 bg-ivory text-charcoal border border-charcoal/20 shadow-[0_10px_35px_rgba(38,35,31,0.14)] text-[9px] tracking-[0.22em] uppercase font-light py-3 px-4 hover:bg-charcoal hover:text-ivory transition-all duration-300 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <span className="mr-2 text-gold">●</span>{t('chatCta')}
      </button>
    </>
  );
}
