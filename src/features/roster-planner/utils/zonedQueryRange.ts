import { addDays } from "date-fns";
import type { CalendarRange } from "../types/calendarEvent.types";

function fields(value: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(value);
  const part = (type: string) => Number(parts.find((item) => item.type === type)?.value);
  return { year: part("year"), month: part("month"), day: part("day"),
    hour: part("hour"), minute: part("minute"), second: part("second") };
}

export function zonedMidnight(day: Date, timeZone: string): Date {
  const target = Date.UTC(day.getFullYear(), day.getMonth(), day.getDate());
  let instant = target;
  for (let i = 0; i < 4; i += 1) {
    const p = fields(new Date(instant), timeZone);
    const displayed = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    const next = instant + target - displayed;
    if (next === instant) break;
    instant = next;
  }
  return new Date(instant);
}

export function getZonedQueryRange(range: CalendarRange, timeZone: string) {
  return {
    startDate: zonedMidnight(range.start, timeZone).toISOString(),
    endDate: zonedMidnight(addDays(range.end, 1), timeZone).toISOString(),
  };
}

export function todayInZone(timeZone: string, now = new Date()): Date {
  const p = fields(now, timeZone);
  return new Date(p.year, p.month - 1, p.day, 12);
}
