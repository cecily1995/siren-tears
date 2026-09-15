import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import PageHeader from '@/components/PageHeader';
import { Link } from '@/i18n/routing';

export const revalidate = 3600;

export const metadata: Metadata = { title: 'FAQ — SIREN TEARS' };

const FAQS = [
  {
    q: 'Are your pieces really one of one?',
    a: "Yes. Every piece is made individually with a natural stone, and no two stones are ever exactly alike. Once a piece is sold, that exact piece is retired — it will not be recreated."
  },
  {
    q: 'How can I purchase a piece right now?',
    a: "Add the piece to your bag, fill in your details, and pay securely by card at checkout. Prefer to talk it through first? You're welcome to use the Enquire, Email, or WhatsApp option on any piece instead."
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes. We ship worldwide from our New Zealand studio via NZ Post. Orders over NZD $500 ship free internationally; see our Shipping & Delivery page for details.',
    extra: (
      <>
        Members of The Siren Circle enjoy free shipping on orders over NZD $400.{' '}
        <Link href="/membership" className="text-gold hover:text-gold/80 link-underline">
          → Join the Siren Circle
        </Link>
      </>
    )
  },
  {
    q: 'Will I need to pay customs or import duties?',
    a: "Possibly, depending on your country. Any customs duties, taxes, or import charges are set by your local authorities and are the responsibility of the recipient. See our Shipping & Delivery page for more."
  },
  {
    q: 'How long does a bespoke piece take?',
    a: 'Handmade natural stone bracelets and necklaces are generally completed within one week of confirming your design and stone. Hand-set gemstone rings and fine jewellery take approximately two months. Both are estimates — see our Bespoke page for details.'
  },
  {
    q: 'How do I care for my piece?',
    a: 'Avoid prolonged water exposure, apply perfume and cosmetics before wearing your jewellery, store pieces separately in a dry place, and clean gently with a soft, dry cloth. See our Care page for the full guide.'
  },
  {
    q: 'What is the Siren Circle?',
    a: "Our membership programme, launching soon. It's built around access and relationship rather than points or discounts — early access to new pieces, a welcome gift, member shipping, and a direct line to the Atelier. See our Membership page."
  },
  {
    q: "I have a question that isn't answered here.",
    a: "We're happy to help personally — write to us by email or WhatsApp and we'll get back to you."
  }
];

export default async function FaqPage({
  params
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        imageUrl="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Natural stone texture"
      />

      <section className="bg-ivory px-6 md:px-12 py-20 md:py-28">
        <div className="mx-auto max-w-[820px] divide-y divide-charcoal/10">
          {FAQS.map((item, i) => (
            <div key={i} className="py-8 reveal" style={{ transitionDelay: `${(i % 6) * 60}ms` }}>
              <h2 className="serif-display text-[1.2rem] font-light text-charcoal mb-3">
                {item.q}
              </h2>
              <p className="text-[0.92rem] leading-[1.9] text-ash font-light">{item.a}</p>
              {'extra' in item && item.extra && (
                <p className="mt-3 text-[0.92rem] leading-[1.9] text-ash font-light">{item.extra}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
