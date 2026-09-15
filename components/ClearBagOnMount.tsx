'use client';

import { useEffect } from 'react';
import { useBag } from '@/lib/bag-context';

// Renders nothing -- just empties the bag once, when the customer lands
// here after a successful Stripe payment. Kept as its own tiny component
// so the confirmation page itself can stay a server component.
export default function ClearBagOnMount() {
  const { clear } = useBag();
  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
