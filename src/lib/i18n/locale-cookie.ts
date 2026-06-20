import type { Locale } from "@/lib/i18n/locales";

export const LOCALE_COOKIE_NAME = "paperframe-locale";

export interface LocaleCookieOptions {
  maxAge: number;
  path: string;
  sameSite: "lax" | "strict" | "none";
  secure: boolean;
}

export const DEFAULT_LOCALE_COOKIE_OPTIONS: LocaleCookieOptions = {
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
  sameSite: "lax",
  secure: false,
};

export function serializeLocaleCookie(
  locale: Locale,
  overrides: Partial<LocaleCookieOptions> = {},
): string {
  const options = { ...DEFAULT_LOCALE_COOKIE_OPTIONS, ...overrides };
  const parts = [
    `${LOCALE_COOKIE_NAME}=${encodeURIComponent(locale)}`,
    `Path=${options.path}`,
    `Max-Age=${options.maxAge}`,
    `SameSite=${capitalize(options.sameSite)}`,
  ];

  if (options.secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

function capitalize(value: string): string {
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}
