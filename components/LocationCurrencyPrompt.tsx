'use client';

import { useEffect, useState } from 'react';
import { useCurrency } from '@/lib/currency-context';
import { type Currency } from '@/lib/currency';

const STORAGE_KEY = 'sirentears_location_confirmed';
const COUNTRY_CURRENCY: Record<string, Currency> = {
  NZ: 'NZD', AU: 'AUD', US: 'USD', CA: 'CAD', CN: 'CNY', GB: 'GBP', IE: 'EUR', FR: 'EUR', DE: 'EUR',
  IT: 'EUR', ES: 'EUR', JP: 'JPY', KR: 'KRW', SG: 'SGD', HK: 'HKD', CH: 'CHF', IN: 'INR'
};

export default function LocationCurrencyPrompt() {
  const { setCurrency } = useCurrency();
  const [country, setCountry] = useState('NZ');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) {
      window.dispatchEvent(new Event('sirentears:location-complete'));
      return;
    }
    fetch('/api/location').then((response) => response.json()).then((data) => {
      setCountry(data?.country || 'NZ');
      window.setTimeout(() => setVisible(true), 900);
    }).catch(() => window.setTimeout(() => setVisible(true), 900));
  }, []);

  function finish(useLocalCurrency: boolean) {
    if (useLocalCurrency) setCurrency(COUNTRY_CURRENCY[country] || 'NZD');
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
    window.dispatchEvent(new Event('sirentears:location-complete'));
  }

  if (!visible) return null;
  const currency = COUNTRY_CURRENCY[country] || 'NZD';
  const countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(country) || country;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[1100] px-4 pb-4 md:px-8 md:pb-8">
      <div className="ml-auto w-full max-w-[390px] bg-white border border-charcoal/15 shadow-[0_18px_55px_rgba(38,35,31,0.18)] p-6 md:p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="eyebrow mb-2">Siren Tears · New Zealand</p>
            <h2 className="serif-display text-[1.35rem] font-light text-charcoal">Visiting from {countryName}?</h2>
          </div>
          <button onClick={() => finish(false)} aria-label="Close" className="text-xl leading-none text-charcoal/45">×</button>
        </div>
        <p className="mt-3 text-[0.8rem] leading-[1.65] text-ash font-light">
          Confirm your location to view the store in your preferred currency. Prices remain based in NZD.
        </p>
        <button onClick={() => finish(true)} className="mt-5 w-full bg-charcoal text-ivory py-3 text-[10px] tracking-[0.22em] uppercase">
          Use {currency}
        </button>
        <button onClick={() => finish(false)} className="mt-2 w-full border border-charcoal/30 py-3 text-[10px] tracking-[0.22em] uppercase text-charcoal">
          Continue in NZD
        </button>
      </div>
    </div>
  );
}
