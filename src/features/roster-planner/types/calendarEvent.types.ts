import type { WorkType } from "./rosterApi.types";

export type CalendarViewMode = "day" | "week" | "month";
export type CalendarEventKind = "workBlock" | "leave" | "non-working-day" | "holiday" | "work-block-label";

export interface CalendarEvent {
  id: string;
  title: string;
  kind: CalendarEventKind;
  startDate: string;
  endDate: string;
  allDay: boolean;
  resourceId: string;
  resourceName: string;
  teamId: string;
  teamName: string;
  activityType?: WorkType;
  color: string;
  hasExtraHours: boolean;
  isNonWorking: boolean;
  isLeave: boolean;
  scheduleLabelName?: string;
}

export interface CalendarRange {
  start: Date;
  end: Date;
}
