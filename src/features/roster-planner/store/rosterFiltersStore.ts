import { create } from "zustand";
import type { CalendarViewMode } from "../types/calendarEvent.types";
import type { WorkType } from "../types/rosterApi.types";

interface RosterFiltersState {
  viewMode: CalendarViewMode;
  selectedTeamId: string;
  activityType: WorkType | "all";
  timeZoneId: string;
  simulateError: boolean;
  setViewMode: (viewMode: CalendarViewMode) => void;
  setSelectedTeamId: (teamId: string) => void;
  setWorkType: (activityType: WorkType | "all") => void;
  setTimeZoneId: (timeZoneId: string) => void;
  setSimulateError: (simulateError: boolean) => void;
  resetFilters: () => void;
}

export const useRosterFiltersStore = create<RosterFiltersState>((set) => ({
  viewMode: "week",
  selectedTeamId: "all",
  activityType: "all",
  timeZoneId: "Europe/Berlin",
  simulateError: false,
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedTeamId: (selectedTeamId) => set({ selectedTeamId }),
  setWorkType: (activityType) => set({ activityType }),
  setTimeZoneId: (timeZoneId) => set({ timeZoneId }),
  setSimulateError: (simulateError) => set({ simulateError }),
  resetFilters: () => set({ selectedTeamId: "all", activityType: "all", timeZoneId: "Europe/Berlin" }),
}));
