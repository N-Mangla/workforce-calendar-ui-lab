import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CalendarPage } from "../features/roster-planner/components/CalendarPage";
import { useRosterFiltersStore } from "../features/roster-planner/store/rosterFiltersStore";

vi.mock("../features/roster-planner/hooks/useRosterEvents", () => ({
  useRosterEvents: () => ({
    data: [{ id: "previous-range-event", title: "Previous range event", resourceId: "test", isLeave: false, isNonWorking: false, hasExtraHours: false, kind: "workBlock" }],
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

vi.mock("../features/roster-planner/components/RosterCalendar", () => ({
  RosterCalendar: ({ events }: { events: Array<{ title: string }> }) => (
    <div data-testid="calendar-events">{events.map((event) => <span key={event.title}>{event.title}</span>)}</div>
  ),
}));

describe("CalendarPage range navigation", () => {
  beforeEach(() => {
    useRosterFiltersStore.setState({ viewMode: "week", selectedTeamId: "all", activityType: "all", simulateError: false });
  });

  it("hides previously loaded events immediately after consecutive next-range clicks", () => {
    render(<CalendarPage />);

    expect(screen.getByText("Previous range event")).toBeInTheDocument();

    const next = screen.getByRole("button", { name: "Next range" });
    fireEvent.click(next);

    // Navigation updates the visible dates immediately, before the query debounce fires.
    expect(screen.queryByText("Previous range event")).not.toBeInTheDocument();
    expect(screen.getByTestId("calendar-events")).toBeEmptyDOMElement();

    fireEvent.click(next);
    expect(screen.queryByText("Previous range event")).not.toBeInTheDocument();
    expect(screen.getByTestId("calendar-events")).toBeEmptyDOMElement();
  });

  it("hides old events immediately when switching from week to month", () => {
    render(<CalendarPage />);
    expect(screen.getByText("Previous range event")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^month$/i }));

    expect(screen.queryByText("Previous range event")).not.toBeInTheDocument();
    expect(screen.getByTestId("calendar-events")).toBeEmptyDOMElement();
  });
});
