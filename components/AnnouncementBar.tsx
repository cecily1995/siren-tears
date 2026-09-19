'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';

export type AnnouncementItem = { text?: string; href?: string };

export default function AnnouncementBar({ items }: { items: AnnouncementItem[] }) {
  const valid = items.filter((item) => item.text && item.href);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (valid.length < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % valid.length), 4200);
    return () => window.clearInterval(timer);
  }, [valid.length]);

  if (!valid.length) return null;
  const item = valid[active % valid.length];

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-7 bg-[#e9e1d5] border-b border-charcoal/10 overflow-hidden">
      <Link
        href={item.href!}
        className="flex h-full items-center justify-center px-5 text-center text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-charcoal/80 hover:text-charcoal"
        aria-label={item.text}
      >
        <span key={`${active}-${item.text}`} className="animate-announcement-in whitespace-nowrap">{item.text}</span>
      </Link>
    </div>
  );
}
