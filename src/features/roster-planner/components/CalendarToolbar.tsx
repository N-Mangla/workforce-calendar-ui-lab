import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { activityOptions, teamOptions } from "../mocks/rosterMockData";
import { useRosterFiltersStore } from "../store/rosterFiltersStore";
import type { WorkType } from "../types/rosterApi.types";
import type { CalendarViewMode } from "../types/calendarEvent.types";

interface CalendarToolbarProps {
  anchorDate: Date;
  onToday: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const viewModes: CalendarViewMode[] = ["day", "week", "month"];

const timeZones = [
  "Europe/Berlin",
  "Europe/Madrid",
  "Europe/Paris",
  "Asia/Kolkata",
  "UTC",
];

export function CalendarToolbar({ onToday, onPrevious, onNext }: CalendarToolbarProps) {
  const {
    viewMode,
    selectedTeamId,
    activityType,
    timeZoneId,
    simulateError,
    setViewMode,
    setSelectedTeamId,
    setWorkType,
    setTimeZoneId,
    setSimulateError,
    resetFilters,
  } = useRosterFiltersStore();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex flex-wrap items-center gap-2 xl:flex-nowrap">
          <button
            className="inline-flex h-10 shrink-0 items-center rounded-xl border border-slate-200 px-3 text-sm font-medium hover:bg-slate-50"
            onClick={onPrevious}
            type="button"
            aria-label="Previous range"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            className="inline-flex h-10 shrink-0 items-center rounded-xl border border-slate-200 px-3 text-sm font-medium hover:bg-slate-50"
            onClick={onToday}
            type="button"
          >
            Today
          </button>

          <button
            className="inline-flex h-10 shrink-0 items-center rounded-xl border border-slate-200 px-3 text-sm font-medium hover:bg-slate-50"
            onClick={onNext}
            type="button"
            aria-label="Next range"
          >
            <ChevronRight size={16} />
          </button>

          <div className="flex h-10 shrink-0 rounded-xl border border-slate-200 p-1 sm:ml-2">
            {viewModes.map((mode) => (
              <button
                className={`rounded-lg px-3 text-sm font-medium capitalize transition ${
                  viewMode === mode
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                key={mode}
                onClick={() => setViewMode(mode)}
                type="button"
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:max-w-[880px] xl:grid-cols-[1fr_1fr_1fr_auto_auto] xl:items-end">
          <label className="space-y-1 text-xs font-medium text-slate-600">
            Team
            <select
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
              value={selectedTeamId}
              onChange={(event) => setSelectedTeamId(event.target.value)}
            >
              {teamOptions.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-xs font-medium text-slate-600">
            Activity
            <select
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
              value={activityType}
              onChange={(event) => setWorkType(event.target.value as WorkType | "all")}
            >
              {activityOptions.map((activity) => (
                <option key={activity} value={activity}>
                  {activity === "all" ? "All" : activity}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-xs font-medium text-slate-600">
            Timezone
            <select
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
              value={timeZoneId}
              onChange={(event) => setTimeZoneId(event.target.value)}
            >
              {timeZones.map((timezone) => (
                <option key={timezone} value={timezone}>
                  {timezone}
                </option>
              ))}
            </select>
          </label>

          <button
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition xl:whitespace-nowrap ${
              simulateError
                ? "bg-red-100 text-red-800"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            onClick={() => setSimulateError(!simulateError)}
            type="button"
          >
            <RotateCcw size={15} />
            {simulateError ? "Error preview on" : "Preview API error"}
          </button>

          <button
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 xl:whitespace-nowrap"
            onClick={resetFilters}
            type="button"
          >
            Clear filters
          </button>
        </div>
      </div>
    </div>
  );
}