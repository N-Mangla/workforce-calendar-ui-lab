import { useMemo, useState } from "react";
import { CalendarDays, Clock3, Moon, Users } from "lucide-react";
import { getCalendarRange, getNextAnchorDate, getPreviousAnchorDate, getRangeLabel } from "../utils/dateTime";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useRosterEvents } from "../hooks/useRosterEvents";
import { useRosterFiltersStore } from "../store/rosterFiltersStore";
import { CalendarToolbar } from "./CalendarToolbar";
import { RosterLegend } from "./RosterLegend";
import { RosterCalendar } from "./RosterCalendar";
import { EventDetailsModal } from "./EventDetailsModal";
import { LoadingOverlay } from "../../../shared/components/LoadingOverlay";
import { ErrorState } from "../../../shared/components/ErrorState";
import { EmptyState } from "../../../shared/components/EmptyState";
import type { CalendarEvent } from "../types/calendarEvent.types";

export function CalendarPage() {
  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const { viewMode, selectedTeamId, activityType, simulateError, resetFilters } = useRosterFiltersStore();

  const range = useMemo(() => getCalendarRange(anchorDate, viewMode), [anchorDate, viewMode]);
  const debouncedRange = useDebouncedValue(range, 250);

  const rosterQuery = useRosterEvents({
    startDate: debouncedRange.start.toISOString(),
    endDate: debouncedRange.end.toISOString(),
    teamId: selectedTeamId,
    activityType,
    shouldFail: simulateError,
  });

  const events = rosterQuery.data ?? [];
  const metrics = useMemo(() => {
    const resources = new Set(events.map((event) => event.resourceId));
    const leaveOrNonWorking = events.filter((event) => event.isLeave || event.isNonWorking || event.kind === "holiday").length;
    const extraHours = events.filter((event) => event.hasExtraHours).length;

    return [
      { label: "Total Events", value: events.length, helper: "Visible in current range", icon: CalendarDays },
      { label: "Active Resources", value: resources.size, helper: "People represented", icon: Users },
      { label: "Leave / Non-working", value: leaveOrNonWorking, helper: "Absence and unavailable days", icon: Moon },
      { label: "Extra Hours", value: extraHours, helper: "Events marked as extended", icon: Clock3 },
    ];
  }, [events]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-950 md:p-8">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:flex-row md:items-center md:p-7">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              <CalendarDays size={18} />
              Workforce Calendar UI Lab
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Workforce Roster Planner</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              A React + TypeScript calendar interface for team scheduling, roster visibility, timezone-aware events,
              filters, and API-driven UI states.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Visible range</div>
            <div>{getRangeLabel(anchorDate, viewMode)}</div>
            <div className="mt-1 text-xs text-slate-500">Mock data refreshed just now</div>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Roster summary metrics">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" key={metric.label}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{metric.value}</p>
                  </div>
                  <span className="rounded-xl bg-slate-100 p-2 text-slate-600" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">{metric.helper}</p>
              </article>
            );
          })}
        </section>

        <CalendarToolbar
          anchorDate={anchorDate}
          onToday={() => setAnchorDate(new Date())}
          onPrevious={() => setAnchorDate((current) => getPreviousAnchorDate(current, viewMode))}
          onNext={() => setAnchorDate((current) => getNextAnchorDate(current, viewMode))}
        />

        <RosterLegend />

        {rosterQuery.isError ? (
          <ErrorState
            message="The mock roster service returned an error. Retry to restore the calendar view."
            onRetry={() => void rosterQuery.refetch()}
          />
        ) : (
          <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
            {rosterQuery.isFetching ? <LoadingOverlay /> : null}
            {events.length === 0 && !rosterQuery.isFetching ? (
              <EmptyState onAction={resetFilters} />
            ) : (
              <RosterCalendar
                anchorDate={anchorDate}
                events={events}
                range={range}
                onEventSelect={setSelectedEvent}
              />
            )}
          </div>
        )}
      </section>

      <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </main>
  );
}
