export interface RosterApiResponse {
  items: RosterDayApi[];
}

export interface RosterDayApi {
  date: string;
  resourceId: string;
  resourceName: string;
  teamId: string;
  teamName: string;
  departmentId: string;
  scheduleLabel?: RosterLabelApi | null;
  workBlock: WorkBlockApi[];
  nonWorkingDay?: NonWorkingDayApi | null;
  holiday?: PublicHolidayApi | null;
}

export interface WorkBlockApi {
  id: string;
  name: string;
  activityType: WorkType;
  displayColorHex?: string;
  extraHours?: boolean;
  leaveRequestId?: string | null;
  period: {
    startTime: string;
    endTime: string;
  };
}

export interface RosterLabelApi {
  id: string;
  name: string;
  shortName: string;
  color?: string;
}

export interface NonWorkingDayApi {
  id: string;
  name: string;
  displayColorHex?: string;
}

export interface PublicHolidayApi {
  id: string;
  name: string;
  displayColorHex?: string;
}

export type WorkType = "Support" | "Training" | "Coaching" | "Admin" | "Break" | "Leave";

export interface RosterFiltersApiParams {
  startDate: string;
  endDate: string;
  teamId?: string;
  activityType?: WorkType | "all";
  shouldFail?: boolean;
}
