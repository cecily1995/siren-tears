import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getSiteSettings } from '@/sanity/lib/queries';
import { fallback } from '@/components/fallback';
import PageHeader from '@/components/PageHeader';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'contactPage' });
  return { title: `${t('title')} — SIREN TEARS` };
}

export default async function ContactPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);

  const [t, settings] = await Promise.all([getTranslations('contactPage'), getSiteSettings()]);
  const data = settings ?? fallback.settings;

  const methods = [
    data.email && { label: t('email'), value: data.email, href: `mailto:${data.email}` },
    data.whatsappUrl && { label: t('whatsapp'), value: t('whatsapp'), href: data.whatsappUrl },
    data.instagramUrl && { label: t('instagram'), value: '@sirentears.jewellry', href: data.instagramUrl },
    data.tiktokUrl && { label: t('tiktok'), value: t('tiktok'), href: data.tiktokUrl },
    data.xiaohongshuUrl && { label: t('xiaohongshu'), value: t('xiaohongshu'), href: data.xiaohongshuUrl },
    data.douyinUrl && { label: t('douyin'), value: t('douyin'), href: data.douyinUrl }
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <PageHeader eyebrow={t('eyebrow')} title={t('title')}>
      <p className="mt-7 max-w-xl mx-auto text-[0.98rem] leading-[1.95] text-ash font-light">
        {t('intro')}
      </p>

      {methods.length > 0 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {methods.map((m) => (
            <a
              key={m.label}
              href={m.href}
              target={m.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={m.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              className="px-6 py-3 border border-charcoal/20 hover:border-charcoal/50 text-[11px] tracking-[0.24em] uppercase text-charcoal transition-colors"
            >
              {m.label}
            </a>
          ))}
        </div>
      )}
    </PageHeader>
  );
}
