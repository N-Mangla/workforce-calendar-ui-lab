import { describe, expect, it } from "vitest";
import { transformRosterEvents } from "../features/roster-planner/transformers/transformRosterEvents";
import type { RosterApiResponse } from "../features/roster-planner/types/rosterApi.types";

const apiResponse: RosterApiResponse = {
  items: [
    {
      date: "2026-07-01T00:00:00.000Z",
      resourceId: "res-1",
      resourceName: "Test Resource",
      teamId: "team-alpha",
      teamName: "Customer Care",
      departmentId: "dept-1",
      scheduleLabel: {
        id: "cat-day",
        name: "Default Roster",
        shortName: "Default Roster",
        color: "#dbeafe",
      },
      nonWorkingDay: null,
      holiday: null,
      workBlock: [
        {
          id: "workBlock-1",
          name: "Customer Support",
          activityType: "Support",
          displayColorHex: "#2563eb",
          extraHours: true,
          period: {
            startTime: "2026-07-01T09:00:00.000Z",
            endTime: "2026-07-01T17:00:00.000Z",
          },
        },
      ],
    },
  ],
};

describe("transformRosterEvents", () => {
  it("maps timed work blocks into calendar events", () => {
    const events = transformRosterEvents(apiResponse);
    const workBlock = events.find((event) => event.kind === "workBlock");

    expect(workBlock).toMatchObject({
      title: "Customer Support",
      resourceName: "Test Resource",
      teamName: "Customer Care",
      allDay: false,
      hasExtraHours: true,
      isNonWorking: false,
      isLeave: false,
    });
  });

  it("creates an all-day schedule label event when the day has a schedule label", () => {
    const events = transformRosterEvents(apiResponse);
    const categoryEvent = events.find((event) => event.kind === "work-block-label");

    expect(categoryEvent).toBeDefined();
    expect(categoryEvent?.allDay).toBe(true);
    expect(categoryEvent?.title).toBe("Default Roster");
  });

  it("maps non-working day as an all-day event", () => {
    const withDayOff: RosterApiResponse = {
      items: [
        {
          ...apiResponse.items[0],
          workBlock: [],
          scheduleLabel: null,
          nonWorkingDay: {
            id: "nonworking-1",
            name: "Non-working Day",
            displayColorHex: "#e2e8f0",
          },
        },
      ],
    };

    const events = transformRosterEvents(withDayOff);
    expect(events[0]).toMatchObject({
      kind: "non-working-day",
      title: "Non-working Day",
      allDay: true,
      isNonWorking: true,
    });
  });

  it("creates an all-day leave summary for leave work blocks", () => {
    const withLeave: RosterApiResponse = {
      items: [
        {
          ...apiResponse.items[0],
          workBlock: [
            {
              id: "leave-1",
              name: "Sick Leave",
              activityType: "Leave",
              leaveRequestId: "leave-1",
              displayColorHex: "#ef4444",
              period: {
                startTime: "2026-07-01T09:00:00.000Z",
                endTime: "2026-07-01T17:00:00.000Z",
              },
            },
          ],
        },
      ],
    };

    const events = transformRosterEvents(withLeave);
    const leaveSummary = events.find((event) => event.id.includes("all-day-summary"));

    expect(leaveSummary).toBeDefined();
    expect(leaveSummary?.allDay).toBe(true);
    expect(leaveSummary?.isLeave).toBe(true);
  });
});
