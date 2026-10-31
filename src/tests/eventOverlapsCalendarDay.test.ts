import { describe, expect, it } from "vitest";
import { eventOverlapsCalendarDay } from "../features/roster-planner/utils/eventOverlapsCalendarDay";

const event = (startDate: string, endDate: string) => ({ startDate, endDate });
const day = (isoDate: string) => new Date(`${isoDate}T12:00:00`);

describe("eventOverlapsCalendarDay", () => {
  it("shows an overnight shift on both days", () => {
    const shift = event("2026-10-31T22:00:00", "2026-11-01T06:00:00");
    expect(eventOverlapsCalendarDay(shift, day("2026-10-31"))).toBe(true);
    expect(eventOverlapsCalendarDay(shift, day("2026-11-01"))).toBe(true);
    expect(eventOverlapsCalendarDay(shift, day("2026-11-02"))).toBe(false);
  });

  it("does not show a shift on the day it ends exactly at midnight", () => {
    const shift = event("2026-10-31T20:00:00", "2026-11-01T00:00:00");
    expect(eventOverlapsCalendarDay(shift, day("2026-10-31"))).toBe(true);
    expect(eventOverlapsCalendarDay(shift, day("2026-11-01"))).toBe(false);
  });

  it("shows an all-day end-exclusive event only on its intended day", () => {
    const allDay = event("2026-10-31T00:00:00", "2026-11-01T00:00:00");
    expect(eventOverlapsCalendarDay(allDay, day("2026-10-31"))).toBe(true);
    expect(eventOverlapsCalendarDay(allDay, day("2026-11-01"))).toBe(false);
  });

  it("shows a shift at its start boundary, but not before", () => {
    const shift = event("2026-11-01T00:00:00", "2026-11-01T08:00:00");
    expect(eventOverlapsCalendarDay(shift, day("2026-10-31"))).toBe(false);
    expect(eventOverlapsCalendarDay(shift, day("2026-11-01"))).toBe(true);
  });

  it("rejects empty, reversed and invalid intervals", () => {
    expect(eventOverlapsCalendarDay(event("2026-11-01T00:00:00", "2026-11-01T00:00:00"), day("2026-11-01"))).toBe(false);
    expect(eventOverlapsCalendarDay(event("2026-11-02T00:00:00", "2026-11-01T00:00:00"), day("2026-11-01"))).toBe(false);
    expect(eventOverlapsCalendarDay(event("invalid", "2026-11-01T01:00:00"), day("2026-11-01"))).toBe(false);
  });
});
