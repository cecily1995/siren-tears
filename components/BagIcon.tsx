'use client';

import { useBag } from '@/lib/bag-context';

export default function BagIcon({ light }: { light?: boolean }) {
  const { items, open } = useBag();
  const count = items.length;

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Shopping bag"
      className={`relative transition-colors duration-500 ${
        light ? 'text-ivory/80 hover:text-ivory' : 'text-charcoal/70 hover:text-charcoal'
      }`}
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {count > 0 && (
        <span
          className={`absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] rounded-full flex items-center justify-center text-[9px] font-light leading-none ${
            light ? 'bg-ivory text-charcoal' : 'bg-charcoal text-ivory'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
