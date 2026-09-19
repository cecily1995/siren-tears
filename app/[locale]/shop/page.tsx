import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getShopProducts, getCollections } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';
import { translateText } from '@/lib/translate';
import ShopGrid from '@/components/ShopGrid';
import PageHeader from '@/components/PageHeader';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'shop' });
  return { title: `${t('eyebrow')} — SIREN TEARS` };
}

export default async function ShopPage({
  params,
  searchParams
}: {
  params: { locale: string };
  searchParams: { category?: string; line?: string; collection?: string; q?: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const [t, products, collections] = await Promise.all([
    getTranslations('shop'),
    getShopProducts(),
    getCollections()
  ]);
  const rawItems = products?.length ? products : fallback.shopProducts;
  // Product names are authored once in English in Sanity -- auto-translate
  // for display so the shop grid isn't the one place still showing raw
  // English on a non-English locale. Cached 30 days per (text, locale) in
  // translateText, so this only costs real translation calls once.
  const items = await Promise.all(
    rawItems.map(async (p: any) => ({
      ...p,
      name: await translateText(p.name, locale),
      stone: await translateText(p.stone, locale)
    }))
  );
  const collectionNames = (collections?.length ? collections : fallback.collections).map(
    (c: any) => c.title
  );

  const labels = {
    filters: {
      all: t('filters.all'),
      rings: t('filters.rings'),
      braceletBead: t('filters.braceletBead'),
      braceletChain: t('filters.braceletChain'),
      necklaces: t('filters.necklaces'),
      pendants: t('filters.pendants'),
      bangles: t('filters.bangles'),
      earrings: t('filters.earrings'),
      archive: t('filters.archive'),
      bespokeShowcase: t('filters.bespokeShowcase')
    },
    lineFilters: {
      all: t('lineFilters.all'),
      beaded: t('lineFilters.beaded'),
      aotearoa: t('lineFilters.aotearoa')
    },
    status: {
      sold: t('status.sold'),
      reserved: t('status.reserved'),
      bespoke: t('status.bespoke')
    },
    oneOfOne: t('oneOfOne'),
    viewPiece: t('viewPiece'),
    lineFilterLabel: t('lineFilterLabel'),
    categoryFilterLabel: t('categoryFilterLabel')
  };

  const matchedCollection = searchParams?.collection
    ? (collections?.length ? collections : fallback.collections).find(
        (c: any) => c.title === searchParams.collection
      )
    : null;

  const dynamicEyebrow = searchParams?.collection
    ? labels.lineFilters.beaded
    : searchParams?.line === 'aotearoa'
      ? labels.lineFilters.aotearoa
      : t('eyebrow');
  const dynamicTitle = searchParams?.collection
    ? searchParams.collection
    : searchParams?.line === 'aotearoa'
      ? t('aotearoaTitle')
      : t('title');
  const dynamicIntro = searchParams?.collection
    ? matchedCollection?.subtitle
    : searchParams?.line === 'aotearoa'
      ? t('aotearoaIntro')
      : t('intro');

  return (
    <>
      <PageHeader
        eyebrow={dynamicEyebrow}
        title={dynamicTitle}
        intro={dynamicIntro}
        imageUrl="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Natural stone jewellery macro detail"
      />

      <section className="bg-ivory px-6 md:px-12 py-12 md:py-20">
        <div className="mx-auto max-w-[1480px]">
          {items.length > 0 ? (
            <ShopGrid
              // Force a full remount whenever the URL's filters change,
              // rather than trusting React to correctly update an
              // existing instance's internal state across a navigation --
              // this guarantees a clean slate every time regardless of
              // where the navigation came from (a different route like a
              // product detail page, the mobile menu, browser back/
              // forward, etc).
              key={`${searchParams?.line ?? ''}|${searchParams?.collection ?? ''}|${searchParams?.category ?? ''}|${searchParams?.q ?? ''}`}
              products={items}
              labels={labels}
              collectionNames={collectionNames}
              initialFilter={searchParams?.category}
              initialLine={searchParams?.line}
              initialCollection={searchParams?.collection}
              initialQuery={searchParams?.q}
            />
          ) : (
            <div className="max-w-lg mx-auto text-center py-16 reveal">
              <p className="serif-display text-[1.6rem] font-light mb-5 text-charcoal">
                {t('emptyTitle')}
              </p>
              <p className="text-[0.95rem] leading-[1.75] text-ash font-light">{t('emptyBody')}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
