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

const LOCAL_URL_BASE = "https://paperframe.local";
const EXTERNAL_HREF_PATTERN = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;

export function localizeHref(href: string, locale: Locale): string {
  if (!href || href.startsWith("#") || EXTERNAL_HREF_PATTERN.test(href)) {
    return href;
  }

  const url = new URL(href, LOCAL_URL_BASE);

  if (url.origin !== LOCAL_URL_BASE) {
    return href;
  }

  return buildLocaleUrl({
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    locale,
  });
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
