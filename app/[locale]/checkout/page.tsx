import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import CheckoutForm from '@/components/CheckoutForm';

export const metadata: Metadata = { title: 'Checkout — SIREN TEARS' };

// Deliberately a thin server wrapper -- the bag lives in localStorage, so
// everything interactive has to be client-side. This page intentionally
// does NOT render the site's normal PageHeader/Navigation (see spec: the
// checkout header shows only the logo and bag icon).
export default function CheckoutPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <CheckoutForm />;
}
