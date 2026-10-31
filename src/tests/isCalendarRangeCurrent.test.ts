import { describe, expect, it } from "vitest";
import { isCalendarRangeCurrent } from "../features/roster-planner/utils/isCalendarRangeCurrent";

const range = (start: string, end: string) => ({
  start: new Date(start),
  end: new Date(end),
});

describe("isCalendarRangeCurrent", () => {
  it("accepts equal date ranges even when Date instances differ", () => {
    expect(
      isCalendarRangeCurrent(
        range("2026-10-26T00:00:00.000Z", "2026-11-01T23:59:59.999Z"),
        range("2026-10-26T00:00:00.000Z", "2026-11-01T23:59:59.999Z"),
      ),
    ).toBe(true);
  });

  it("rejects the old query range while the visible week has already changed", () => {
    expect(
      isCalendarRangeCurrent(
        range("2026-11-02T00:00:00.000Z", "2026-11-08T23:59:59.999Z"),
        range("2026-10-26T00:00:00.000Z", "2026-11-01T23:59:59.999Z"),
      ),
    ).toBe(false);
  });

  it("rejects a range if only its end has changed", () => {
    expect(
      isCalendarRangeCurrent(
        range("2026-10-26T00:00:00.000Z", "2026-10-26T23:59:59.999Z"),
        range("2026-10-26T00:00:00.000Z", "2026-11-01T23:59:59.999Z"),
      ),
    ).toBe(false);
  });
});
