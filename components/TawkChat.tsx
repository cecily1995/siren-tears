'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useTranslations } from 'next-intl';

const CRISP_WEBSITE_ID = '31bad43d-fc96-4a39-b219-7946530a500b';

declare global {
  interface Window {
    $crisp?: unknown[];
    CRISP_WEBSITE_ID?: string;
  }
}

/**
 * Crisp supplies the conversation window and mobile inbox, while the site's
 * original vertical CHAT tab remains the only launcher customers see.
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

  const openChat = () => {
    window.$crisp = window.$crisp || [];
    window.$crisp.push(['do', 'chat:show']);
    window.$crisp.push(['do', 'chat:open']);
  };

  return (
    <>
      <Script id="crisp-chat-widget" strategy="afterInteractive">
        {`
          window.$crisp = window.$crisp || [];
          window.CRISP_WEBSITE_ID = '${CRISP_WEBSITE_ID}';
          window.$crisp.push(['safe', true]);
          window.$crisp.push(['config', 'availability:tooltip', [false]]);
          window.$crisp.push(['do', 'chat:hide']);
          (function () {
            var d = document;
            var s = d.createElement('script');
            s.src = 'https://client.crisp.chat/l.js';
            s.async = true;
            d.getElementsByTagName('head')[0].appendChild(s);
          })();
        `}
      </Script>

      <button
        type="button"
        onClick={openChat}
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
