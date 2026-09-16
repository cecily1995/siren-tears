'use client';

import { useWishlist } from '@/lib/wishlist-context';

export default function WishlistButton({
  productId,
  slug,
  name,
  price,
  imageUrl,
  className,
  iconClassName
}: {
  productId: string;
  slug: string;
  name: string;
  price?: number;
  imageUrl?: string;
  className?: string;
  iconClassName?: string;
}) {
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(productId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({ productId, slug, name, price, imageUrl });
      }}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      aria-pressed={saved}
      className={
        className || 'absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center'
      }
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        className={iconClassName || (saved ? 'text-gold' : 'text-charcoal')}
      >
        <path
          d="M12 20.5c-.3 0-.6-.1-.8-.3C7.4 17 3 13.1 3 8.9 3 6 5.2 3.8 8 3.8c1.6 0 3.1.8 4 2.1.9-1.3 2.4-2.1 4-2.1 2.8 0 5 2.2 5 5.1 0 4.2-4.4 8.1-8.2 11.3-.2.2-.5.3-.8.3Z"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
