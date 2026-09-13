import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getShopProducts } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';
import ShopGrid from '@/components/ShopGrid';

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
  params
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const [t, products] = await Promise.all([getTranslations('shop'), getShopProducts()]);
  const items = products?.length ? products : fallback.shopProducts;

  const labels = {
    filters: {
      all: t('filters.all'),
      bracelets: t('filters.bracelets'),
      necklaces: t('filters.necklaces'),
      rings: t('filters.rings'),
      pendants: t('filters.pendants'),
      archive: t('filters.archive')
    },
    status: {
      sold: t('status.sold'),
      reserved: t('status.reserved'),
      bespoke: t('status.bespoke')
    },
    oneOfOne: t('oneOfOne'),
    viewPiece: t('viewPiece')
  };

  return (
    <>
      <section className="relative bg-charcoal text-ivory px-6 md:px-12 pt-40 pb-24 md:pt-48 md:pb-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.14] pointer-events-none"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 15%, rgba(245, 215, 165, 0.55) 0%, rgba(245, 215, 165, 0) 70%)'
          }}
        />
        <div className="relative mx-auto max-w-[820px] text-center reveal">
          <p className="eyebrow text-gold/85 mb-6">{t('eyebrow')}</p>
          <h1 className="serif-display text-[clamp(2.2rem,4.8vw,3.8rem)] font-light leading-[1.12]">
            {t('title')}
          </h1>
          <p className="mt-7 max-w-xl mx-auto text-[0.98rem] leading-[1.95] text-ivory/70 font-light">
            {t('intro')}
          </p>
        </div>
      </section>

      <section className="bg-ivory px-6 md:px-12 py-20 md:py-28">
        <div className="mx-auto max-w-[1480px]">
          {items.length > 0 ? (
            <ShopGrid products={items} labels={labels} />
          ) : (
            <div className="max-w-lg mx-auto text-center py-16 reveal">
              <p className="serif-display text-[1.6rem] font-light mb-5 text-charcoal">
                {t('emptyTitle')}
              </p>
              <p className="text-[0.95rem] leading-[1.9] text-ash font-light">{t('emptyBody')}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
