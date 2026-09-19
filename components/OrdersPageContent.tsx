'use client';

import { useEffect, useState } from 'react';
import InlineLoginForm from './InlineLoginForm';
import AccountLookupForm from './AccountLookupForm';

// My Orders: deliberately plain -- no PageHeader/background image, just
// a white page. When logged out, shows the same shared login screen as
// Wishlist/Account (no header at all above it, kept as compact as
// possible).
export default function OrdersPageContent() {
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

  return (
    <div className="bg-ivory min-h-[60vh]">
      <div className="px-6 md:px-12 pt-[72px] md:pt-24">
        {!loggedIn ? (
          <InlineLoginForm onSuccess={() => setLoggedIn(true)} />
        ) : (
          <div className="pb-14 md:pb-20 max-w-[900px] mx-auto">
            <AccountLookupForm view="orders" />
          </div>
        )}
      </div>
    </div>
  );
}
