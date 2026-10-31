import { describe, expect, it } from "vitest";
import { getRosterByRange } from "../features/roster-planner/api/rosterApi";
import { getZonedQueryRange } from "../features/roster-planner/utils/zonedQueryRange";

describe("mock roster API timezone boundaries", () => {
  it("returns only requested calendar day in Kolkata, without the adjacent UTC date", async () => {
    const day = new Date(2026, 10, 2, 12);
    const bounds = getZonedQueryRange({ start: day, end: day }, "Asia/Kolkata");
    const data = await getRosterByRange({ ...bounds, timeZoneId: "Asia/Kolkata", teamId: "all", activityType: "all" });
    expect(data.items.length).toBeGreaterThan(0);
    expect(data.items.every((item) => item.date.startsWith("2026-11-02"))).toBe(true);
  });

  it("does not generate extra roster days at DST end in Berlin", async () => {
    const day = new Date(2026, 9, 25, 12);
    const bounds = getZonedQueryRange({ start: day, end: day }, "Europe/Berlin");
    const data = await getRosterByRange({ ...bounds, timeZoneId: "Europe/Berlin", teamId: "all" });
    expect(data.items.length).toBeGreaterThan(0);
    expect(data.items.every((item) => item.date.startsWith("2026-10-25"))).toBe(true);
  });
});
