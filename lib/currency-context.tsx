'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { type Currency, formatMoney, isCurrency, NZD_RATES } from './currency';

const STORAGE_KEY = 'sirentears_currency';

const CurrencyContext = createContext<{
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  format: (amountNzd: number) => string;
} | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('NZD');
  const [rates, setRates] = useState(NZD_RATES);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isCurrency(saved)) setCurrencyState(saved);
    fetch('/api/exchange-rates').then((response) => response.json()).then((data) => {
      if (data?.rates) setRates((current) => ({ ...current, ...data.rates }));
    }).catch(() => {});
  }, []);

  function setCurrency(next: Currency) {
    setCurrencyState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  const value = useMemo(
    () => ({ currency, setCurrency, format: (amount: number) => formatMoney(amount, currency, rates) }),
    [currency, rates]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}
