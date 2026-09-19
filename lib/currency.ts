export const CURRENCIES = ['NZD', 'USD', 'AUD', 'CNY', 'GBP', 'EUR'] as const;
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
};

export function isCurrency(value: unknown): value is Currency {
  return typeof value === 'string' && CURRENCIES.includes(value as Currency);
}

export function convertFromNzd(amount: number, currency: Currency) {
  return Math.round(amount * NZD_RATES[currency] * 100) / 100;
}

export function formatMoney(amountNzd: number, currency: Currency) {
  const amount = convertFromNzd(amountNzd, currency);
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'CNY' ? 0 : 2,
    maximumFractionDigits: currency === 'CNY' ? 0 : 2
  }).format(amount);
}
