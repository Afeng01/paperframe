/** @vitest-environment jsdom */

import "@/test/setup";

import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { LocaleTransitionProvider } from "@/components/transition/LocaleTransitionProvider";
import {
  LOCALE_TRANSITION_STORAGE_KEY,
  savePendingLocaleTransition,
} from "@/lib/i18n/locale-transition";

describe("LocaleTransitionProvider", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("replays an incoming transition after navigation remount", async () => {
    savePendingLocaleTransition("en", "zh");

    render(
      <LocaleTransitionProvider locale="zh">
        <div data-locale-region="main">中文内容</div>
      </LocaleTransitionProvider>,
    );

    const content = screen.getByText("中文内容");
    const transitionRoot = content.closest("[data-locale-root]");

    await waitFor(() =>
      expect(transitionRoot).toHaveAttribute("data-locale-switching", "true"),
    );
    expect(transitionRoot).toHaveAttribute("data-locale-previous", "en");
    expect(transitionRoot).toHaveAttribute("data-locale-next", "zh");

    await waitFor(() =>
      expect(transitionRoot).not.toHaveAttribute("data-locale-switching"),
      { timeout: 1200 },
    );
    expect(window.sessionStorage.getItem(LOCALE_TRANSITION_STORAGE_KEY)).toBeNull();
  });
});
