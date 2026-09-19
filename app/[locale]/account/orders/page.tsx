import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import OrdersPageContent from '@/components/OrdersPageContent';

export const revalidate = 0;

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'account' });
  return { title: `${t('myOrdersEyebrow')} — SIREN TEARS` };
}

export default async function OrdersPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);

  return <OrdersPageContent />;
}
