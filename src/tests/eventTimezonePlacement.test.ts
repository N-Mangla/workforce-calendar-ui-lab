import { describe, expect, it } from "vitest";
import { eventOverlapsCalendarDay } from "../features/roster-planner/utils/eventOverlapsCalendarDay";

const day = (date: string) => new Date(`${date}T12:00:00`);
const event = (startDate: string, endDate: string, allDay = false) => ({ startDate, endDate, allDay });

describe("event placement in selected timezone", () => {
  it("places a late UTC shift on the following date in Kolkata", () => {
    const shift = event("2026-10-31T22:30:00Z", "2026-10-31T23:30:00Z");
    expect(eventOverlapsCalendarDay(shift, day("2026-10-31"), "UTC")).toBe(true);
    expect(eventOverlapsCalendarDay(shift, day("2026-10-31"), "Asia/Kolkata")).toBe(false);
    expect(eventOverlapsCalendarDay(shift, day("2026-11-01"), "Asia/Kolkata")).toBe(true);
  });

  it("handles an interval crossing midnight in Berlin without duplicating the end boundary", () => {
    const shift = event("2026-10-31T22:00:00Z", "2026-10-31T23:00:00Z");
    expect(eventOverlapsCalendarDay(shift, day("2026-10-31"), "Europe/Berlin")).toBe(true);
    expect(eventOverlapsCalendarDay(shift, day("2026-11-01"), "Europe/Berlin")).toBe(false);
    expect(eventOverlapsCalendarDay(shift, day("2026-11-01"), "UTC")).toBe(false);
  });

  it("handles spring DST transition using instants, not fixed UTC offsets", () => {
    const shift = event("2026-03-28T23:30:00Z", "2026-03-29T02:30:00Z");
    expect(eventOverlapsCalendarDay(shift, day("2026-03-29"), "Europe/Berlin")).toBe(true);
    expect(eventOverlapsCalendarDay(shift, day("2026-03-28"), "Europe/Berlin")).toBe(false);
  });

  it("retains all-day calendar date labels across timezone selection", () => {
    const holiday = event("2026-11-01T00:00:00.000Z", "2026-11-02T00:00:00.000Z", true);
    expect(eventOverlapsCalendarDay(holiday, day("2026-11-01"), "Asia/Kolkata")).toBe(true);
    expect(eventOverlapsCalendarDay(holiday, day("2026-10-31"), "America/New_York")).toBe(false);
    expect(eventOverlapsCalendarDay(holiday, day("2026-11-02"), "UTC")).toBe(false);
  });

  it("rejects invalid and reversed intervals", () => {
    expect(eventOverlapsCalendarDay(event("bad", "2026-10-31T10:00:00Z"), day("2026-10-31"), "UTC")).toBe(false);
    expect(eventOverlapsCalendarDay(event("2026-11-01T00:00:00Z", "2026-10-31T00:00:00Z"), day("2026-10-31"), "UTC")).toBe(false);
  });
});
