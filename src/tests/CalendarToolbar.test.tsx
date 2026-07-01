import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CalendarToolbar } from "../features/roster-planner/components/CalendarToolbar";
import { useRosterFiltersStore } from "../features/roster-planner/store/rosterFiltersStore";

describe("CalendarToolbar", () => {
  it("updates view mode when a view button is clicked", async () => {
    const user = userEvent.setup();
    useRosterFiltersStore.setState({ viewMode: "week" });

    render(
      <CalendarToolbar
        anchorDate={new Date("2026-07-01")}
        onToday={() => undefined}
        onPrevious={() => undefined}
        onNext={() => undefined}
      />,
    );

    await user.click(screen.getByRole("button", { name: /month/i }));
    expect(useRosterFiltersStore.getState().viewMode).toBe("month");
  });
});
