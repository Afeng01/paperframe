import { describe, expect, it } from "vitest";

import { buildLocaleUrl, localizeHref } from "@/lib/i18n/locale-url";

describe("buildLocaleUrl", () => {
  it("appends lang=en when no query exists", () => {
    expect(buildLocaleUrl({ pathname: "/about", locale: "en" })).toBe("/about?lang=en");
  });

  it("appends lang=zh when no query exists", () => {
    expect(buildLocaleUrl({ pathname: "/about", locale: "zh" })).toBe("/about?lang=zh");
  });

  it("replaces an existing lang query parameter", () => {
    expect(
      buildLocaleUrl({
        pathname: "/projects",
        search: "?page=2&lang=en",
        locale: "zh",
      }),
    ).toBe("/projects?page=2&lang=zh");
  });

  it("preserves unrelated query params and hashes", () => {
    expect(
      buildLocaleUrl({
        pathname: "/articles",
        search: "?tag=ai&page=2",
        hash: "#intro",
        locale: "zh",
      }),
    ).toBe("/articles?tag=ai&page=2&lang=zh#intro");
  });
});

describe("localizeHref", () => {
  it("adds locale to internal path hrefs", () => {
    expect(localizeHref("/projects/sample-work", "zh")).toBe(
      "/projects/sample-work?lang=zh",
    );
  });

  it("adds locale to internal hrefs with hashes", () => {
    expect(localizeHref("/#contact", "zh")).toBe("/?lang=zh#contact");
  });

  it("leaves external hrefs untouched", () => {
    expect(localizeHref("https://example.com/work", "zh")).toBe(
      "https://example.com/work",
    );
    expect(localizeHref("mailto:hello@example.com", "zh")).toBe(
      "mailto:hello@example.com",
    );
  });
});
