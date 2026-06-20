import { describe, expect, expectTypeOf, it } from "vitest";

import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/lib/i18n/locales";
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
      searchParams: new URLSearchParams("lang=zh"),
      cookieLocale: "en",
    });

    expect(locale).toBe("zh");
  });

  it("prefers the cookie locale when the query is absent", () => {
    const locale = resolveLocale({
      searchParams: new URLSearchParams("page=1"),
      cookieLocale: "zh",
    });

    expect(locale).toBe("zh");
  });

  it("falls back to en for invalid query and cookie values", () => {
    const locale = resolveLocale({
      searchParams: new URLSearchParams("lang=fr"),
      cookieLocale: "jp",
    });

    expect(locale).toBe("en");
  });
});
