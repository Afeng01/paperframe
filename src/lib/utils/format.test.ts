import { describe, expect, it } from "vitest";

import { formatDisplayDate, parseDisplayDateValue } from "@/lib/utils/format";

describe("parseDisplayDateValue", () => {
  it("normalizes date-only strings to a UTC calendar day", () => {
    const parsed = parseDisplayDateValue("2026-06-19");

    expect(parsed.timeZone).toBe("UTC");
    expect(parsed.date.toISOString()).toBe("2026-06-19T00:00:00.000Z");
  });

  it("does not force UTC for datetime strings", () => {
    const parsed = parseDisplayDateValue("2026-06-19T15:30:00Z");

    expect(parsed.timeZone).toBeUndefined();
    expect(parsed.date.toISOString()).toBe("2026-06-19T15:30:00.000Z");
  });
});

describe("formatDisplayDate", () => {
  it("formats a date-only value without shifting the calendar day", () => {
    expect(formatDisplayDate("2026-06-19", "en")).toBe("06/19/2026");
    expect(formatDisplayDate("2026-06-19", "zh")).toBe("2026/06/19");
  });
});
