'use client';

import { useEffect, useState } from 'react';
import PageHeader from './PageHeader';
import AccountLookupForm from './AccountLookupForm';

// This page (My Siren / profile) now shows only personal info, member
// code, tier and benefits -- orders moved to their own page/component
// (OrdersPageContent). Header padding halved from the original
// PageHeader treatment per the request, using a compact custom header
// (same approach as Wishlist) rather than changing PageHeader itself,
// which is shared by many other pages.
export default function AccountPageContent({
  eyebrow,
  title,
  intro
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  const [checked, setChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setLoggedIn(Boolean(data.member));
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!checked) {
    return <div className="min-h-[60vh]" />;
  }

  if (!loggedIn) {
    return (
      <>
        <PageHeader eyebrow={eyebrow} title={title} />
        <section className="bg-ivory px-6 md:px-12">
          <AccountLookupForm view="profile" />
        </section>
      </>
    );
  }

  return (
    <>
      <div className="px-6 md:px-12 pt-14 md:pt-16 pb-4 md:pb-6 max-w-[900px] mx-auto text-left">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="serif-display text-[1.7rem] md:text-[2rem] font-light text-charcoal">{title}</h1>
        {intro && <p className="mt-3 text-[0.9rem] leading-[1.8] text-ash font-light max-w-lg">{intro}</p>}
      </div>
      <section className="bg-ivory px-6 md:px-12 py-10 md:py-14">
        <div className="mx-auto max-w-[900px]">
          <AccountLookupForm view="profile" />
        </div>
      </section>
    </>
  );
}
