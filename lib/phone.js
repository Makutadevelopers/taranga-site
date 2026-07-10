'use client';
// Phone country codes + per-country validation for the lead forms.
// India is the default. The list is curated for this project's audience
// (India + the main NRI markets) rather than exhaustive.
//
// `len` is the accepted national-number length: a single number for a fixed
// length, or [min, max] for a range. `starts` (optional) is a regex the national
// number's first digits must match (used to enforce India's 6-9 mobile rule).

export const COUNTRIES = [
  { iso: 'IN', name: 'India', flag: '🇮🇳', dial: '91', len: 10, starts: /^[6-9]/ },
  { iso: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dial: '971', len: 9 },
  { iso: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dial: '966', len: 9 },
  { iso: 'QA', name: 'Qatar', flag: '🇶🇦', dial: '974', len: 8 },
  { iso: 'KW', name: 'Kuwait', flag: '🇰🇼', dial: '965', len: 8 },
  { iso: 'OM', name: 'Oman', flag: '🇴🇲', dial: '968', len: 8 },
  { iso: 'BH', name: 'Bahrain', flag: '🇧🇭', dial: '973', len: 8 },
  { iso: 'US', name: 'United States', flag: '🇺🇸', dial: '1', len: 10 },
  { iso: 'CA', name: 'Canada', flag: '🇨🇦', dial: '1', len: 10 },
  { iso: 'GB', name: 'United Kingdom', flag: '🇬🇧', dial: '44', len: 10 },
  { iso: 'AU', name: 'Australia', flag: '🇦🇺', dial: '61', len: 9 },
  { iso: 'NZ', name: 'New Zealand', flag: '🇳🇿', dial: '64', len: [8, 10] },
  { iso: 'SG', name: 'Singapore', flag: '🇸🇬', dial: '65', len: 8 },
  { iso: 'MY', name: 'Malaysia', flag: '🇲🇾', dial: '60', len: [9, 10] },
  { iso: 'HK', name: 'Hong Kong', flag: '🇭🇰', dial: '852', len: 8 },
  { iso: 'DE', name: 'Germany', flag: '🇩🇪', dial: '49', len: [10, 11] },
  { iso: 'FR', name: 'France', flag: '🇫🇷', dial: '33', len: 9 },
  { iso: 'IE', name: 'Ireland', flag: '🇮🇪', dial: '353', len: 9 },
  { iso: 'CH', name: 'Switzerland', flag: '🇨🇭', dial: '41', len: 9 },
  { iso: 'ZA', name: 'South Africa', flag: '🇿🇦', dial: '27', len: 9 },
  { iso: 'NG', name: 'Nigeria', flag: '🇳🇬', dial: '234', len: [7, 10] },
  { iso: 'KE', name: 'Kenya', flag: '🇰🇪', dial: '254', len: 9 },
  { iso: 'JP', name: 'Japan', flag: '🇯🇵', dial: '81', len: [9, 10] },
  { iso: 'CN', name: 'China', flag: '🇨🇳', dial: '86', len: 11 },
];

export const DEFAULT_ISO = 'IN';

export function findCountry(iso) {
  return COUNTRIES.find((c) => c.iso === iso) || COUNTRIES[0];
}

// national: the number as typed (any format); we validate the digits only.
export function validatePhone(country, national) {
  const c = country && country.dial ? country : findCountry(DEFAULT_ISO);
  const d = (national || '').replace(/\D/g, '');
  const [min, max] = Array.isArray(c.len) ? c.len : [c.len, c.len];
  if (d.length < min || d.length > max) return false;
  if (c.starts && !c.starts.test(d)) return false;
  return true;
}

// Full international number, e.g. "+919876543210". Pass includePlus:false to get
// the digits-only form ("919876543210") the WhatsApp API expects.
export function toE164(country, national, includePlus) {
  const c = country && country.dial ? country : findCountry(DEFAULT_ISO);
  const d = (national || '').replace(/\D/g, '');
  return (includePlus === false ? '' : '+') + c.dial + d;
}
