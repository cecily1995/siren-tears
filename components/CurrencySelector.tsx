'use client';

import { useEffect, useRef, useState } from 'react';
import { CURRENCIES } from '@/lib/currency';
import { useCurrency } from '@/lib/currency-context';

export default function CurrencySelector() {
  const [open, setOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-charcoal/70 hover:text-charcoal transition-colors"
      >
        $/{currency}
      </button>
      {open && (
        <div className="absolute bottom-full right-0 mb-2 bg-ivory border border-charcoal/15 shadow-sm min-w-[90px] py-1 z-10">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCurrency(c);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-[9px] md:text-[10px] tracking-[0.25em] md:tracking-[0.3em] uppercase font-light hover:bg-charcoal/5 ${
                c === currency ? 'text-charcoal' : 'text-charcoal/60'
              }`}
            >
              $/{c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
