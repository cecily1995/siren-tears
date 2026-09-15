'use client';

import { Link } from '@/i18n/routing';
import BagIcon from './BagIcon';

// Deliberately NOT the site's normal Navigation component -- checkout pages
// should feel calm and free of distraction, so this shows only the logo and
// the bag icon, nothing else (no links, no language switcher, no menu).
export default function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-40 bg-ivory border-b border-charcoal/10 py-5">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-[1.05rem] tracking-[0.42em] uppercase text-charcoal"
        >
          Siren Tears
        </Link>
        <BagIcon />
      </div>
    </header>
  );
}
