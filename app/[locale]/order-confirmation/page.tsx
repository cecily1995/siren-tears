import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import ClearBagOnMount from '@/components/ClearBagOnMount';
import { getPurchaseRequestByOrderNumber } from '@/sanity/lib/queries';

export const metadata: Metadata = { title: 'Order confirmed — SIREN TEARS' };

export default async function OrderConfirmationPage({
  params,
  searchParams
}: {
  params: { locale: string };
  searchParams: { order?: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations('orderConfirmation');
  const order = searchParams?.order ? await getPurchaseRequestByOrderNumber(searchParams.order) : null;

  return (
    <section className="bg-white px-6 md:px-12 pt-40 md:pt-48 pb-28 md:pb-36 min-h-[70vh]">
      <ClearBagOnMount />
      <div className="mx-auto max-w-[560px] text-center">
        <p className="eyebrow mb-5">{t('eyebrow')}</p>
        <h1 className="serif-display text-[clamp(1.6rem,3.5vw,2.3rem)] font-light text-charcoal mb-5">
          {t('title')}
        </h1>
        <p className="text-[0.95rem] text-ash font-light leading-relaxed mb-8">{t('body')}</p>

        {searchParams?.order && (
          <p className="text-[0.8rem] text-ash/70 font-light tracking-wide mb-10">
            {t('orderLabel')}: <span className="text-charcoal">{searchParams.order}</span>
          </p>
        )}

        {order?.items?.length > 0 && (
          <div className="text-left border border-charcoal/10 px-6 py-6 mb-10">
            <ul className="space-y-4">
              {order.items.map((item: any, i: number) => (
                <li key={i} className="flex items-center gap-4">
                  <div className="w-14 h-16 shrink-0 bg-charcoal/5 overflow-hidden">
                    {item.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.productName || ''} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <p className="flex-1 min-w-0 text-[0.85rem] text-charcoal font-light truncate">
                    {item.productName}
                  </p>
                  {typeof item.price === 'number' && (
                    <p className="text-[0.85rem] text-charcoal font-light shrink-0">NZD ${item.price}</p>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-5 border-t border-charcoal/10 text-[0.82rem] text-ash font-light space-y-1">
              <div>
                {t('shippingMethodLabel')}: {order.shippingMethod || '—'}
                {typeof order.shippingCost === 'number' &&
                  ` (${order.shippingCost === 0 ? t('freeLabel') : `NZD $${order.shippingCost}`})`}
              </div>
              {order.deliveryAddress && (
                <div>
                  {[order.deliveryAddress, order.deliveryCity, order.deliveryRegion, order.deliveryPostalCode, order.country]
                    .filter(Boolean)
                    .join(', ')}
                </div>
              )}
            </div>
          </div>
        )}

        <Link
          href="/shop"
          className="inline-block text-[11px] tracking-[0.3em] uppercase text-ivory bg-charcoal px-8 py-3.5 hover:bg-charcoal/85 transition-colors"
        >
          {t('backToShopCta')}
        </Link>
      </div>
    </section>
  );
}
