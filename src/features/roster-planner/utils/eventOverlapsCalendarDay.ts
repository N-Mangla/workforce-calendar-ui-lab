import { format } from "date-fns";
import type { CalendarEvent } from "../types/calendarEvent.types";

/**
 * The cell's date is a calendar label (YYYY-MM-DD), not an instant in time.
 * Timed events are placed according to the timezone selected in the toolbar.
 * All-day mock events are represented as UTC-midnight dates and retain those
 * date labels regardless of the viewer's timezone.
 *
 * Intervals are end-exclusive: midnight end times belong to the preceding day.
 */
export function eventOverlapsCalendarDay(
  event: Pick<CalendarEvent, "startDate" | "endDate" | "allDay">,
  day: Date,
  timeZoneId = Intl.DateTimeFormat().resolvedOptions().timeZone,
): boolean {
  const start = new Date(event.startDate).getTime();
  const end = new Date(event.endDate).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return false;

  const cellDate = format(day, "yyyy-MM-dd");
  if (event.allDay) {
    const firstDate = new Date(start).toISOString().slice(0, 10);
    const lastDate = new Date(end - 1).toISOString().slice(0, 10);
    return cellDate >= firstDate && cellDate <= lastDate;
  }

  const dateFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timeZoneId,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const dateInZone = (timestamp: number): string => {
    const parts = dateFormatter.formatToParts(timestamp);
    const part = (type: string) => parts.find((entry) => entry.type === type)?.value ?? "";
    return `${part("year")}-${part("month")}-${part("day")}`;
  };

  return cellDate >= dateInZone(start) && cellDate <= dateInZone(end - 1);
}
