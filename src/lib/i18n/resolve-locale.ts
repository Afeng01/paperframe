import { DEFAULT_LOCALE, isSupportedLocale, type Locale } from "@/lib/i18n/locales";

type SearchParamsInput =
  | URLSearchParams
  | Record<string, string | string[] | undefined>
  | undefined;

export interface ResolveLocaleOptions {
  searchParams?: SearchParamsInput;
  cookieLocale?: string | null;
}

function readLangSearchParam(searchParams: SearchParamsInput): string | null {
  if (!searchParams) {
    return null;
  }

  if (searchParams instanceof URLSearchParams) {
    return searchParams.get("lang");
  }

  const value = searchParams.lang;

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export function resolveLocale({
  searchParams,
  cookieLocale,
}: ResolveLocaleOptions): Locale {
  const queryLocale = readLangSearchParam(searchParams);

  if (isSupportedLocale(queryLocale)) {
    return queryLocale;
  }

  if (isSupportedLocale(cookieLocale)) {
    return cookieLocale;
  }

  return DEFAULT_LOCALE;
}
