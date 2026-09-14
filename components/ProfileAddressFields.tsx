'use client';

import { COUNTRIES, DIAL_CODES } from '@/lib/countries';

const inputClass =
  'w-full bg-transparent border-b border-charcoal/20 focus:border-gold outline-none py-2.5 text-[0.9rem] font-light text-charcoal placeholder:text-ash/50 transition-colors';
const labelClass = 'block text-[10px] tracking-[0.24em] uppercase text-ash mb-1.5 font-light';

type Labels = {
  phoneLabel: string;
  addressLine: string;
  city: string;
  postcode: string;
  country: string;
};

export default function ProfileAddressFields({
  labels,
  defaults
}: {
  labels: Labels;
  defaults?: {
    phoneCountryCode?: string;
    phone?: string;
    addressLine?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
}) {
  return (
    <>
      <div className="sm:col-span-2">
        <label className={labelClass}>{labels.phoneLabel}</label>
        <div className="flex gap-2">
          <select
            name="phoneCountryCode"
            defaultValue={defaults?.phoneCountryCode || '+64'}
            className="bg-transparent border-b border-charcoal/20 focus:border-gold outline-none py-2.5 text-[0.9rem] font-light text-charcoal transition-colors !w-24 shrink-0"
          >
            {DIAL_CODES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <input
            name="phone"
            type="tel"
            defaultValue={defaults?.phone}
            placeholder="21 234 5678"
            className={`${inputClass} flex-1 min-w-0`}
          />
        </div>
      </div>

      <div className="sm:col-span-2">
        <label className={labelClass}>{labels.addressLine}</label>
        <input
          name="addressLine"
          type="text"
          autoComplete="address-line1"
          placeholder="123 Queen Street"
          defaultValue={defaults?.addressLine}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>{labels.city}</label>
        <input
          name="city"
          type="text"
          autoComplete="address-level2"
          defaultValue={defaults?.city}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>{labels.postcode}</label>
        <input
          name="postcode"
          type="text"
          autoComplete="postal-code"
          defaultValue={defaults?.postcode}
          className={inputClass}
        />
      </div>

      <div className="sm:col-span-2">
        <label className={labelClass}>{labels.country}</label>
        <select
          name="country"
          defaultValue={defaults?.country || ''}
          className={inputClass}
        >
          <option value="" disabled>
            —
          </option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
