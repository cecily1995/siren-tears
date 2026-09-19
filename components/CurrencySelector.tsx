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
        aria-label={`Change currency. Current currency ${currency}`}
        title={currency}
        className="group relative w-9 h-9 md:w-10 md:h-10 border border-charcoal/15 flex items-center justify-center text-charcoal/65 hover:text-charcoal hover:border-charcoal/35 transition-colors"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
          <path d="M3.5 12h17M12 3c2.2 2.45 3.4 5.45 3.4 9S14.2 18.55 12 21M12 3C9.8 5.45 8.6 8.45 8.6 12S9.8 18.55 12 21" stroke="currentColor" strokeWidth="1.1" />
        </svg>
        <span className="absolute -bottom-1 -right-1 bg-pearl px-1 text-[7px] leading-[11px] tracking-[0.08em] text-charcoal/70">
          {currency}
        </span>
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
