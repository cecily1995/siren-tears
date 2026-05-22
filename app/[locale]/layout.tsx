import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Navigation from '@/components/Navigation';
import PageVeil from '@/components/PageVeil';
import RevealOnScroll from '@/components/RevealOnScroll';

export const metadata: Metadata = {
  title: 'SIREN TEARS — Natural Crystal Jewelry',
  description:
    'Natural crystal jewelry shaped by quality and timeless aesthetics. A New Zealand atelier of coastal luxury and emotional elegance.',
  openGraph: {
    title: 'SIREN TEARS',
    description:
      'Natural crystal jewelry shaped by quality and timeless aesthetics.',
    type: 'website'
  }
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <PageVeil />
      <Navigation />
      <RevealOnScroll />
      <main>{children}</main>
    </NextIntlClientProvider>
  );
}
