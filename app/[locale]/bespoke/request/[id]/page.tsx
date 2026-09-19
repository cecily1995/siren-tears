import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getBespokeRequestById } from '@/sanity/lib/queries';
import PageHeader from '@/components/PageHeader';

export const revalidate = 0;

export default async function BespokeRequestPage({
  params
}: {
  params: { locale: string; id: string };
}) {
  const { locale, id } = params;
  setRequestLocale(locale);

  const [t, request] = await Promise.all([getTranslations('bespoke.form'), getBespokeRequestById(id)]);

  if (!request) {
    notFound();
  }

  const submitted = request.submittedAt
    ? new Date(request.submittedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  const rows: { label: string; value?: string }[] = [
    {
      label: t('pieceTypeLabel'),
      value: request.pieceType ? t(`pieceTypes.${request.pieceType}`) : undefined
    },
    { label: t('genderLabel'), value: request.gender ? t(`genders.${request.gender}`) : undefined },
    { label: t('zodiacLabel'), value: request.zodiac },
    { label: t('wristSizeLabel'), value: request.wristSize },
    { label: t('ringSizeLabel'), value: request.ringSize },
    {
      label: t('coloursLabel'),
      value: request.colours?.length
        ? request.colours.map((c: string) => t(`colours2.${c}`)).join(', ')
        : undefined
    },
    {
      label: t('styleLabel'),
      value: request.styles?.length ? request.styles.map((s: string) => t(`styles.${s}`)).join(', ') : undefined
    },
    { label: t('noteLabel'), value: request.note }
  ].filter((r) => r.value);

  return (
    <>
      <PageHeader
        eyebrow="Bespoke"
        title={request.name ? `${request.name}'s Bespoke Request` : 'Bespoke Request'}
        intro={submitted ? `Submitted ${submitted}` : undefined}
        imageUrl="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Hands shaping jewellery at a quiet workbench"
      />
      <section className="bg-ivory px-6 md:px-12 py-12 md:py-16">
        <div className="mx-auto max-w-[600px] border border-charcoal/12 bg-pearl p-8 md:p-10">
          <dl className="divide-y divide-charcoal/10">
            {rows.map((r, i) => (
              <div key={i} className="py-3.5 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <dt className="text-[10px] tracking-[0.24em] uppercase text-ash/60 font-light sm:w-40 shrink-0">
                  {r.label}
                </dt>
                <dd className="text-[0.95rem] text-charcoal font-light">{r.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 pt-6 border-t border-charcoal/10 flex justify-between items-center">
            <span className="text-[10px] tracking-[0.24em] uppercase text-ash/50">Status</span>
            <span className="text-[0.9rem] text-gold font-light capitalize">{request.status}</span>
          </div>
        </div>
      </section>
    </>
  );
}
