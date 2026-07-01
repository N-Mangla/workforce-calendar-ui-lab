import type { CalendarEvent } from "../types/calendarEvent.types";

export function getEventClasses(event: CalendarEvent): string {
  const base = "rounded-lg border px-2 py-1 text-xs shadow-sm transition hover:shadow-md";

  if (event.hasExtraHours) {
    return `${base} calendar-event-chevron border-orange-300 bg-orange-50 text-orange-950`;
  }

  if (event.isNonWorking) {
    return `${base} calendar-event-chevron border-slate-300 bg-slate-100 text-slate-700`;
  }

  if (event.isLeave) {
    return `${base} border-red-200 bg-red-50 text-red-800`;
  }

  if (event.kind === "holiday") {
    return `${base} border-yellow-300 bg-yellow-50 text-yellow-900`;
  }

  if (event.kind === "work-block-label") {
    return `${base} border-blue-100 bg-blue-50 text-blue-800`;
  }

  return `${base} border-slate-200 bg-white text-slate-800`;
}

export function getReadableEventColor(hexColor: string): string {
  const sanitized = hexColor.replace("#", "");
  const numeric = parseInt(sanitized, 16);
  const r = (numeric >> 16) & 255;
  const g = (numeric >> 8) & 255;
  const b = numeric & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#0f172a" : "#ffffff";
}
