'use client';

import { useState } from 'react';

export default function FooterAccordionSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-ivory/15">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="eyebrow text-ivory/70">{title}</span>
        <span className="text-ivory/60 text-lg leading-none font-light">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}
