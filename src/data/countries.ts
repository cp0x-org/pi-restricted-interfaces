import { dataset } from 'data/dataset';
import { CountryToken } from 'types/restrictions';
import { isRegionToken, parentOf } from 'utils/restrictions';

/** ISO 3166-1 alpha-2, 249 codes. Static so that no network lookup is ever needed. */
export const ISO2: readonly string[] =
  `AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ
CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR
GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO
JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR
MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO
RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV
TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW`.split(/\s+/);

const ISO2_SET = new Set(ISO2);

export const isCountryCode = (code: string | undefined | null): code is string => !!code && ISO2_SET.has(code);

const displayNames = new Map<string, Intl.DisplayNames | null>();

function getDisplayNames(locale: string): Intl.DisplayNames | null {
  if (!displayNames.has(locale)) {
    try {
      displayNames.set(locale, new Intl.DisplayNames([locale], { type: 'region' }));
    } catch {
      displayNames.set(locale, null);
    }
  }
  return displayNames.get(locale) ?? null;
}

const nameCache = new Map<string, string>();

/** Country name in the given UI locale ('en', 'zh-Hans'); falls back to the code. */
export function countryName(code: string, locale = 'en'): string {
  const key = `${locale}:${code}`;
  const cached = nameCache.get(key);
  if (cached) return cached;
  let name = code;
  try {
    name = getDisplayNames(locale)?.of(code) ?? code;
  } catch {
    name = code;
  }
  nameCache.set(key, name);
  return name;
}

/** Regional-indicator emoji for an ISO2 code (renders as letters where emoji flags are unsupported). */
export const flagEmoji = (code: string): string =>
  code.length === 2
    ? String.fromCodePoint(
        ...code
          .toUpperCase()
          .split('')
          .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
      )
    : '';

/** Region name: translated label if provided, else the English name from the dataset. */
export const regionLabel = (token: CountryToken, translated: Record<string, string> = {}): string =>
  translated[token] ?? dataset.meta.regions[token] ?? token.slice(token.indexOf('-') + 1);

/** 'US' -> '🇺🇸 United States'; 'UA-Crimea' -> '🇺🇦 Crimea and Sevastopol (UA)'. */
export function tokenLabel(token: CountryToken, locale = 'en', regions: Record<string, string> = {}): string {
  if (isRegionToken(token)) {
    const parent = parentOf(token);
    return `${flagEmoji(parent)} ${regionLabel(token, regions)} (${parent})`;
  }
  return `${flagEmoji(token)} ${countryName(token, locale)}`;
}

/** Region subtag of the browser locale ('en-US' -> 'US'), only when it is a real country code. No network. */
export function defaultCountryFromNavigator(): string | null {
  if (typeof navigator === 'undefined') return null;
  const locales = [navigator.language, ...(navigator.languages ?? [])].filter(Boolean);
  for (const locale of locales) {
    try {
      const region = new Intl.Locale(locale).region;
      if (isCountryCode(region)) return region;
    } catch {
      // ignore malformed locale strings
    }
  }
  return null;
}

const optionsCache = new Map<string, readonly string[]>();

/** All country codes sorted by their name in the given locale, for pickers and filters. */
export function countryOptions(locale = 'en'): readonly string[] {
  let list = optionsCache.get(locale);
  if (!list) {
    list = [...ISO2].sort((a, b) => countryName(a, locale).localeCompare(countryName(b, locale), locale));
    optionsCache.set(locale, list);
  }
  return list;
}

/** All countries sorted by English name (standalone country page). */
export const COUNTRY_OPTIONS: readonly string[] = countryOptions('en');
