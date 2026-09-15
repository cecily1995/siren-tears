'use client';

// A lightweight calling-code selector + local number field, rather than
// pulling in a whole phone-input library for one form. Not exhaustive --
// just the countries SIREN TEARS customers most commonly ship to, plus a
// generic "+" option for anywhere else.
//
// Renders two separate form fields: `${name}Code` (the select) and
// `${name}Number` (the digits). The parent form combines them into one
// string when building its submit payload -- kept this way rather than a
// single hidden combined field so the browser's native form validation
// still works normally on the number input.
const CALLING_CODES = [
  { code: '+64', label: 'NZ +64' },
  { code: '+61', label: 'AU +61' },
  { code: '+1', label: 'US/CA +1' },
  { code: '+44', label: 'UK +44' },
  { code: '+86', label: 'CN +86' },
  { code: '+852', label: 'HK +852' },
  { code: '+65', label: 'SG +65' },
  { code: '+81', label: 'JP +81' },
  { code: '+82', label: 'KR +82' },
  { code: '+33', label: 'FR +33' },
  { code: '+49', label: 'DE +49' },
  { code: '+7', label: 'RU +7' },
  { code: '+39', label: 'IT +39' }
];

export default function PhoneInput({
  name,
  defaultCallingCode = '+64',
  defaultNumber,
  required
}: {
  name: string;
  defaultCallingCode?: string;
  defaultNumber?: string;
  required?: boolean;
}) {
  const selectClass =
    'bg-transparent border border-charcoal/20 focus:border-charcoal outline-none pl-3 pr-7 py-3 text-[0.85rem] font-light text-charcoal transition-colors appearance-none shrink-0';
  const inputClass =
    'flex-1 min-w-0 bg-transparent border border-charcoal/20 focus:border-charcoal outline-none px-4 py-3 text-[0.9rem] font-light text-charcoal placeholder:text-ash/50 transition-colors';

  return (
    <div className="flex gap-2">
      <select aria-label="Country code" name={`${name}Code`} defaultValue={defaultCallingCode} className={selectClass}>
        {CALLING_CODES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.label}
          </option>
        ))}
      </select>
      <input
        name={`${name}Number`}
        type="tel"
        inputMode="tel"
        required={required}
        defaultValue={defaultNumber}
        className={inputClass}
      />
    </div>
  );
}
