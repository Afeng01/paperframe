import { describe, expect, it } from "vitest";

describe("test harness", () => {
  it("boots jsdom with jest-dom matchers", () => {
    document.body.innerHTML = '<div data-testid="smoke">ok</div>';

    expect(document.querySelector('[data-testid="smoke"]')).toBeInTheDocument();
  });
});
