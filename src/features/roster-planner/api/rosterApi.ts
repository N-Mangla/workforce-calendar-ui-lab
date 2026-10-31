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

  // The API range is UTC instants [start, end). Generate synthetic roster
  // calendar dates in the requested zone, not the machine/browser timezone.
  const timeZone = params.timeZoneId ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zoneDate = (instant: Date) => {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(instant);
    const part = (type: string) => Number(parts.find((item) => item.type === type)?.value);
    return new Date(part("year"), part("month") - 1, part("day"), 12);
  };
  const start = zoneDate(new Date(params.startDate));
  const end = zoneDate(new Date(new Date(params.endDate).getTime() - 1));

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
