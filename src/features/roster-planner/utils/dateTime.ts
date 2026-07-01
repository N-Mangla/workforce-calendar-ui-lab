import { addDays, endOfMonth, endOfWeek, format, isSameDay, startOfMonth, startOfWeek } from "date-fns";
import type { CalendarRange, CalendarViewMode } from "../types/calendarEvent.types";

export function getCalendarRange(anchorDate: Date, viewMode: CalendarViewMode): CalendarRange {
  if (viewMode === "day") {
    return { start: startOfLocalDay(anchorDate), end: endOfLocalDay(anchorDate) };
  }

  if (viewMode === "month") {
    return {
      start: startOfWeek(startOfMonth(anchorDate), { weekStartsOn: 1 }),
      end: endOfWeek(endOfMonth(anchorDate), { weekStartsOn: 1 }),
    };
  }

  return {
    start: startOfWeek(anchorDate, { weekStartsOn: 1 }),
    end: endOfWeek(anchorDate, { weekStartsOn: 1 }),
  };
}

export function getVisibleDays(range: CalendarRange): Date[] {
  const days: Date[] = [];
  let current = startOfLocalDay(range.start);

  while (current <= range.end) {
    days.push(current);
    current = addDays(current, 1);
  }

  return days;
}

export function getNextAnchorDate(anchorDate: Date, viewMode: CalendarViewMode): Date {
  if (viewMode === "day") return addDays(anchorDate, 1);
  if (viewMode === "month") return new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 1);
  return addDays(anchorDate, 7);
}

export function getPreviousAnchorDate(anchorDate: Date, viewMode: CalendarViewMode): Date {
  if (viewMode === "day") return addDays(anchorDate, -1);
  if (viewMode === "month") return new Date(anchorDate.getFullYear(), anchorDate.getMonth() - 1, 1);
  return addDays(anchorDate, -7);
}

export function getRangeLabel(anchorDate: Date, viewMode: CalendarViewMode): string {
  const range = getCalendarRange(anchorDate, viewMode);
  if (viewMode === "day") return format(anchorDate, "EEEE, MMM d, yyyy");
  if (viewMode === "month") return format(anchorDate, "MMMM yyyy");
  return `${format(range.start, "MMM d")} - ${format(range.end, "MMM d, yyyy")}`;
}

export function isSameCalendarDate(left: string | Date, right: string | Date): boolean {
  return isSameDay(new Date(left), new Date(right));
}

export function formatTimeInZone(dateValue: string, timeZoneId: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timeZoneId,
  }).format(new Date(dateValue));
}

export function formatDateKey(date: string | Date): string {
  return new Date(date).toISOString().split("T")[0];
}

function startOfLocalDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfLocalDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
}
