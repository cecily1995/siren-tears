import { setRequestLocale, getTranslations } from 'next-intl/server';
import Hero from '@/components/Hero';
import Philosophy from '@/components/Philosophy';
import OneOfOne from '@/components/OneOfOne';
import Collections from '@/components/Collections';
import WornByYouTeaser from '@/components/WornByYouTeaser';
import Atelier from '@/components/Atelier';
import {
  getHomepage,
  getCollections,
  getBuyerShowcase
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

  const [home, collections, showcase] = await Promise.all([
    getHomepage(),
    getCollections(),
    getBuyerShowcase()
  ]);

  const t = await getTranslations();

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

  const oneOfOneData = {
    eyebrow: t('oneOfOne.eyebrow'),
    title: t('oneOfOne.title'),
    body: t('oneOfOne.body'),
    cta: t('oneOfOne.cta')
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
    stats: [
      { value: '06', label: t('about.stats.years') },
      { value: '35+', label: t('about.stats.countries') },
      { value: '01', label: t('about.stats.studio') }
    ],
    imageUrl: fallback.atelier.imageUrl,
    imageAlt: fallback.atelier.imageAlt
  };

  return (
    <>
      <Hero data={heroData} />
      <Philosophy data={philosophyData} />
      <OneOfOne data={oneOfOneData} />
      <Collections
        items={homepageCollections.length ? homepageCollections : allCollections.slice(0, 3)}
        labels={collectionsLabels}
      />
      <WornByYouTeaser items={showcase ?? []} labels={wornByYouLabels} />
      <Atelier data={atelierData} />
    </>
  );
}
