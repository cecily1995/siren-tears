'use client';

import Script from 'next/script';

const TAWK_PROPERTY_ID = '6aa8b75747c9e9344a37e240';
const TAWK_WIDGET_ID = '1k2hgobp3';

/**
 * Real-time live chat via Tawk.to (free, unlimited agents, has a mobile
 * app so replies can come in on the go). This replaces the earlier
 * custom-built "Private Atelier" panel, which only supported a one-way
 * enquiry (submit -> studio replies by email), not genuine live back-
 * and-forth chat. Tawk.to renders its own floating chat bubble (usually
 * bottom-right), so there's no separate custom trigger UI needed here.
 */
export default function TawkChat() {
  return (
    <Script id="tawk-to-widget" strategy="afterInteractive">
      {`
        var Tawk_API = Tawk_API || {};
        var Tawk_LoadStart = new Date();
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
  );
}
