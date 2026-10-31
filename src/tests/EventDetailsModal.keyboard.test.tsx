import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { EventDetailsModal } from "../features/roster-planner/components/EventDetailsModal";
import type { CalendarEvent } from "../features/roster-planner/types/calendarEvent.types";

const event: CalendarEvent = {
  id: "shift", title: "Support shift", kind: "workBlock",
  startDate: "2026-10-31T09:00:00Z", endDate: "2026-10-31T17:00:00Z",
  allDay: false, resourceId: "r1", resourceName: "Teammate",
  teamId: "team1", teamName: "Support", color: "#2563eb",
  hasExtraHours: false, isNonWorking: false, isLeave: false,
};

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open event</button>
      <EventDetailsModal event={open ? event : null} onClose={() => setOpen(false)} />
    </>
  );
}

describe("EventDetailsModal keyboard access", () => {
  it("focuses the close button and restores focus to the opener after Escape", () => {
    render(<Example />);
    const opener = screen.getByRole("button", { name: "Open event" });
    opener.focus();
    fireEvent.click(opener);
    const close = screen.getByRole("button", { name: "Close event details" });
    expect(close).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("prevents Tab from escaping the last focusable dialog control", () => {
    render(<Example />);
    fireEvent.click(screen.getByRole("button", { name: "Open event" }));
    const close = screen.getByRole("button", { name: "Close event details" });
    const tab = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    const allowed = document.dispatchEvent(tab);
    expect(allowed).toBe(false);
    expect(close).toHaveFocus();
  });
});
