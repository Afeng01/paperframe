import { describe, expect, expectTypeOf, it } from "vitest";

import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/lib/i18n/locales";
import { serializeLocaleCookie } from "@/lib/i18n/locale-cookie";
import { resolveLocale } from "@/lib/i18n/resolve-locale";

describe("locales", () => {
  it("only exposes en and zh as supported locales", () => {
    expect(SUPPORTED_LOCALES).toEqual(["en", "zh"]);
    expect(DEFAULT_LOCALE).toBe("en");
    expectTypeOf<Locale>().toEqualTypeOf<"en" | "zh">();
  });
});

describe("resolveLocale", () => {
  it("prefers the lang query over the cookie locale", () => {
    const locale = resolveLocale({
      resolvedSearchParams: new URLSearchParams("lang=zh"),
      cookieLocale: "en",
    });

    expect(locale).toBe("zh");
  });

  it("prefers the cookie locale when the query is absent", () => {
    const locale = resolveLocale({
      resolvedSearchParams: new URLSearchParams("page=1"),
      cookieLocale: "zh",
    });

    expect(locale).toBe("zh");
  });

  it("falls back to en for invalid query and cookie values", () => {
    const locale = resolveLocale({
      resolvedSearchParams: new URLSearchParams("lang=fr"),
      cookieLocale: "jp",
    });

    expect(locale).toBe("en");
  });

  it("supports object-style searchParams values", () => {
    const locale = resolveLocale({
      resolvedSearchParams: {
        lang: "zh",
      },
      cookieLocale: "en",
    });

    expect(locale).toBe("zh");
  });

  it("uses the first object-style string[] lang value", () => {
    const locale = resolveLocale({
      resolvedSearchParams: {
        lang: ["zh", "en"],
      },
      cookieLocale: "en",
    });

    expect(locale).toBe("zh");
  });
});

describe("serializeLocaleCookie", () => {
  it("adds Secure when SameSite=None is requested", () => {
    expect(serializeLocaleCookie("zh", { sameSite: "none" })).toContain(
      "SameSite=None; Secure",
    );
  });
});
