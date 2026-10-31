import { addDays, startOfDay } from "date-fns";
import type { CalendarEvent } from "../types/calendarEvent.types";

/**
 * An event occupies every local calendar day intersected by [start, end).
 * A shift ending exactly at midnight does not appear on the following day.
 * Calendar cells currently use the browser's local date boundaries.
 */
export function eventOverlapsCalendarDay(
  event: Pick<CalendarEvent, "startDate" | "endDate">,
  day: Date,
): boolean {
  const start = new Date(event.startDate).getTime();
  const end = new Date(event.endDate).getTime();
  const dayStart = startOfDay(day).getTime();
  const nextDayStart = addDays(startOfDay(day), 1).getTime();

  if (![start, end, dayStart, nextDayStart].every(Number.isFinite)) return false;
  if (end <= start) return false;

  return start < nextDayStart && end > dayStart;
}
