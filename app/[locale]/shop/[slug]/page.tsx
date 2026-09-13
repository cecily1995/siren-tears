import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getShopProductBySlug, getSiteSettings } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';

export const revalidate = 60;

const WHATSAPP_NUMBER = '64274326262';

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

  const [t, product, settings] = await Promise.all([
    getTranslations('shop'),
    resolveProduct(slug),
    getSiteSettings()
  ]);

  if (!product) notFound();

  const email = settings?.email ?? fallback.settings.email;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Siren Tears, I'm enquiring about ${product.name}.`
  )}`;
  const isSold = product.status === 'sold';
  const isReserved = product.status === 'reserved';
  const statusLabel = isSold ? t('status.sold') : isReserved ? t('status.reserved') : null;

  const details = [
    product.stone && { label: t('stoneTitle'), value: product.stone },
    product.material && { label: t('materialLabel'), value: product.material },
    product.length && { label: t('lengthLabel'), value: product.length },
    product.craftedIn && { label: t('craftedInLabel'), value: product.craftedIn }
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <section className="bg-ivory px-6 md:px-12 pt-32 md:pt-40 pb-24 md:pb-32">
      <div className="mx-auto max-w-[1200px]">
        <Link
          href="/shop"
          className="inline-block text-[11px] tracking-[0.28em] uppercase text-ash link-underline mb-10"
        >
          ← {t('backToShop')}
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-6 reveal">
            <div className="aspect-[4/5] overflow-hidden bg-charcoal/5 relative">
              {product.images?.[0]?.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0].url}
                  alt={product.images[0].alt || product.name}
                  className={`w-full h-full object-cover ${isSold ? 'grayscale opacity-70' : ''}`}
                />
              )}
              {statusLabel && (
                <span className="absolute top-4 left-4 bg-ivory/95 text-charcoal text-[10px] tracking-[0.24em] uppercase px-3 py-1.5 font-light">
                  {statusLabel}
                </span>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.slice(1, 5).map((img: any, i: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img.url}
                    alt={img.alt || ''}
                    className="aspect-square object-cover w-full bg-charcoal/5"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-6 reveal" style={{ transitionDelay: '120ms' }}>
            {product.collectionTitle && (
              <p className="eyebrow mb-4">{product.collectionTitle}</p>
            )}
            <h1 className="serif-display text-[clamp(1.9rem,4vw,2.8rem)] font-light leading-[1.1] text-charcoal">
              {product.name}
            </h1>
            {product.stone && (
              <p className="mt-3 text-[1rem] text-ash font-light">{product.stone}</p>
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
              <p className="text-[0.9rem] text-ash font-light leading-relaxed mb-5">
                {t('purchaseNote')}
              </p>
              <div className="flex flex-wrap gap-6">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] tracking-[0.3em] uppercase text-charcoal link-underline"
                >
                  WhatsApp
                </a>
                {email && (
                  <a
                    href={`mailto:${email}?subject=${encodeURIComponent(product.name + ' — ' + t('enquireCta'))}`}
                    className="text-[11px] tracking-[0.3em] uppercase text-charcoal link-underline"
                  >
                    {t('enquireCta')}
                  </a>
                )}
              </div>
            </div>

            {details.length > 0 && (
              <div className="mt-10 pt-8 border-t border-charcoal/10">
                <p className="eyebrow mb-5">{t('detailsTitle')}</p>
                <dl className="space-y-2.5">
                  {details.map((d, i) => (
                    <div key={i} className="flex justify-between text-[0.9rem] font-light">
                      <dt className="text-ash">{d.label}</dt>
                      <dd className="text-charcoal">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {product.stoneStory && (
              <div className="mt-10 pt-8 border-t border-charcoal/10">
                <p className="eyebrow mb-3">{t('stoneTitle')}</p>
                <p className="text-[0.92rem] leading-[1.9] text-ash font-light">
                  {product.stoneStory}
                </p>
              </div>
            )}

            {product.pieceStory && (
              <div className="mt-8">
                <p className="eyebrow mb-3">{t('pieceTitle')}</p>
                <p className="text-[0.92rem] leading-[1.9] text-ash font-light">
                  {product.pieceStory}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
