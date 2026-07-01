import { buildMockRosterDays } from "../mocks/rosterMockData";
import type { RosterApiResponse, RosterFiltersApiParams } from "../types/rosterApi.types";

const NETWORK_DELAY_MS = 450;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function getRosterByRange(params: RosterFiltersApiParams): Promise<RosterApiResponse> {
  await wait(NETWORK_DELAY_MS);

  if (params.shouldFail) {
    throw new Error("Mock roster API failed. Use this to test retry and error UX.");
  }

  const start = new Date(params.startDate);
  const end = new Date(params.endDate);

  const result = buildMockRosterDays(start, end)
    .filter((day) => !params.teamId || params.teamId === "all" || day.teamId === params.teamId)
    .map((day) => ({
      ...day,
      workBlock:
        params.activityType && params.activityType !== "all"
          ? day.workBlock.filter((workBlock) => workBlock.activityType === params.activityType)
          : day.workBlock,
    }));

  return { items: result };
}
