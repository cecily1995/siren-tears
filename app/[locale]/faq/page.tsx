import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

export const revalidate = 3600;

export const metadata: Metadata = { title: 'FAQ — SIREN TEARS' };

const FAQS = [
  {
    q: 'Are your pieces really one of one?',
    a: "Yes. Every piece is made individually with a natural stone, and no two stones are ever exactly alike. Once a piece is sold, that exact piece is retired — it will not be recreated."
  },
  {
    q: 'How can I purchase a piece right now?',
    a: "Our online checkout is launching soon. In the meantime, browse the Shop and use the Enquire, Email, or WhatsApp option on any piece you're drawn to, and we'll help you complete the purchase directly."
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes. We ship worldwide from our New Zealand studio via NZ Post. Orders over NZD $500 ship free internationally; see our Shipping page for details.'
  },
  {
    q: 'Will I need to pay customs or import duties?',
    a: "Possibly, depending on your country. Any customs duties, taxes, or import charges are set by your local authorities and are the responsibility of the recipient. See our Shipping page for more."
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
      <section className="relative bg-charcoal text-ivory px-6 md:px-12 pt-40 pb-20 md:pt-48 md:pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.14] pointer-events-none"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 15%, rgba(245, 215, 165, 0.55) 0%, rgba(245, 215, 165, 0) 70%)'
          }}
        />
        <div className="relative mx-auto max-w-[820px] text-center reveal">
          <p className="eyebrow text-gold/85 mb-6">FAQ</p>
          <h1 className="serif-display text-[clamp(2.2rem,4.8vw,3.4rem)] font-light leading-[1.12]">
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      <section className="bg-ivory px-6 md:px-12 py-20 md:py-28">
        <div className="mx-auto max-w-[820px] divide-y divide-charcoal/10">
          {FAQS.map((item, i) => (
            <div key={i} className="py-8 reveal" style={{ transitionDelay: `${(i % 6) * 60}ms` }}>
              <h2 className="serif-display text-[1.2rem] font-light text-charcoal mb-3">
                {item.q}
              </h2>
              <p className="text-[0.92rem] leading-[1.9] text-ash font-light">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
