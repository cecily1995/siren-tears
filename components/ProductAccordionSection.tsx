'use client';

import { useState, type ReactNode } from 'react';

export default function ProductAccordionSection({
  title,
  children,
  defaultOpen = false
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-charcoal/12">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-[11px] tracking-[0.24em] uppercase text-charcoal font-light">{title}</span>
        <span className="text-charcoal/50 text-lg leading-none font-light">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="pb-5 text-[0.88rem] text-ash font-light leading-[1.7]">{children}</div>}
    </div>
  );
}
