import { setRequestLocale, getTranslations } from 'next-intl/server';
import Hero from '@/components/Hero';
import Philosophy from '@/components/Philosophy';
import Collections from '@/components/Collections';
import FeaturedProduct from '@/components/FeaturedProduct';
import Journal from '@/components/Journal';
import BrandStory from '@/components/BrandStory';
import {
  getHomepage,
  getCollections,
  getJournal,
  getBrandStory
} from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';

export const revalidate = 60;

export default async function HomePage({
  params
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const [home, collections, journal, brandStory] = await Promise.all([
    getHomepage(),
    getCollections(),
    getJournal(),
    getBrandStory()
  ]);

  const t = await getTranslations();

  // For all locales, editorial CHROME comes from messages.
  // IMAGES always come from Sanity (or fallback URL).
  // Dynamic content (collection titles, journal titles, brand info from CMS) stays as user entered.

  const heroBg = home?.hero?.bgUrl ?? fallback.hero.bgUrl;
  const heroBgAlt = home?.hero?.bgAlt ?? fallback.hero.bgAlt;

  const heroData = {
    eyebrow: t('hero.eyebrow'),
    title: 'SIREN TEARS',
    body: t('hero.body'),
    ctaLabel: t('hero.cta'),
    bgUrl: heroBg,
    bgAlt: heroBgAlt,
    scrollLabel: t('hero.scroll')
  };

  const philosophyData = {
    sectionLabel: t('philosophy.label'),
    sectionTitle: t('philosophy.title'),
    pillars: [
      { title: t('philosophy.pillars.natural.title'), body: t('philosophy.pillars.natural.body') },
      { title: t('philosophy.pillars.timeless.title'), body: t('philosophy.pillars.timeless.body') },
      { title: t('philosophy.pillars.quality.title'), body: t('philosophy.pillars.quality.body') }
    ]
  };

  const collectionsLabels = {
    eyebrow: t('collections.eyebrow'),
    title: t('collections.title'),
    intro: t('collections.intro'),
    chapter: t('collections.chapter'),
    viewLink: t('collections.viewLink')
  };

  const featuredFromSanity = home?.featured;
  const featuredData = {
    title: featuredFromSanity?.title ?? t('featured.title'),
    subtitle: t('featured.subtitle'),
    body: t('featured.body'),
    imageUrl: featuredFromSanity?.imageUrl ?? fallback.featured.imageUrl,
    imageAlt: featuredFromSanity?.imageAlt ?? fallback.featured.imageAlt,
    detailUrl: featuredFromSanity?.detailUrl ?? fallback.featured.detailUrl,
    stoneTitle: t('featured.stoneTitle'),
    stoneBody: t('featured.stoneBody'),
    materialTitle: t('featured.materialTitle'),
    materialBody: t('featured.materialBody'),
    stylingTitle: t('featured.stylingTitle'),
    stylingBody: t('featured.stylingBody')
  };

  const journalLabels = {
    eyebrow: t('journal.eyebrow'),
    title: t('journal.title'),
    intro: t('journal.intro'),
    readLink: t('journal.readLink')
  };

  const brandStoryData = {
    eyebrow: t('about.eyebrow'),
    title: t('about.title'),
    paragraphs: [t('about.p1'), t('about.p2'), t('about.p3')],
    imageUrl: brandStory?.imageUrl ?? fallback.brandStory.imageUrl,
    imageAlt: brandStory?.imageAlt ?? fallback.brandStory.imageAlt,
    stats: [
      { value: '06', label: t('about.stats.years') },
      { value: '35+', label: t('about.stats.countries') },
      { value: '01', label: t('about.stats.studio') }
    ]
  };

  return (
    <>
      <Hero data={heroData} />
      <Philosophy data={philosophyData} />
      <Collections
        items={collections?.length ? collections : fallback.collections}
        labels={collectionsLabels}
      />
      <FeaturedProduct data={featuredData} />
      <Journal
        items={journal?.length ? journal : fallback.journal}
        labels={journalLabels}
      />
      <BrandStory data={brandStoryData} />
    </>
  );
}
