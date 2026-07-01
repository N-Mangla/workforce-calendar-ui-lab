import { format } from "date-fns";
import { useState } from "react";
import { X } from "lucide-react";
import { useRosterFiltersStore } from "../store/rosterFiltersStore";
import { formatDateKey, getVisibleDays, isSameCalendarDate } from "../utils/dateTime";
import { CalendarEventCard } from "./CalendarEventCard";
import type { CalendarEvent, CalendarRange } from "../types/calendarEvent.types";

interface RosterCalendarProps {
  anchorDate: Date;
  range: CalendarRange;
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
}

export function RosterCalendar({ range, events, onEventSelect }: RosterCalendarProps) {
  const { viewMode } = useRosterFiltersStore();
  const [expandedDay, setExpandedDay] = useState<{ date: Date; events: CalendarEvent[] } | null>(null);
  const visibleDays = getVisibleDays(range);

  if (viewMode === "day") {
    return <DayCalendar day={visibleDays[0]} events={events} onEventSelect={onEventSelect} />;
  }

  return (
    <div className={`grid overflow-hidden rounded-2xl border border-slate-200 ${viewMode === "month" ? "grid-cols-1 md:grid-cols-7" : "grid-cols-1 md:grid-cols-7"}`}>
      {visibleDays.map((day) => {
        const dayEvents = events.filter((event) => isSameCalendarDate(event.startDate, day));
        const visibleEvents = viewMode === "month" ? dayEvents.slice(0, 3) : dayEvents;
        const remainingCount = dayEvents.length - visibleEvents.length;

        return (
          <section className="min-h-[220px] border-b border-r border-slate-200 bg-white p-3" key={formatDateKey(day)}>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{format(day, "EEE")}</p>
                <p className="text-sm font-semibold text-slate-900">{format(day, "MMM d")}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">{dayEvents.length}</span>
            </div>

            <div className="space-y-2">
              {visibleEvents.map((event) => (
                <CalendarEventCard event={event} key={event.id} onSelect={onEventSelect} compact={viewMode === "month"} />
              ))}
              {remainingCount > 0 ? (
                <button
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                  onClick={() => setExpandedDay({ date: day, events: dayEvents })}
                  type="button"
                  aria-label={`Show ${remainingCount} more events for ${format(day, "MMMM d")}`}
                >
                  +{remainingCount} more
                </button>
              ) : null}
            </div>
          </section>
        );
      })}
      <DayEventsModal
        day={expandedDay?.date ?? null}
        events={expandedDay?.events ?? []}
        onClose={() => setExpandedDay(null)}
        onEventSelect={onEventSelect}
      />
    </div>
  );
}

function DayCalendar({ day, events, onEventSelect }: { day: Date; events: CalendarEvent[]; onEventSelect: (event: CalendarEvent) => void }) {
  const dayEvents = events.filter((event) => isSameCalendarDate(event.startDate, day));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{format(day, "EEEE, MMMM d")}</h2>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {dayEvents.map((event) => (
          <CalendarEventCard event={event} key={event.id} onSelect={onEventSelect} />
        ))}
      </div>
    </div>
  );
}

function DayEventsModal({
  day,
  events,
  onClose,
  onEventSelect,
}: {
  day: Date | null;
  events: CalendarEvent[];
  onClose: () => void;
  onEventSelect: (event: CalendarEvent) => void;
}) {
  if (!day) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-labelledby="day-events-title">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-soft">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <p className="text-sm font-medium text-blue-700">Day details</p>
            <h2 className="mt-1 text-xl font-bold text-slate-950" id="day-events-title">
              {format(day, "EEEE, MMMM d")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{events.length} roster events</p>
          </div>
          <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100" onClick={onClose} type="button" aria-label="Close day details">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] space-y-3 overflow-y-auto p-5">
          {events.map((event) => (
            <CalendarEventCard
              event={event}
              key={event.id}
              onSelect={(selectedEvent) => {
                onClose();
                onEventSelect(selectedEvent);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
