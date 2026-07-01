import { Clock } from "lucide-react";
import { formatTimeInZone } from "../utils/dateTime";
import { getEventClasses, getReadableEventColor } from "../utils/eventStyle";
import { useRosterFiltersStore } from "../store/rosterFiltersStore";
import type { CalendarEvent } from "../types/calendarEvent.types";

interface CalendarEventCardProps {
  event: CalendarEvent;
  onSelect: (event: CalendarEvent) => void;
  compact?: boolean;
}

export function CalendarEventCard({ event, onSelect, compact = false }: CalendarEventCardProps) {
  const { timeZoneId } = useRosterFiltersStore();

  return (
    <button
      className={`${getEventClasses(event)} w-full text-left`}
      onClick={() => onSelect(event)}
      type="button"
      title={`${event.title} - ${event.resourceName}`}
    >
      <div className="flex items-start gap-2">
        <span
          className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: event.color, color: getReadableEventColor(event.color) }}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{event.title}</p>
          {!compact ? <p className="truncate text-[11px] opacity-75">{event.resourceName} · {event.teamName}</p> : null}
          {!event.allDay ? (
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] opacity-75">
              <Clock size={12} />
              {formatTimeInZone(event.startDate, timeZoneId)} - {formatTimeInZone(event.endDate, timeZoneId)}
            </p>
          ) : (
            <p className="mt-1 text-[11px] opacity-75">All day</p>
          )}
        </div>
      </div>
    </button>
  );
}
