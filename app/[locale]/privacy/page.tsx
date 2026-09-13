import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

export const revalidate = 3600;

export const metadata: Metadata = { title: 'Privacy Policy — SIREN TEARS' };

export default async function PrivacyPage({
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
          Privacy Policy
        </h1>
        <p className="text-[0.85rem] text-ash/70 font-light mb-12">Last updated: draft — pending review</p>

        <div className="space-y-10 text-[0.95rem] leading-[1.9] text-ash font-light">
          <p>
            SIREN TEARS ("we", "us", "our") respects your privacy. This policy explains what
            information we collect, how we use it, and the choices available to you.
          </p>

          <div>
            <h2 className="serif-display text-[1.2rem] font-light text-charcoal mb-3">Information we collect</h2>
            <p>
              When you contact us, submit a bespoke request, or place an order, we may collect
              your name, email address, phone/WhatsApp number, shipping address, and any details
              you choose to share about your enquiry (including images you upload). If you make a
              purchase, our payment provider will process your payment details directly — we do
              not store your card information ourselves.
            </p>
          </div>

          <div>
            <h2 className="serif-display text-[1.2rem] font-light text-charcoal mb-3">How we use it</h2>
            <p>
              We use this information to respond to enquiries, prepare bespoke quotes, process
              and ship orders, provide customer support, and — only with your consent — send
              updates about SIREN TEARS. We do not sell your personal information.
            </p>
          </div>

          <div>
            <h2 className="serif-display text-[1.2rem] font-light text-charcoal mb-3">Third-party services</h2>
            <p>
              We use third-party services to run this website and our business, which may process
              your data on our behalf under their own privacy and security practices. These
              currently include our website hosting provider, our content and image management
              system, and (once available) a payment processor and shipping carrier (NZ Post).
            </p>
          </div>

          <div>
            <h2 className="serif-display text-[1.2rem] font-light text-charcoal mb-3">Cookies</h2>
            <p>
              Our website may use basic cookies or similar technologies necessary for the site to
              function, and — where enabled — analytics to help us understand how the site is
              used. You can control cookies through your browser settings.
            </p>
          </div>

          <div>
            <h2 className="serif-display text-[1.2rem] font-light text-charcoal mb-3">Your rights</h2>
            <p>
              You may ask us what personal information we hold about you, request a correction,
              or ask us to delete it, subject to any legal obligations we may have to retain
              certain records (such as for tax or shipping purposes). To make a request, contact
              us using the details below.
            </p>
          </div>

          <div>
            <h2 className="serif-display text-[1.2rem] font-light text-charcoal mb-3">Contact</h2>
            <p>
              Questions about this policy can be sent to{' '}
              <a href="mailto:sirentears1995@gmail.com" className="text-charcoal link-underline">
                sirentears1995@gmail.com
              </a>
              .
            </p>
          </div>

          <p className="text-[0.8rem] text-ash/60 pt-6 border-t border-charcoal/10">
            This page is a general-purpose draft and has not been reviewed by a lawyer. We
            recommend having it reviewed against New Zealand privacy law (and any other
            jurisdictions you serve) before relying on it as your final policy.
          </p>
        </div>
      </div>
    </section>
  );
}
