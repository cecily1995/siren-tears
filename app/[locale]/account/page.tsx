import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import AccountPageContent from '@/components/AccountPageContent';

export const revalidate = 0;

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'account' });
  return { title: `${t('eyebrow')} — SIREN TEARS` };
}

export default async function AccountPage({
  params
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const t = await getTranslations('account');

  return (
    <AccountPageContent
      eyebrow={t('eyebrow')}
      title={t('title')}
      intro={t('intro')}
      imageUrl="https://images.unsplash.com/photo-1767131636996-ae27286d36fb?auto=format&fit=crop&w=2000&q=80"
      imageAlt="Calm ocean water meeting a quiet rocky coastline"
    />
  );
}
