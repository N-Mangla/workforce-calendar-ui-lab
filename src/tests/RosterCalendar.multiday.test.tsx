import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { RosterCalendar } from "../features/roster-planner/components/RosterCalendar";
import { useRosterFiltersStore } from "../features/roster-planner/store/rosterFiltersStore";
import type { CalendarEvent } from "../features/roster-planner/types/calendarEvent.types";

const overnightShift: CalendarEvent = {
  id: "overnight-shift",
  title: "Overnight support shift",
  kind: "workBlock",
  startDate: "2026-10-31T22:00:00",
  endDate: "2026-11-01T06:00:00",
  allDay: false,
  resourceId: "res-1",
  resourceName: "Test Resource",
  teamId: "team-1",
  teamName: "Test Team",
  activityType: "Support",
  color: "#2563eb",
  hasExtraHours: false,
  isNonWorking: false,
  isLeave: false,
};

describe("RosterCalendar multi-day visibility", () => {
  beforeEach(() => {
    useRosterFiltersStore.setState({ viewMode: "week", timeZoneId: "Europe/Berlin" });
  });

  it("renders a shift crossing midnight on each of its two days", () => {
    render(
      <RosterCalendar
        anchorDate={new Date(2026, 9, 31)}
        range={{
          start: new Date(2026, 9, 26, 0, 0, 0),
          end: new Date(2026, 10, 1, 23, 59, 59, 999),
        }}
        events={[overnightShift]}
        onEventSelect={() => undefined}
      />,
    );

    expect(screen.getAllByText("Overnight support shift")).toHaveLength(2);
  });

  it("shows an event ending at midnight only in the preceding day in UTC", () => {
    useRosterFiltersStore.setState({ timeZoneId: "UTC" });
    render(
      <RosterCalendar
        anchorDate={new Date(2026, 9, 31)}
        range={{
          start: new Date(2026, 9, 26, 0, 0, 0),
          end: new Date(2026, 10, 1, 23, 59, 59, 999),
        }}
        events={[{ ...overnightShift, endDate: "2026-11-01T00:00:00" }]}
        onEventSelect={() => undefined}
      />,
    );

    expect(screen.getAllByText("Overnight support shift")).toHaveLength(1);
  });
});
