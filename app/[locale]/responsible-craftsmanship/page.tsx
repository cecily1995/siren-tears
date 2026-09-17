import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/PageHeader';

// Stub page so /founders' "Discover More" link has somewhere real to go.
// Content to be designed and filled in later.
export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'responsibleCraftsmanshipPage' });
  return { title: `${t('title')} — SIREN TEARS` };
}

export default async function ResponsibleCraftsmanshipPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);

  const t = await getTranslations('responsibleCraftsmanshipPage');

  return <PageHeader eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />;
}
