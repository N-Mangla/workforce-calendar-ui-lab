import type { WorkType } from "../types/rosterApi.types";

export const rosterQueryKeys = {
  all: ["roster"] as const,
  range: (startDate: string, endDate: string, teamId: string, activityType: WorkType | "all", shouldFail: boolean) =>
    [...rosterQueryKeys.all, startDate, endDate, teamId, activityType, shouldFail] as const,
};
