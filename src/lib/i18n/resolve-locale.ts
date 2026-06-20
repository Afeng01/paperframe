import { DEFAULT_LOCALE, isSupportedLocale, type Locale } from "@/lib/i18n/locales";

type ResolvedSearchParamsInput =
  | URLSearchParams
  | Record<string, string | string[] | undefined>
  | undefined;

export interface ResolveLocaleOptions {
  resolvedSearchParams?: ResolvedSearchParamsInput;
  cookieLocale?: string | null;
}

function readLangSearchParam(resolvedSearchParams: ResolvedSearchParamsInput): string | null {
  if (!resolvedSearchParams) {
    return null;
  }

  if (resolvedSearchParams instanceof URLSearchParams) {
    return resolvedSearchParams.get("lang");
  }

  const value = resolvedSearchParams.lang;

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export function resolveLocale({
  resolvedSearchParams,
  cookieLocale,
}: ResolveLocaleOptions): Locale {
  const queryLocale = readLangSearchParam(resolvedSearchParams);

  if (isSupportedLocale(queryLocale)) {
    return queryLocale;
  }

  if (isSupportedLocale(cookieLocale)) {
    return cookieLocale;
  }

  return DEFAULT_LOCALE;
}
