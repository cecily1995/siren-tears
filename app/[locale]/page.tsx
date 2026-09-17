import { setRequestLocale, getTranslations } from 'next-intl/server';
import { translateText } from '@/lib/translate';
import Hero from '@/components/Hero';
import Philosophy from '@/components/Philosophy';
import NewArrivalsBanner from '@/components/NewArrivalsBanner';
import CurrentlyAvailable from '@/components/CurrentlyAvailable';
import Collections from '@/components/Collections';
import AotearoaTeaser from '@/components/AotearoaTeaser';
import WornByYouTeaser from '@/components/WornByYouTeaser';
import Atelier from '@/components/Atelier';
import PullUpStack from '@/components/PullUpStack';
import JournalTeaser from '@/components/JournalTeaser';
import { getJournal } from '@/sanity/lib/queries';
import {
  getHomepage,
  getCollections,
  getBuyerShowcase,
  getShopProducts
} from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';

export const revalidate = 60;

const HOMEPAGE_COLLECTION_TITLES = ['Last Queen', 'Golden Age', "Siren's Chain"];

export default async function HomePage({
  params
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const [home, collections, showcase, shopProducts, journal] = await Promise.all([
    getHomepage(),
    getCollections(),
    getBuyerShowcase(),
    getShopProducts(),
    getJournal()
  ]);

  const t = await getTranslations();

  const heroBg = home?.hero?.bgUrl ?? fallback.hero.bgUrl;
  const heroBgAlt = home?.hero?.bgAlt ?? fallback.hero.bgAlt;

  const [translatedHeroEyebrow, translatedHeroTitle, translatedHeroBody, translatedHeroCta] = await Promise.all([
    translateText(home?.hero?.eyebrow, locale),
    translateText(home?.hero?.title, locale),
    translateText(home?.hero?.body, locale),
    translateText(home?.hero?.ctaLabel, locale)
  ]);

  const heroData = {
    // Same fix as Philosophy below: Studio's Hero fields (eyebrow/title/
    // body/ctaLabel) were being fetched but never actually used -- this
    // always showed the translation strings (and a hardcoded "SIREN
    // TEARS" for the title) regardless of what was edited in Studio.
    eyebrow: translatedHeroEyebrow || t('hero.eyebrow'),
    title: translatedHeroTitle || 'SIREN TEARS',
    body: translatedHeroBody || t('hero.body'),
    ctaLabel: translatedHeroCta || t('hero.cta'),
    bgUrl: heroBg,
    bgAlt: heroBgAlt,
    scrollLabel: t('hero.scroll')
  };

  const rawPillars = home?.philosophy?.pillars;
  const [translatedSectionLabel, translatedSectionTitle, translatedPillars] = await Promise.all([
    translateText(home?.philosophy?.sectionLabel, locale),
    translateText(home?.philosophy?.sectionTitle, locale),
    rawPillars?.length
      ? Promise.all(
          rawPillars.map(async (p: { title?: string; body?: string }) => ({
            title: await translateText(p.title, locale),
            body: await translateText(p.body, locale)
          }))
        )
      : Promise.resolve([])
  ]);

  const philosophyData = {
    // Sanity Studio (Home > Brand Philosophy) is meant to be able to
    // override this section's label/title/pillars -- it previously wasn't
    // actually wired up to do so (always used the translation strings
    // regardless of what was edited in Studio), which is why edits there
    // never appeared on the live site. Now prefers the Studio value when
    // it's been filled in (translated via DeepL to match the current
    // locale), falling back to the built-in translation otherwise.
    sectionLabel: translatedSectionLabel || t('philosophy.label'),
    sectionTitle: translatedSectionTitle || t('philosophy.title'),
    videoUrl: home?.philosophy?.videoUrl,
    pillars: translatedPillars.length
      ? translatedPillars.map((p: { title?: string; body?: string }, i: number) => ({
          title:
            p.title ||
            [
              t('philosophy.pillars.natural.title'),
              t('philosophy.pillars.timeless.title'),
              t('philosophy.pillars.quality.title')
            ][i],
          body:
            p.body ||
            [
              t('philosophy.pillars.natural.body'),
              t('philosophy.pillars.timeless.body'),
              t('philosophy.pillars.quality.body')
            ][i]
        }))
      : [
          { title: t('philosophy.pillars.natural.title'), body: t('philosophy.pillars.natural.body') },
          { title: t('philosophy.pillars.timeless.title'), body: t('philosophy.pillars.timeless.body') },
          { title: t('philosophy.pillars.quality.title'), body: t('philosophy.pillars.quality.body') }
        ]
  };

  const newArrivalsData = {
    images: (home?.newArrivals?.images?.length
      ? home.newArrivals.images
      : ['/images/one-of-one-bg.jpg', '/images/new-arrivals-bg-2.jpg']) as string[],
    eyebrow: t('newArrivals.eyebrow'),
    title: t('newArrivals.title'),
    cta: t('newArrivals.cta')
  };

  const allCollections = collections?.length ? collections : fallback.collections;
  const homepageCollections =
    allCollections
      .filter((c: any) => HOMEPAGE_COLLECTION_TITLES.includes(c.title))
      .sort(
        (a: any, b: any) =>
          HOMEPAGE_COLLECTION_TITLES.indexOf(a.title) - HOMEPAGE_COLLECTION_TITLES.indexOf(b.title)
      ) || [];
  const collectionsLabels = {
    eyebrow: t('collections.eyebrow'),
    title: t('collections.title'),
    intro: t('collections.intro'),
    chapter: t('collections.chapter'),
    viewLink: t('collections.viewLink'),
    viewAll: t('collections.viewAll')
  };

  const allProducts = shopProducts?.length ? shopProducts : fallback.shopProducts;
  const availableProducts = allProducts.filter(
    (p: any) => p.status === 'available' && (p.productLine ?? 'beaded') === 'beaded'
  );
  const currentlyAvailableLabels = {
    eyebrow: t('currentlyAvailable.eyebrow'),
    title: t('currentlyAvailable.title'),
    subtitle: t('currentlyAvailable.subtitle'),
    oneOfOne: t('shop.oneOfOne'),
    cta: t('currentlyAvailable.cta')
  };

  const aotearoaProducts = allProducts.filter(
    (p: any) => (p.productLine ?? 'beaded') === 'aotearoa' && p.status !== 'sold'
  );
  const aotearoaLabels = {
    eyebrow: t('aotearoaTeaser.eyebrow'),
    title: t('aotearoaTeaser.title'),
    intro: t('aotearoaTeaser.intro'),
    oneOfOne: t('shop.oneOfOne'),
    cta: t('aotearoaTeaser.cta'),
    viewAll: t('aotearoaTeaser.viewAllCta')
  };

  const wornByYouLabels = {
    eyebrow: t('wornByYouTeaser.eyebrow'),
    title: t('wornByYouTeaser.title'),
    subtitle: t('wornByYouTeaser.subtitle'),
    shareCta: t('wornByYouTeaser.shareCta'),
    viewCta: t('wornByYouTeaser.viewCta')
  };

  const atelierData = {
    eyebrow: t('atelier.eyebrow'),
    title: t('atelier.title'),
    paragraphs: [t('about.p1'), t('about.p2'), t('about.p3')],
    imageUrl: fallback.atelier.imageUrl,
    imageAlt: fallback.atelier.imageAlt
  };

  const journalItems = journal?.length ? journal : fallback.journal;
  const journalLabels = {
    eyebrow: t('journal.eyebrow'),
    title: t('journal.title'),
    readLink: t('journal.readLink'),
    viewAllCta: t('journal.viewAllCta')
  };

  return (
    <>
      <Hero data={heroData} />
      <Philosophy data={philosophyData} />
      <CurrentlyAvailable items={availableProducts} labels={currentlyAvailableLabels} />
      <NewArrivalsBanner data={newArrivalsData} />
      <Collections
        items={homepageCollections.length ? homepageCollections : allCollections.slice(0, 3)}
        labels={collectionsLabels}
      />
      <AotearoaTeaser items={aotearoaProducts} labels={aotearoaLabels} bannerImageUrl={home?.aotearoaBannerUrl} />

      {/* Worn By You -> The Atelier: a smooth, scroll-position-driven
          "pull up" panel (see PullUpStack) rather than a hard CSS-sticky
          snap or a simple fade. */}
      <PullUpStack
        below={<WornByYouTeaser items={showcase ?? []} labels={wornByYouLabels} />}
        above={<Atelier data={atelierData} />}
      />

      <JournalTeaser items={journalItems} labels={journalLabels} />
    </>
  );
}
