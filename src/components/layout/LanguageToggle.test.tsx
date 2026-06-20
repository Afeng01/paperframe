/** @vitest-environment jsdom */

import "@/test/setup";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { LOCALE_TRANSITION_STORAGE_KEY } from "@/lib/i18n/locale-transition";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/projects",
  useRouter: () => ({
    replace: replaceMock,
  }),
  useSearchParams: () => new URLSearchParams("page=2"),
}));

describe("LanguageToggle", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    document.cookie = "";
    window.history.replaceState({}, "", "/projects?page=2#samples");
  });

  it("switches locale, preserves search params and keeps the hash", async () => {
    render(<LanguageToggle locale="en" />);

    await userEvent.click(screen.getByRole("button", { name: "切换到中文" }));

    expect(replaceMock).toHaveBeenCalledWith("/projects?page=2&lang=zh#samples", {
      scroll: false,
    });
    expect(document.cookie).toContain("paperframe-locale=zh");
    expect(window.sessionStorage.getItem(LOCALE_TRANSITION_STORAGE_KEY)).toContain('"previous":"en"');
    expect(window.sessionStorage.getItem(LOCALE_TRANSITION_STORAGE_KEY)).toContain('"next":"zh"');
    expect(screen.getByRole("button", { name: "切换到中文" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("does not navigate when the active locale is selected again", async () => {
    render(<LanguageToggle locale="zh" />);

    await userEvent.click(screen.getByRole("button", { name: "切换到中文" }));

    expect(replaceMock).not.toHaveBeenCalled();
  });
});
