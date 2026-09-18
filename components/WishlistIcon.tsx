'use client';

import { Link } from '@/i18n/routing';
import { useWishlist } from '@/lib/wishlist-context';

export default function WishlistIcon({ light }: { light?: boolean }) {
  const { items } = useWishlist();
  const count = items.length;

  return (
    <Link
      href="/wishlist"
      aria-label="Wishlist"
      className={`relative transition-colors duration-500 ${
        light ? 'text-ivory/80 hover:text-ivory' : 'text-charcoal/70 hover:text-charcoal'
      }`}
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path
          d="M12 20.5c-.3 0-.6-.1-.8-.3C7.4 17 3 13.1 3 8.9 3 6 5.2 3.8 8 3.8c1.6 0 3.1.8 4 2.1.9-1.3 2.4-2.1 4-2.1 2.8 0 5 2.2 5 5.1 0 4.2-4.4 8.1-8.2 11.3-.2.2-.5.3-.8.3Z"
          strokeLinejoin="round"
        />
      </svg>
      {count > 0 && (
        <span
          className={`absolute -top-0.5 -right-0.5 w-[6px] h-[6px] rounded-full ${light ? 'bg-ivory' : 'bg-charcoal'}`}
        />
      )}
    </Link>
  );
}
