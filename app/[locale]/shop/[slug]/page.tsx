import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getShopProductBySlug } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';
import ProductGallery from '@/components/ProductGallery';
import AddToBagButton from '@/components/AddToBagButton';
import ProductAccordionSection from '@/components/ProductAccordionSection';
import WishlistButton from '@/components/WishlistButton';
import { translateFields } from '@/lib/translate';

export const revalidate = 60;


async function resolveProduct(slug: string) {
  const fromSanity = await getShopProductBySlug(slug);
  if (fromSanity) return fromSanity;
  return fallback.shopProducts.find((p) => p.slug.current === slug) ?? null;
}

export async function generateMetadata({
  params
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const product = await resolveProduct(params.slug);
  return { title: product ? `${product.name} — SIREN TEARS` : 'SIREN TEARS' };
}

export default async function ShopProductPage({
  params
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  setRequestLocale(locale);

  const [t, product] = await Promise.all([getTranslations('shop'), resolveProduct(slug)]);

  if (!product) notFound();

  // Product copy (name, stone type, stone story, piece story, details) is
  // authored once in English in Sanity; auto-translate it for non-English
  // locales rather than requiring a manually-translated copy per language.
  const translated = await translateFields(
    {
      name: product.name,
      collectionTitle: product.collectionTitle,
      stone: product.stone,
      stoneStory: product.stoneStory,
      pieceStory: product.pieceStory,
      materialsCare: product.materialsCare,
      packagingDescription: product.packagingDescription,
      material: product.material,
      length: product.length,
      craftedIn: product.craftedIn
    },
    locale
  );

  const isSold = product.status === 'sold';
  const isReserved = product.status === 'reserved';
  const statusLabel = isSold ? t('status.sold') : isReserved ? t('status.reserved') : null;

  // "The Stone" is deliberately left out here -- it's already shown as the
  // subtitle right under the product title, so repeating it in this list
  // was pure duplication.
  const details = [
    product.material && { label: t('materialLabel'), value: translated.material },
    product.length && { label: t('lengthLabel'), value: translated.length },
    product.craftedIn && { label: t('craftedInLabel'), value: translated.craftedIn }
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <section className="bg-ivory px-6 md:px-12 pt-[72px] md:pt-24 pb-14 md:pb-20">
      <div className="mx-auto max-w-[1200px]">
        <Link
          href="/shop"
          className="inline-block text-[11px] tracking-[0.28em] uppercase text-ash link-underline mb-10"
        >
          ← {t('backToShop')}
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <div className="md:col-span-6 reveal">
            <ProductGallery
              images={product.images ?? []}
              productName={product.name}
              isSold={isSold}
              statusLabel={statusLabel}
            />
          </div>

          <div className="md:col-span-6 md:sticky md:top-28 md:self-start reveal" style={{ transitionDelay: '120ms' }}>
            {product.collectionTitle && (
              <p className="eyebrow mb-4">{product.collectionTitle}</p>
            )}
            <div className="flex items-start justify-between gap-4">
              <h1 className="serif-display text-[clamp(1.35rem,2.6vw,1.9rem)] font-light leading-[1.35] text-charcoal">
                {product.name}
              </h1>
              <WishlistButton
                productId={product._id}
                slug={product.slug?.current ?? slug}
                name={product.name}
                price={product.price}
                imageUrl={product.images?.[0]?.url}
                className="shrink-0 mt-2 w-9 h-9 flex items-center justify-center border border-charcoal/15 hover:border-charcoal/40 transition-colors"
                iconClassName="text-charcoal/70"
              />
            </div>
            {translated.stone && (
              <p className="mt-3 text-[1rem] text-ash font-light">{translated.stone}</p>
            )}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-[1.3rem] text-charcoal font-light">
                NZD ${product.price}
              </span>
              {!isSold && !isReserved && (
                <span className="text-[10px] tracking-[0.24em] uppercase text-gold font-light">
                  {t('oneOfOne')}
                </span>
              )}
            </div>

            <p className="mt-6 text-[0.85rem] text-ash/80 font-light leading-relaxed max-w-sm">
              {t('oneOfOneNote')}
            </p>

            <div className="mt-8 pt-8 border-t border-charcoal/10">
              {isSold || isReserved ? (
                <p className="text-[0.9rem] text-ash font-light leading-relaxed">
                  {isSold ? t('soldNote') : t('reservedNote')}
                </p>
              ) : (
                <AddToBagButton
                  productId={product._id}
                  slug={product.slug?.current ?? slug}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.images?.[0]?.url}
                  category={product.category}
                />
              )}
            </div>

            <div className="mt-8">
              <ProductAccordionSection title={t('descriptionTitle')} defaultOpen>
                <div className="space-y-4">
                  {translated.stoneStory && (
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-ash/50 mb-1.5">
                        {t('stoneTitle')}
                      </p>
                      <p>{translated.stoneStory}</p>
                    </div>
                  )}
                  {translated.pieceStory && (
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-ash/50 mb-1.5">
                        {t('pieceTitle')}
                      </p>
                      <p>{translated.pieceStory}</p>
                    </div>
                  )}
                  {!translated.stoneStory && !translated.pieceStory && <p>{t('descriptionFallback')}</p>}
                </div>
              </ProductAccordionSection>

              {details.length > 0 && (
                <ProductAccordionSection title={t('detailsTitle')}>
                  <dl className="space-y-4">
                    {details.map((d, i) => (
                      <div key={i}>
                        <dt className="text-[10px] tracking-[0.2em] uppercase text-ash/50 mb-1">
                          {d.label}
                        </dt>
                        <dd className="text-charcoal">{d.value}</dd>
                      </div>
                    ))}
                  </dl>
                </ProductAccordionSection>
              )}

              {translated.materialsCare && (
                <ProductAccordionSection title={t('materialsCareTitle')}>
                  <p>{translated.materialsCare}</p>
                </ProductAccordionSection>
              )}

              {(translated.packagingDescription || product.packagingImageUrl) && (
                <ProductAccordionSection title={t('packagingTitle')}>
                  {translated.packagingDescription && <p className="mb-4">{translated.packagingDescription}</p>}
                  {product.packagingImageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.packagingImageUrl}
                      alt={product.packagingImageAlt || `${product.name} packaging`}
                      className="w-full h-auto object-contain"
                    />
                  )}
                </ProductAccordionSection>
              )}
            </div>
          </div>
        </div>

        {/* Full image story -- every product photo shown again, stacked
            continuously with no gaps, like an editorial spread. */}
        {product.images && product.images.length > 1 && (
          <div className="mt-16 md:mt-24 mx-auto max-w-[720px] space-y-1">
            {product.images.map((img: { url: string; alt?: string }, i: number) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={img.url}
                alt={img.alt || product.name}
                className={`w-full h-auto ${isSold ? 'grayscale opacity-70' : ''}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
