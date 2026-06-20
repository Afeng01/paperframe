import { describe, expect, it } from "vitest";

import { buildLocaleUrl } from "@/lib/i18n/locale-url";

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
