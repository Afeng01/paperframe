import type { Locale } from "@/lib/i18n/locales";

export interface BuildLocaleUrlOptions {
  hash?: string;
  locale: Locale;
  pathname: string;
  search?: string | URLSearchParams;
}

export function buildLocaleUrl({
  hash,
  locale,
  pathname,
  search,
}: BuildLocaleUrlOptions): string {
  const params = new URLSearchParams(normalizeSearch(search));

  params.set("lang", locale);

  const query = params.toString();
  const normalizedHash = normalizeHash(hash);

  return `${pathname}${query ? `?${query}` : ""}${normalizedHash}`;
}

function normalizeSearch(search: string | URLSearchParams | undefined): string {
  if (!search) {
    return "";
  }

  if (search instanceof URLSearchParams) {
    return search.toString();
  }

  return search.startsWith("?") ? search.slice(1) : search;
}

function normalizeHash(hash: string | undefined): string {
  if (!hash) {
    return "";
  }

  return hash.startsWith("#") ? hash : `#${hash}`;
}
