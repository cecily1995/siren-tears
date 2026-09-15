'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import BagIcon from './BagIcon';

// Deliberately NOT the site's normal Navigation component -- checkout pages
// should feel calm and free of distraction, so this shows only the logo and
// the bag icon, nothing else (no links, no language switcher, no menu).
export default function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-40 bg-ivory border-b border-charcoal/10 py-4">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="block">
          <Image
            src="/brand/siren-tears-logo.png"
            alt="Siren Tears"
            width={320}
            height={121}
            className="h-9 md:h-11 w-auto object-contain"
            priority
          />
        </Link>
        <BagIcon />
      </div>
    </header>
  );
}
