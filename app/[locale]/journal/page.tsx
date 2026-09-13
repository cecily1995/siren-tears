import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getJournal } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';
import PageHeader from '@/components/PageHeader';
import Journal from '@/components/Journal';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'journal' });
  return { title: `${t('eyebrow')} — SIREN TEARS` };
}

export default async function JournalPage({
  params
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const [t, journal] = await Promise.all([getTranslations('journal'), getJournal()]);
  const items = journal?.length ? journal : fallback.journal;

  const labels = {
    eyebrow: '',
    title: '',
    intro: '',
    readLink: t('readLink')
  };

  return (
    <>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        imageUrl="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Natural stone texture"
      />
      <Journal items={items} labels={labels} />
    </>
  );
}
