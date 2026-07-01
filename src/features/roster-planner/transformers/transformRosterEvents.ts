import type { CalendarEvent } from "../types/calendarEvent.types";
import type { RosterApiResponse, RosterDayApi } from "../types/rosterApi.types";

const DEFAULT_SHIFT_COLOR = "#64748b";
const DEFAULT_NON_WORKING_COLOR = "#e2e8f0";
const DEFAULT_HOLIDAY_COLOR = "#facc15";

export function transformRosterEvents(apiData: RosterApiResponse): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  apiData.items.forEach((day, dayIndex) => {
    const workBlockEvents = mapWorkBlockEvents(day, dayIndex);
    events.push(...workBlockEvents);

    const nonWorkingDayEvent = mapNonWorkingDayEvent(day, dayIndex);
    if (nonWorkingDayEvent) events.push(nonWorkingDayEvent);

    const holidayEvent = mapHolidayEvent(day, dayIndex);
    if (holidayEvent) events.push(holidayEvent);

    const leaves = workBlockEvents.filter((event) => event.isLeave);
    if (leaves.length > 0) {
      events.push(createAllDayLeaveSummary(leaves));
    }

    const categoryEvent = mapWorkBlockCategoryEvent(day, dayIndex);
    if (categoryEvent) events.push(categoryEvent);
  });

  return events;
}

function mapWorkBlockEvents(day: RosterDayApi, dayIndex: number): CalendarEvent[] {
  return day.workBlock.map((workBlock, workBlockIndex) => ({
    id: `workBlock-${dayIndex}-${workBlockIndex}-${workBlock.id}`,
    title: workBlock.name,
    kind: workBlock.leaveRequestId ? "leave" : "workBlock",
    startDate: workBlock.period.startTime,
    endDate: workBlock.period.endTime,
    allDay: false,
    resourceId: day.resourceId,
    resourceName: day.resourceName,
    teamId: day.teamId,
    teamName: day.teamName,
    activityType: workBlock.activityType,
    color: workBlock.displayColorHex ?? DEFAULT_SHIFT_COLOR,
    hasExtraHours: Boolean(workBlock.extraHours),
    isNonWorking: false,
    isLeave: Boolean(workBlock.leaveRequestId),
    scheduleLabelName: day.scheduleLabel?.shortName,
  }));
}

function mapNonWorkingDayEvent(day: RosterDayApi, dayIndex: number): CalendarEvent | null {
  if (!day.nonWorkingDay) return null;

  return {
    id: `nonworking-${dayIndex}-${day.nonWorkingDay.id}`,
    title: day.nonWorkingDay.name,
    kind: "non-working-day",
    startDate: toStartOfDay(day.date),
    endDate: toNextDay(day.date),
    allDay: true,
    resourceId: day.resourceId,
    resourceName: day.resourceName,
    teamId: day.teamId,
    teamName: day.teamName,
    color: day.nonWorkingDay.displayColorHex ?? DEFAULT_NON_WORKING_COLOR,
    hasExtraHours: false,
    isNonWorking: true,
    isLeave: false,
  };
}

function mapHolidayEvent(day: RosterDayApi, dayIndex: number): CalendarEvent | null {
  if (!day.holiday) return null;

  return {
    id: `holiday-${dayIndex}-${day.holiday.id}`,
    title: day.holiday.name,
    kind: "holiday",
    startDate: toStartOfDay(day.date),
    endDate: toNextDay(day.date),
    allDay: true,
    resourceId: day.resourceId,
    resourceName: day.resourceName,
    teamId: day.teamId,
    teamName: day.teamName,
    color: day.holiday.displayColorHex ?? DEFAULT_HOLIDAY_COLOR,
    hasExtraHours: false,
    isNonWorking: false,
    isLeave: false,
  };
}

function mapWorkBlockCategoryEvent(day: RosterDayApi, dayIndex: number): CalendarEvent | null {
  if (!day.scheduleLabel || day.workBlock.length === 0) return null;

  return {
    id: `work-block-label-${dayIndex}-${day.resourceId}`,
    title: day.scheduleLabel.name,
    kind: "work-block-label",
    startDate: toStartOfDay(day.date),
    endDate: toNextDay(day.date),
    allDay: true,
    resourceId: day.resourceId,
    resourceName: day.resourceName,
    teamId: day.teamId,
    teamName: day.teamName,
    color: day.scheduleLabel.color ?? "#dbeafe",
    hasExtraHours: false,
    isNonWorking: false,
    isLeave: false,
    scheduleLabelName: day.scheduleLabel.shortName,
  };
}

function createAllDayLeaveSummary(leaves: CalendarEvent[]): CalendarEvent {
  const longestLeave = leaves.reduce((longest, current) => {
    const longestDuration = new Date(longest.endDate).getTime() - new Date(longest.startDate).getTime();
    const currentDuration = new Date(current.endDate).getTime() - new Date(current.startDate).getTime();
    return currentDuration > longestDuration ? current : longest;
  }, leaves[0]);

  return {
    ...longestLeave,
    id: `${longestLeave.id}-all-day-summary`,
    title: `${longestLeave.title} summary`,
    allDay: true,
    startDate: toStartOfDay(longestLeave.startDate),
    endDate: toNextDay(longestLeave.startDate),
  };
}

function toStartOfDay(dateValue: string): string {
  return `${dateValue.split("T")[0]}T00:00:00.000Z`;
}

function toNextDay(dateValue: string): string {
  const date = new Date(toStartOfDay(dateValue));
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString();
}
