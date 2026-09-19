'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { type Currency, formatMoney, isCurrency } from './currency';

const STORAGE_KEY = 'sirentears_currency';

const CurrencyContext = createContext<{
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  format: (amountNzd: number) => string;
} | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('NZD');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isCurrency(saved)) setCurrencyState(saved);
  }, []);

  function setCurrency(next: Currency) {
    setCurrencyState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  const value = useMemo(
    () => ({ currency, setCurrency, format: (amount: number) => formatMoney(amount, currency) }),
    [currency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}
