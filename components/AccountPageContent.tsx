'use client';

import { useEffect, useState } from 'react';
import PageHeader from './PageHeader';
import AccountLookupForm from './AccountLookupForm';

// Mirrors exactly how the Wishlist page handles this: a light header
// (eyebrow + title only, no intro/background image, no extra section
// padding) when there's a login screen to show, versus the full header
// when the account/orders view is showing. Previously this page always
// rendered the full header regardless of login state, which is why the
// login screen reached from here had so much more space above it than
// the one reached from Wishlist -- title/intro/image plus generous
// section padding, then the login form's own heading on top of that.
export default function AccountPageContent({
  eyebrow,
  title,
  intro,
  imageUrl,
  imageAlt
}: {
  eyebrow: string;
  title: string;
  intro: string;
  imageUrl: string;
  imageAlt: string;
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
          <AccountLookupForm />
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} intro={intro} imageUrl={imageUrl} imageAlt={imageAlt} />
      <section className="bg-ivory px-6 md:px-12 py-20 md:py-28">
        <div className="mx-auto max-w-[900px]">
          <AccountLookupForm />
        </div>
      </section>
    </>
  );
}
