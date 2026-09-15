// Shipping cost calculation.
//
// IMPORTANT: this is a placeholder implementation using the flat-rate rule
// already published on the Shipping & Delivery page (free over NZD $500,
// otherwise a standard flat rate). It is deliberately isolated behind this
// one function so that swapping in a real NZ Post API call later (rates
// based on actual address, weight, and service level) only means rewriting
// the body of `calculateShipping` -- every call site (checkout session
// creation, the /checkout page) stays the same.

export type ShippingQuote = {
  /** Machine-readable method id, e.g. "nzpost_standard" */
  method: string;
  /** Display label, e.g. "NZ Post — Standard" */
  label: string;
  /** Cost in NZD, 0 for free shipping */
  cost: number;
};

const FREE_SHIPPING_THRESHOLD_NZD = 500;
const STANDARD_RATE_NZD = 15;

export function calculateShipping(params: { subtotal: number; country?: string }): ShippingQuote {
  const { subtotal } = params;

  if (subtotal >= FREE_SHIPPING_THRESHOLD_NZD) {
    return { method: 'nzpost_free', label: 'NZ Post — Free shipping', cost: 0 };
  }

  return { method: 'nzpost_standard', label: 'NZ Post — Standard', cost: STANDARD_RATE_NZD };
}
