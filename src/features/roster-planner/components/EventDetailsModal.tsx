import { X } from "lucide-react";
import { Badge } from "../../../shared/components/Badge";
import { formatTimeInZone } from "../utils/dateTime";
import { useRosterFiltersStore } from "../store/rosterFiltersStore";
import type { CalendarEvent, CalendarEventKind } from "../types/calendarEvent.types";

interface EventDetailsModalProps {
  event: CalendarEvent | null;
  onClose: () => void;
}

export function EventDetailsModal({ event, onClose }: EventDetailsModalProps) {
  const { timeZoneId } = useRosterFiltersStore();

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-labelledby="event-details-title">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-700">Event details</p>
            <h2 className="mt-1 text-xl font-bold text-slate-950" id="event-details-title">{event.title}</h2>
          </div>
          <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100" onClick={onClose} type="button" aria-label="Close event details">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone={event.hasExtraHours ? "orange" : event.isLeave ? "red" : event.isNonWorking ? "slate" : "blue"}>{getEventTypeLabel(event)}</Badge>
          {event.activityType ? <Badge tone="green">{event.activityType}</Badge> : null}
          {event.scheduleLabelName ? <Badge>{formatRosterLabel(event.scheduleLabelName)}</Badge> : null}
        </div>

        <dl className="mt-6 grid gap-4 text-sm md:grid-cols-2">
          <DetailItem label="Activity" value={event.title} />
          <DetailItem label="Type" value={getEventTypeLabel(event)} />
          <div>
            <dt className="font-medium text-slate-500">Resource</dt>
            <dd className="mt-1 font-semibold text-slate-900">{event.resourceName}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Team</dt>
            <dd className="mt-1 font-semibold text-slate-900">{event.teamName}</dd>
          </div>
          <DetailItem label="Date" value={formatDate(event.startDate, timeZoneId)} />
          <div>
            <dt className="font-medium text-slate-500">Start</dt>
            <dd className="mt-1 font-semibold text-slate-900">{event.allDay ? "All day" : formatTimeInZone(event.startDate, timeZoneId)}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">End</dt>
            <dd className="mt-1 font-semibold text-slate-900">{event.allDay ? "All day" : formatTimeInZone(event.endDate, timeZoneId)}</dd>
          </div>
          <DetailItem label="Timezone" value={timeZoneId} />
          <DetailItem label="Roster label" value={formatRosterLabel(event.scheduleLabelName)} />
          <DetailItem label="Status / note" value={getEventNote(event)} />
        </dl>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          Demo data only. No real employee or client information is used.
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function formatDate(dateValue: string, timeZoneId: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: timeZoneId,
  }).format(new Date(dateValue));
}

function getEventTypeLabel(event: CalendarEvent): string {
  if (event.hasExtraHours) return "Extra Hours";
  if (event.isLeave) return "Leave";
  if (event.isNonWorking) return "Non-working Day";

  const labels: Record<CalendarEventKind, string> = {
    workBlock: event.activityType === "Coaching" ? "Coaching" : "Work Block",
    leave: "Leave",
    "non-working-day": "Non-working Day",
    holiday: "Holiday",
    "work-block-label": "Work Block",
  };

  return labels[event.kind];
}

function getEventNote(event: CalendarEvent): string {
  if (event.hasExtraHours) return "Includes extra hours in the mock roster.";
  if (event.isLeave) return "Approved leave event.";
  if (event.isNonWorking) return "Resource is unavailable for scheduled work.";
  if (event.kind === "holiday") return "Holiday marker for the visible roster range.";
  if (event.scheduleLabelName) return `Roster label: ${formatRosterLabel(event.scheduleLabelName)}`;
  return "Planned roster event";
}

function formatRosterLabel(label?: string): string {
  if (!label || label === "DY" || label === "Day Pattern") return "Default Roster";
  return label;
}
