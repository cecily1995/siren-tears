// Shipping cost calculation.
//
// IMPORTANT: this is still a placeholder rule set, not a live NZ Post API
// call. It's deliberately isolated behind this one function so that
// swapping in real NZ Post rates later (based on actual address, weight,
// and service level) only means rewriting the body of `calculateShipping`
// -- every call site (checkout session creation, the /checkout page) stays
// the same.

export type ShippingQuote = {
  /** Machine-readable method id, e.g. "nzpost_standard_nz" */
  method: string;
  /** Display label, e.g. "NZ Post — Standard" */
  label: string;
  /** Cost in NZD, 0 for free shipping */
  cost: number;
};

const FREE_SHIPPING_THRESHOLD_STANDARD_NZD = 500;
const FREE_SHIPPING_THRESHOLD_MEMBER_NZD = 400;

// Rough placeholder tiers -- a real integration would call NZ Post's API
// with the actual address and parcel weight instead of guessing by country.
const DOMESTIC_RATE_NZD = 10;
const NEAR_RATE_NZD = 20; // Australia / Pacific
const FAR_RATE_NZD = 35; // US, UK, Europe
const DEFAULT_INTERNATIONAL_RATE_NZD = 25;

const NZ_ALIASES = ['new zealand', 'nz', 'aotearoa'];
const NEAR_ALIASES = ['australia', 'au', 'fiji', 'samoa', 'tonga', 'cook islands'];
const FAR_ALIASES = [
  'united states',
  'usa',
  'us',
  'united states of america',
  'united kingdom',
  'uk',
  'great britain',
  'england',
  'scotland',
  'wales',
  'ireland',
  'france',
  'germany',
  'italy',
  'spain',
  'netherlands'
];

function regionFor(country?: string): 'nz' | 'near' | 'far' | 'other' {
  const c = (country || '').trim().toLowerCase();
  if (!c) return 'other';
  if (NZ_ALIASES.includes(c)) return 'nz';
  if (NEAR_ALIASES.includes(c)) return 'near';
  if (FAR_ALIASES.includes(c)) return 'far';
  return 'other';
}

export function calculateShipping(params: { subtotal: number; country?: string; isMember?: boolean }): ShippingQuote {
  const { subtotal, country, isMember } = params;
  const region = regionFor(country);
  const isDomestic = region === 'nz';

  const freeThreshold = isMember ? FREE_SHIPPING_THRESHOLD_MEMBER_NZD : FREE_SHIPPING_THRESHOLD_STANDARD_NZD;
  if (subtotal >= freeThreshold) {
    return {
      method: isDomestic ? 'nzpost_free_nz' : 'nzpost_free_intl',
      label: 'NZ Post — Free shipping',
      cost: 0
    };
  }

  if (region === 'nz') {
    return { method: 'nzpost_standard_nz', label: 'NZ Post — Standard (NZ)', cost: DOMESTIC_RATE_NZD };
  }
  if (region === 'near') {
    return { method: 'nzpost_intl_near', label: 'NZ Post International — Standard', cost: NEAR_RATE_NZD };
  }
  if (region === 'far') {
    return { method: 'nzpost_intl_far', label: 'NZ Post International — Express', cost: FAR_RATE_NZD };
  }
  return { method: 'nzpost_intl_default', label: 'NZ Post International — Standard', cost: DEFAULT_INTERNATIONAL_RATE_NZD };
}

// Exported so the checkout UI can show "spend $X more to get free shipping"
// / "join the Siren Circle for free shipping over $400" prompts without
// duplicating the threshold numbers.
export function freeShippingThreshold(isMember?: boolean): number {
  return isMember ? FREE_SHIPPING_THRESHOLD_MEMBER_NZD : FREE_SHIPPING_THRESHOLD_STANDARD_NZD;
}
