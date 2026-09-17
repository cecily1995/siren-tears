import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageVeil from '@/components/PageVeil';
import RevealOnScroll from '@/components/RevealOnScroll';
import AuthGateModal from '@/components/AuthGateModal';
import TawkChat from '@/components/TawkChat';
import { BagProvider } from '@/lib/bag-context';
import BagDrawer from '@/components/BagDrawer';
import { WishlistProvider } from '@/lib/wishlist-context';
import { getSiteSettings } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';

export const metadata: Metadata = {
  title: 'SIREN TEARS — Natural Crystal Jewelry',
  description:
    'Natural crystal jewelry shaped by quality and timeless aesthetics. A New Zealand atelier of coastal luxury and emotional elegance.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/logo/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/logo/icon-512.png', type: 'image/png', sizes: '512x512' }
    ],
    apple: [{ url: '/logo/apple-touch-icon.png', sizes: '180x180' }]
  },
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
  const [t, settings] = await Promise.all([getTranslations(), getSiteSettings()]);

  const footerSettings = settings ?? fallback.settings;
  const footerLabels = {
    contact: t('footer.contact'),
    studio: t('footer.studio'),
    elsewhere: t('footer.elsewhere'),
    byAppointment: t('footer.byAppointment'),
    region: t('footer.region'),
    wechat: t('footer.wechat'),
    tagline: t('footer.tagline'),
    copyright: t('footer.copyright', { year: new Date().getFullYear() }),
    crafted: t('footer.crafted'),
    explore: t('footer.explore'),
    shopHeader: t('footer.shopHeader'),
    support: t('footer.support'),
    shipping: t('nav.shipping'),
    bespoke: t('nav.bespoke'),
    gallery: t('nav.gallery'),
    membership: t('nav.membership'),
    shop: t('nav.shop'),
    collections: t('nav.collections'),
    journal: t('nav.journal'),
    care: t('footer.care'),
    faq: t('footer.faq'),
    sizeGuide: t('footer.sizeGuide'),
    privacy: t('footer.privacy'),
    terms: t('footer.terms'),
    aboutLabel: t('footer.brandStoryLabel'),
    foundersLabel: t('footer.foundersLabel'),
    ourCommitmentLabel: t('footer.ourCommitmentLabel'),
    account: t('nav.account')
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <BagProvider>
        <WishlistProvider>
          <PageVeil />
          <Navigation />
          <RevealOnScroll />
          <main>{children}</main>
          <Footer data={footerSettings} labels={footerLabels} />
          <AuthGateModal />
          <TawkChat />
          <BagDrawer />
        </WishlistProvider>
      </BagProvider>
    </NextIntlClientProvider>
  );
}
