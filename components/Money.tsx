'use client';

import { useCurrency } from '@/lib/currency-context';

export default function Money({ amount }: { amount: number }) {
  const { format } = useCurrency();
  return <>{format(amount)}</>;
}
