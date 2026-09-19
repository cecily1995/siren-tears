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
import { CurrencyProvider } from '@/lib/currency-context';
import { getCollections, getSiteSettings, getSearchPanelSettings } from '@/sanity/lib/queries';
import { translateText } from '@/lib/translate';
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
  const [t, settings, searchPanel, collections] = await Promise.all([
    getTranslations(),
    getSiteSettings(),
    getSearchPanelSettings(),
    getCollections()
  ]);

  const collectionNames = (collections?.length ? collections : fallback.collections)
    .map((collection: { title?: string }) => collection.title?.trim())
    .filter((title: string | undefined): title is string => Boolean(title));

  const searchPanelTiles = await Promise.all(
    (searchPanel?.tiles ?? []).map(
      async (tile: { title?: string; ctaLabel?: string; href?: string; imageUrl?: string }) => ({
        href: tile.href,
        imageUrl: tile.imageUrl,
        title: await translateText(tile.title, locale),
        ctaLabel: await translateText(tile.ctaLabel, locale)
      })
    )
  );

  const footerSettings = settings ?? fallback.settings;
  // siteSettings.tagline is raw CMS text (Studio: Site Settings), authored
  // once in English -- translate it so the footer doesn't ignore the
  // visitor's locale the way it was before.
  const translatedTagline = await translateText(footerSettings.tagline, locale);
  const localizedFooterSettings = { ...footerSettings, tagline: translatedTagline || footerSettings.tagline };
  const footerLabels = {
    contact: t('footer.contact'),
    enquire: t('nav.enquire'),
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
    assistance: t('footer.assistance'),
    returnsRepairs: t('footer.returnsRepairs'),
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
    joinListHeading: t('footer.joinListHeading'),
    joinListBody: t('footer.joinListBody'),
    joinListPlaceholder: t('footer.joinListPlaceholder'),
    joinListSuccess: t('footer.joinListSuccess'),
    account: t('nav.account')
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CurrencyProvider>
        <BagProvider>
          <WishlistProvider>
          <PageVeil />
          <Navigation searchPanelTiles={searchPanelTiles} collectionNames={collectionNames} />
          <RevealOnScroll />
          <main>{children}</main>
          <Footer data={localizedFooterSettings} labels={footerLabels} />
          <AuthGateModal />
          <TawkChat />
          <BagDrawer />
          </WishlistProvider>
        </BagProvider>
      </CurrencyProvider>
    </NextIntlClientProvider>
  );
}
