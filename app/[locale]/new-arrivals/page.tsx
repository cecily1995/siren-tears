import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getNewArrivalProducts } from '@/sanity/lib/queries';
import PageHeader from '@/components/PageHeader';
import NewArrivalsGrid from '@/components/NewArrivalsGrid';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'newArrivalsPage' });
  return { title: `${t('title')} — SIREN TEARS` };
}

export default async function NewArrivalsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);

  const [t, tShop, items] = await Promise.all([
    getTranslations('newArrivalsPage'),
    getTranslations('shop'),
    getNewArrivalProducts()
  ]);

  const labels = {
    status: { sold: tShop('status.sold'), reserved: tShop('status.reserved') },
    oneOfOne: tShop('oneOfOne'),
    viewPiece: tShop('viewPiece'),
    empty: t('empty')
  };

  return (
    <div className="bg-ivory">
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />
      <NewArrivalsGrid items={items ?? []} labels={labels} />
    </div>
  );
}
