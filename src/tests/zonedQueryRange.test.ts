import { describe, expect, it } from "vitest";
import { getZonedQueryRange, todayInZone } from "../features/roster-planner/utils/zonedQueryRange";

const calendarDay = (date: string) => new Date(`${date}T12:00:00`);

describe("selected-timezone query boundaries", () => {
  it("converts a Kolkata calendar date to its UTC API interval", () => {
    const day = calendarDay("2026-11-01");
    expect(getZonedQueryRange({ start: day, end: day }, "Asia/Kolkata")).toEqual({
      startDate: "2026-10-31T18:30:00.000Z",
      endDate: "2026-11-01T18:30:00.000Z",
    });
  });

  it("uses a 23-hour calendar day at Berlin spring daylight saving transition", () => {
    const day = calendarDay("2026-03-29");
    const interval = getZonedQueryRange({ start: day, end: day }, "Europe/Berlin");
    expect(interval.startDate).toBe("2026-03-28T23:00:00.000Z");
    expect(interval.endDate).toBe("2026-03-29T22:00:00.000Z");
  });

  it("uses a 25-hour calendar day at Berlin autumn daylight saving transition", () => {
    const day = calendarDay("2026-10-25");
    const interval = getZonedQueryRange({ start: day, end: day }, "Europe/Berlin");
    expect(interval.startDate).toBe("2026-10-24T22:00:00.000Z");
    expect(interval.endDate).toBe("2026-10-25T23:00:00.000Z");
  });

  it("uses the destination date for Today across timezone boundaries", () => {
    expect(todayInZone("Asia/Kolkata", new Date("2026-10-31T21:00:00Z")).getDate()).toBe(1);
    expect(todayInZone("Asia/Kolkata", new Date("2026-10-31T21:00:00Z")).getMonth()).toBe(10);
    expect(todayInZone("UTC", new Date("2026-10-31T21:00:00Z")).getDate()).toBe(31);
  });
});
