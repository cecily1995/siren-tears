export const CURRENCIES = ['NZD', 'USD', 'AUD', 'CNY', 'GBP', 'EUR', 'CAD', 'JPY', 'KRW', 'SGD', 'HKD', 'CHF', 'INR'] as const;
export type Currency = (typeof CURRENCIES)[number];

// Store prices in NZD and convert only at the presentation/payment boundary.
// These are deliberately maintained in one place so displayed and charged
// amounts can never drift apart.
export const NZD_RATES: Record<Currency, number> = {
  NZD: 1,
  USD: 0.59,
  AUD: 0.91,
  CNY: 4.24,
  GBP: 0.44,
  EUR: 0.51
  ,CAD: 0.8, JPY: 90.16, KRW: 792.68, SGD: 0.73, HKD: 4.48, CHF: 0.47, INR: 54.75
};

export function isCurrency(value: unknown): value is Currency {
  return typeof value === 'string' && CURRENCIES.includes(value as Currency);
}

export function convertFromNzd(amount: number, currency: Currency, rates: Partial<Record<Currency, number>> = NZD_RATES) {
  return Math.round(amount * (rates[currency] || NZD_RATES[currency]) * 100) / 100;
}

export function formatMoney(amountNzd: number, currency: Currency, rates?: Partial<Record<Currency, number>>) {
  const amount = convertFromNzd(amountNzd, currency, rates);
  const zeroDecimal = ['CNY', 'JPY', 'KRW', 'INR'].includes(currency);
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency,
    minimumFractionDigits: zeroDecimal ? 0 : 2,
    maximumFractionDigits: zeroDecimal ? 0 : 2
  }).format(amount);
}

export async function getLiveNzdRates(): Promise<Record<Currency, number>> {
  try {
    const targets = CURRENCIES.filter((currency) => currency !== 'NZD').join(',');
    const response = await fetch(`https://api.frankfurter.app/latest?from=NZD&to=${targets}`, { next: { revalidate: 3600 } });
    if (!response.ok) return NZD_RATES;
    const data = await response.json();
    return { ...NZD_RATES, NZD: 1, ...(data?.rates || {}) };
  } catch {
    return NZD_RATES;
  }
}
