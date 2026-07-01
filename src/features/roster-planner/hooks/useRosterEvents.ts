import { useQuery } from "@tanstack/react-query";
import { getRosterByRange } from "../api/rosterApi";
import { rosterQueryKeys } from "../api/rosterQueryKeys";
import { transformRosterEvents } from "../transformers/transformRosterEvents";
import type { WorkType } from "../types/rosterApi.types";

interface UseRosterEventsParams {
  startDate: string;
  endDate: string;
  teamId: string;
  activityType: WorkType | "all";
  shouldFail: boolean;
}

export function useRosterEvents(params: UseRosterEventsParams) {
  return useQuery({
    queryKey: rosterQueryKeys.range(
      params.startDate,
      params.endDate,
      params.teamId,
      params.activityType,
      params.shouldFail,
    ),
    queryFn: async () => {
      const response = await getRosterByRange({
        startDate: params.startDate,
        endDate: params.endDate,
        teamId: params.teamId,
        activityType: params.activityType,
        shouldFail: params.shouldFail,
      });

      return transformRosterEvents(response);
    },
  });
}
