import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

export const revalidate = 3600;

export const metadata: Metadata = { title: 'Terms & Conditions — SIREN TEARS' };

export default async function TermsPage({
  params
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return (
    <section className="bg-ivory px-6 md:px-12 pt-40 pb-24 md:pt-48 md:pb-32">
      <div className="mx-auto max-w-[760px]">
        <p className="eyebrow mb-6">Legal</p>
        <h1 className="serif-display text-[clamp(2rem,4vw,2.8rem)] font-light leading-[1.15] mb-4">
          Terms &amp; Conditions
        </h1>
        <p className="text-[0.85rem] text-ash/70 font-light mb-12">Last updated: draft — pending review</p>

        <div className="space-y-10 text-[0.95rem] leading-[1.9] text-ash font-light">
          <div>
            <h2 className="serif-display text-[1.2rem] font-light text-charcoal mb-3">About our pieces</h2>
            <p>
              Each SIREN TEARS piece is handmade using natural stones. Natural stones vary in
              colour, texture, and inclusions — this is part of their character, not a defect.
              Because each piece is one of one, the exact piece shown may not be able to be
              recreated once sold.
            </p>
          </div>

          <div>
            <h2 className="serif-display text-[1.2rem] font-light text-charcoal mb-3">Pricing &amp; currency</h2>
            <p>
              Prices are listed in New Zealand Dollars (NZD) and may be updated from time to time.
              For international customers, any currency conversion, customs duties, or import
              taxes are set by your bank or country and are your responsibility.
            </p>
          </div>

          <div>
            <h2 className="serif-display text-[1.2rem] font-light text-charcoal mb-3">Orders</h2>
            <p>
              Placing an order is an offer to purchase, which we may accept or decline (for
              example, if a one-of-one piece has already sold). Online checkout is being launched
              in stages; until then, orders arranged by email or WhatsApp are confirmed once
              payment has been received.
            </p>
          </div>

          <div>
            <h2 className="serif-display text-[1.2rem] font-light text-charcoal mb-3">Bespoke commissions</h2>
            <p>
              A bespoke request does not create an order or a fixed price. It begins a
              conversation — we will confirm the design, stone, and price with you, and a
              commission is only confirmed once you approve the quote and, where required, make
              payment.
            </p>
          </div>

          <div>
            <h2 className="serif-display text-[1.2rem] font-light text-charcoal mb-3">Shipping</h2>
            <p>
              We ship using NZ Post. Estimated delivery times are targets, not guarantees, and may
              be affected by customs processing or circumstances outside our control. Please see
              our Shipping page for current details.
            </p>
          </div>

          <div>
            <h2 className="serif-display text-[1.2rem] font-light text-charcoal mb-3">Returns &amp; issues</h2>
            <p>
              If there is a problem with your order — damage in transit, a fault, or anything else
              — please contact us as soon as possible after delivery so we can help put it right.
              As many of our pieces are one of one, we handle each situation individually.
            </p>
          </div>

          <div>
            <h2 className="serif-display text-[1.2rem] font-light text-charcoal mb-3">Intellectual property</h2>
            <p>
              All designs, photography, and text on this site belong to SIREN TEARS unless
              otherwise stated, and may not be reproduced without permission.
            </p>
          </div>

          <div>
            <h2 className="serif-display text-[1.2rem] font-light text-charcoal mb-3">Governing law</h2>
            <p>These terms are governed by the laws of New Zealand.</p>
          </div>

          <div>
            <h2 className="serif-display text-[1.2rem] font-light text-charcoal mb-3">Contact</h2>
            <p>
              Questions about these terms can be sent to{' '}
              <a href="mailto:sirentears1995@gmail.com" className="text-charcoal link-underline">
                sirentears1995@gmail.com
              </a>
              .
            </p>
          </div>

          <p className="text-[0.8rem] text-ash/60 pt-6 border-t border-charcoal/10">
            This page is a general-purpose draft and has not been reviewed by a lawyer. We
            recommend having it reviewed against New Zealand consumer law (and any other
            jurisdictions you serve) before relying on it as your final terms.
          </p>
        </div>
      </div>
    </section>
  );
}
