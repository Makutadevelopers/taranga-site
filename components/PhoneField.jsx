'use client';
// Phone input with a country-code selector. India is the default.
// Controlled: parent owns `iso` (country) and `number` (national digits as typed).
import { COUNTRIES, findCountry } from '@/lib/phone';

export default function PhoneField({ iso = 'IN', number = '', onIso, onNumber, id = 'qp', placeholder = 'Phone', invalid = false, style }) {
  const country = findCountry(iso);
  return (
    <div className={'phonefield' + (invalid ? ' is-invalid' : '')} style={style}>
      <span className="pf-cc">
        <span className="pf-flag" aria-hidden="true">{country.flag}</span>
        <span className="pf-dial">+{country.dial}</span>
        <select
          className="pf-select"
          aria-label="Country code"
          value={iso}
          onChange={(e) => onIso && onIso(e.target.value)}
        >
          {COUNTRIES.map((c) => (
            <option key={c.iso} value={c.iso}>
              {c.flag} {c.name} (+{c.dial})
            </option>
          ))}
        </select>
        <span className="pf-caret" aria-hidden="true" />
      </span>
      <input
        id={id}
        className="pf-num"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder={placeholder}
        value={number}
        onChange={(e) => onNumber && onNumber(e.target.value)}
      />
    </div>
  );
}
