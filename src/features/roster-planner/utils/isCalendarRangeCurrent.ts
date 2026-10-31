import type { CalendarRange } from "../types/calendarEvent.types";

// The visible range must match the range used to request the displayed data.
// Compare timestamps rather than Date object identity because ranges are rebuilt.
export function isCalendarRangeCurrent(
  visibleRange: CalendarRange,
  requestedRange: CalendarRange,
): boolean {
  return (
    visibleRange.start.getTime() === requestedRange.start.getTime() &&
    visibleRange.end.getTime() === requestedRange.end.getTime()
  );
}
