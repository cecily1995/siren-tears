import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import ClearBagOnMount from '@/components/ClearBagOnMount';

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

  return (
    <section className="bg-ivory px-6 md:px-12 pt-40 md:pt-48 pb-28 md:pb-36 min-h-[70vh]">
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
