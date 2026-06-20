export const SUPPORTED_LOCALES = ["en", "zh"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];
const SUPPORTED_LOCALE_SET: ReadonlySet<Locale> = new Set(SUPPORTED_LOCALES);

export const DEFAULT_LOCALE: Locale = "en";

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  if (value == null) {
    return false;
  }

  for (const locale of SUPPORTED_LOCALE_SET) {
    if (locale === value) {
      return true;
    }
  }

  return false;
}
