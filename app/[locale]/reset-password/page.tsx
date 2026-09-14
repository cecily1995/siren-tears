import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/PageHeader';
import ResetPasswordForm from '@/components/ResetPasswordForm';

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'account' });
  return { title: `${t('resetPasswordTitle')} — SIREN TEARS` };
}

export default async function ResetPasswordPage({
  params,
  searchParams
}: {
  params: { locale: string };
  searchParams: { token?: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const t = await getTranslations('account');

  return (
    <>
      <PageHeader
        eyebrow={t('gateEyebrow')}
        title={t('resetPasswordTitle')}
        imageUrl="https://images.unsplash.com/photo-1767131636996-ae27286d36fb?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Calm ocean water meeting a quiet rocky coastline"
      />
      <section className="bg-ivory px-6 md:px-12 py-20 md:py-28">
        <div className="mx-auto max-w-[440px]">
          <ResetPasswordForm token={searchParams?.token} />
        </div>
      </section>
    </>
  );
}
