'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import ChatPanel from './ChatPanel';

export default function ChatTab() {
  const t = useTranslations('common');
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const heroEl = document.getElementById('top');
    if (!heroEl) {
      // No hero on this page (e.g. inner pages) -- show right away.
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show once the hero has scrolled mostly out of view.
        setVisible(entry.intersectionRatio < 0.4);
      },
      { threshold: [0, 0.4, 1] }
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('chatCta')}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-charcoal text-ivory text-[10px] tracking-[0.28em] uppercase font-light py-4 px-2.5 [writing-mode:vertical-rl] hover:bg-charcoal/90 transition-all duration-300 ${
          visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        {t('chatCta')}
      </button>
      {open && <ChatPanel onClose={() => setOpen(false)} />}
    </>
  );
}
