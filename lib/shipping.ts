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

/** Uses NZ Post Rate Finder when NZPOST_RATEFINDER_API_KEY is configured. */
export async function getShippingQuote(params: {
  subtotal: number;
  country?: string;
  postcode?: string;
  isMember?: boolean;
}): Promise<ShippingQuote> {
  const fallback = calculateShipping(params);
  if (fallback.cost === 0) return fallback;
  const apiKey = process.env.NZPOST_RATEFINDER_API_KEY;
  if (!apiKey) return fallback;

  const { COUNTRIES } = await import('./countries');
  const countryInput = (params.country || '').trim().toLowerCase();
  const countryCode = COUNTRIES.find((item) => item.code.toLowerCase() === countryInput || item.name.toLowerCase() === countryInput)?.code;
  if (!countryCode) return fallback;

  const length = process.env.NZPOST_PARCEL_LENGTH_MM || '250';
  const height = process.env.NZPOST_PARCEL_HEIGHT_MM || '80';
  const width = process.env.NZPOST_PARCEL_WIDTH_MM || '180';
  const weightKg = process.env.NZPOST_PARCEL_WEIGHT_KG || '0.5';

  try {
    let url: URL;
    if (countryCode === 'NZ') {
      url = new URL('https://api.nzpost.co.nz/ratefinder/domestic/rating/v2');
      Object.entries({ api_key: apiKey, length_in_millimetres: length, width_in_millimetres: width, height_in_millimetres: height, weight_in_grams: String(Math.round(Number(weightKg) * 1000)), source_postcode: process.env.NZPOST_SOURCE_POSTCODE || '', dest_postcode: params.postcode || '', postage_type: 'postage_only', format: 'json' }).forEach(([key, value]) => value && url.searchParams.set(key, value));
    } else {
      url = new URL('https://api.nzpost.co.nz/ratefinder/international.json');
      Object.entries({ api_key: apiKey, country_code: countryCode, value: String(params.subtotal), length, height, thickness: width, weight: weightKg, format: 'json' }).forEach(([key, value]) => url.searchParams.set(key, value));
    }
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return fallback;
    const data = await response.json();
    const products = Array.isArray(data?.products) ? data.products : [];
    const priced = products.map((product: any) => ({
      product,
      price: Number(product.price_including_gst ?? product.price ?? product.cost)
    })).filter((entry: any) => Number.isFinite(entry.price) && entry.price >= 0).sort((a: any, b: any) => a.price - b.price);
    if (!priced.length) return fallback;
    const chosen = priced[0];
    return { method: chosen.product.code || chosen.product.service || 'nzpost_live', label: `NZ Post — ${chosen.product.group || chosen.product.name || chosen.product.description || 'Standard'}`, cost: chosen.price };
  } catch {
    return fallback;
  }
}
