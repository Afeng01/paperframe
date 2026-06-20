import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  DEFAULT_LOCALE_COOKIE_OPTIONS,
  LOCALE_COOKIE_NAME,
} from "@/lib/i18n/locale-cookie";
import { isSupportedLocale } from "@/lib/i18n/locales";

export function proxy(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("lang");

  if (!isSupportedLocale(locale)) {
    return NextResponse.next();
  }

  const currentCookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value ?? null;

  if (currentCookieLocale === locale) {
    return NextResponse.next();
  }

  request.cookies.set(LOCALE_COOKIE_NAME, locale);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("cookie", request.cookies.toString());

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.cookies.set(LOCALE_COOKIE_NAME, locale, DEFAULT_LOCALE_COOKIE_OPTIONS);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|icon|apple-icon|opengraph-image|twitter-image).*)",
  ],
};
