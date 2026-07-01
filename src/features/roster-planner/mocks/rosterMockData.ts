import type { RosterDayApi, WorkBlockApi, WorkType } from "../types/rosterApi.types";

const resources = [
  {
    resourceId: "res-101",
    resourceName: "Ava Sharma",
    teamId: "team-alpha",
    teamName: "Customer Care",
  },
  {
    resourceId: "res-102",
    resourceName: "Milan Costa",
    teamId: "team-alpha",
    teamName: "Customer Care",
  },
  {
    resourceId: "res-201",
    resourceName: "Sofia Keller",
    teamId: "team-beta",
    teamName: "Operations Support",
  },
  {
    resourceId: "res-202",
    resourceName: "Noah Martin",
    teamId: "team-beta",
    teamName: "Operations Support",
  },
];

const colors = {
  support: "#2563eb",
  training: "#7c3aed",
  coaching: "#059669",
  admin: "#f97316",
  leave: "#ef4444",
  nonWorkingDay: "#e2e8f0",
  holiday: "#facc15",
};

function isoAt(date: Date, hour: number, minute = 0): string {
  const copy = new Date(date);
  copy.setHours(hour, minute, 0, 0);
  return copy.toISOString();
}

function dayKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function getResourcesForDate(date: Date, index: number) {
  const weekday = date.getDay();

  if (weekday === 0) {
    return [resources[3]];
  }

  if (weekday === 6) {
    return [resources[0], resources[2]];
  }

  if (weekday === 1 || weekday === 3 || weekday === 5) {
    return [resources[0], resources[1], resources[2]];
  }

  return [resources[1], resources[2], resources[3]].slice(
    0,
    index % 4 === 0 ? 3 : 2,
  );
}

function buildWorkBlock(current: Date, resourceIndex: number): WorkBlockApi {
  const weekday = current.getDay();
  const isTrainingDay = weekday === 2 && resourceIndex === 1;
  const isCoachingDay = weekday === 4 && resourceIndex === 2;
  const hasExtraHours = weekday === 5 && resourceIndex === 0;

  const activityType: WorkType = isTrainingDay
    ? "Training"
    : isCoachingDay
      ? "Coaching"
      : "Support";

  return {
    id: `workBlock-${dayKey(current)}-${resources[resourceIndex].resourceId}-1`,
    name: isTrainingDay
      ? "Product Training"
      : isCoachingDay
        ? "Coaching Session"
        : "Customer Support",
    activityType,
    displayColorHex: isTrainingDay
      ? colors.training
      : isCoachingDay
        ? colors.coaching
        : colors.support,
    extraHours: hasExtraHours,
    period: {
      startTime: isoAt(current, 9 + (resourceIndex % 2)),
      endTime: isoAt(current, hasExtraHours ? 15 : 13),
    },
  };
}

function buildAdminBlock(current: Date, resourceIndex: number): WorkBlockApi {
  const weekday = current.getDay();
  const hasExtraHours = weekday === 5 && resourceIndex === 0;

  return {
    id: `admin-${dayKey(current)}-${resources[resourceIndex].resourceId}`,
    name: "Admin Wrap-up",
    activityType: "Admin",
    displayColorHex: colors.admin,
    extraHours: hasExtraHours,
    period: {
      startTime: isoAt(current, 14),
      endTime: isoAt(current, hasExtraHours ? 18 : 17),
    },
  };
}

function buildLeaveBlock(current: Date, resourceId: string): WorkBlockApi {
  return {
    id: `leave-${dayKey(current)}-${resourceId}`,
    name: "Sick Leave",
    activityType: "Leave",
    leaveRequestId: `leave-${resourceId}`,
    displayColorHex: colors.leave,
    period: {
      startTime: isoAt(current, 9),
      endTime: isoAt(current, 17),
    },
  };
}

export function buildMockRosterDays(startDate: Date, endDate: Date): RosterDayApi[] {
  const days: RosterDayApi[] = [];
  let current = new Date(startDate);
  let index = 0;

  while (current <= endDate) {
    const weekday = current.getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const isHoliday = index === 3;
    const activeResources = getResourcesForDate(current, index);

    activeResources.forEach((resource) => {
      const resourceIndex = resources.findIndex(
        (item) => item.resourceId === resource.resourceId,
      );

      if (resourceIndex === -1) return;

      const isLeaveDay = index % 13 === 2 && resourceIndex === 1;

      days.push({
        date: `${dayKey(current)}T00:00:00.000Z`,
        ...resource,
        departmentId: "dept-operations-demo",
        scheduleLabel: isWeekend
          ? null
          : {
              id: "cat-day",
              name: "Default Roster",
              shortName: "Default Roster",
              color: "#dbeafe",
            },
        nonWorkingDay: isWeekend
          ? {
              id: `nonworking-${dayKey(current)}-${resource.resourceId}`,
              name: "Non-working Day",
              displayColorHex: colors.nonWorkingDay,
            }
          : null,
        holiday: isHoliday
          ? {
              id: `holiday-${dayKey(current)}-${resource.resourceId}`,
              name: "Regional Holiday",
              displayColorHex: colors.holiday,
            }
          : null,
        workBlock: isWeekend
          ? []
          : isLeaveDay
            ? [buildLeaveBlock(current, resource.resourceId)]
            : resourceIndex === 0 && (weekday === 1 || weekday === 5)
              ? [buildWorkBlock(current, resourceIndex), buildAdminBlock(current, resourceIndex)]
              : [buildWorkBlock(current, resourceIndex)],
      });
    });

    current = addDays(current, 1);
    index += 1;
  }

  return days;
}

export const teamOptions = [
  { id: "all", label: "All teams" },
  { id: "team-alpha", label: "Customer Care" },
  { id: "team-beta", label: "Operations Support" },
];

export const activityOptions = [
  "all",
  "Support",
  "Training",
  "Coaching",
  "Admin",
  "Break",
  "Leave",
] as const;