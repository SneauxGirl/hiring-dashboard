import {
  CandidateProfile,
  ScheduleEntry,
  ScheduleGroup,
  ScheduleInterviewEntry,
} from '../models/dashboard.models';
import {
  DashboardCalendarDay,
  dashboardForCalendarDay,
} from './dashboard-daily.mock';

export type ScheduleSlotPlan = {
  today: DashboardCalendarDay[];
  tomorrow: DashboardCalendarDay[];
  rest: DashboardCalendarDay[];
};

/** Interview source calendar days per slot — same resolver path for every narrative day. */
const SCHEDULE_SLOT_SOURCES: Record<DashboardCalendarDay, ScheduleSlotPlan> = {
  1: { today: [], tomorrow: [2], rest: [3, 4, 5, 6] },
  2: { today: [2], tomorrow: [3], rest: [4, 5, 6] },
  3: { today: [3], tomorrow: [4], rest: [5, 6] },
  4: { today: [4], tomorrow: [5], rest: [6] },
  5: { today: [5], tomorrow: [6], rest: [] },
  6: { today: [6], tomorrow: [], rest: [] },
  7: { today: [], tomorrow: [], rest: [] },
  8: { today: [], tomorrow: [9], rest: [10, 11, 12, 13] },
  9: { today: [9], tomorrow: [10], rest: [11, 12, 13] },
  10: { today: [10], tomorrow: [11], rest: [12, 13] },
  11: { today: [11], tomorrow: [12], rest: [13] },
  12: { today: [12], tomorrow: [13], rest: [] },
  13: { today: [13], tomorrow: [], rest: [] },
  14: { today: [], tomorrow: [], rest: [] },
  15: { today: [], tomorrow: [16], rest: [17, 18, 19, 20] },
  16: { today: [16], tomorrow: [17], rest: [18, 19, 20] },
  17: { today: [17], tomorrow: [18], rest: [19, 20] },
  18: { today: [18], tomorrow: [19], rest: [20] },
  19: { today: [19], tomorrow: [20], rest: [] },
  20: { today: [20], tomorrow: [], rest: [] },
  21: { today: [], tomorrow: [], rest: [] },
};

export function scheduleSlotsForCalendarDay(calendarDay: DashboardCalendarDay): ScheduleSlotPlan {
  return SCHEDULE_SLOT_SOURCES[calendarDay];
}

function isPtoSchedule(schedule: ScheduleEntry[]): boolean {
  return schedule.some((entry) => entry.kind === 'pto');
}

function entriesForSlot(
  calendarDays: DashboardCalendarDay[],
  group: ScheduleGroup,
): ScheduleEntry[] {
  return calendarDays.flatMap((calendarDay) => {
    const raw = dashboardForCalendarDay(calendarDay).schedule;

    if (isPtoSchedule(raw)) {
      return raw.filter((entry) => entry.group === group);
    }

    return raw
      .filter((entry): entry is ScheduleInterviewEntry => entry.kind !== 'pto')
      .map((entry) => ({ ...entry, group }));
  });
}

function candidatesForInterviews(
  interviews: ScheduleInterviewEntry[],
  calendarDays: Iterable<DashboardCalendarDay>,
): CandidateProfile[] {
  const ids = new Set(interviews.map((entry) => entry.candidateId));
  const candidates = new Map<string, CandidateProfile>();

  for (const calendarDay of calendarDays) {
    for (const candidate of dashboardForCalendarDay(calendarDay).candidates) {
      if (ids.has(candidate.id)) {
        candidates.set(candidate.id, candidate);
      }
    }
  }

  return [...candidates.values()];
}

export function resolveScheduleForCalendarDay(calendarDay: DashboardCalendarDay): {
  schedule: ScheduleEntry[];
  candidates: CandidateProfile[];
} {
  const slots = scheduleSlotsForCalendarDay(calendarDay);
  const referencedDays = new Set<DashboardCalendarDay>([
    ...slots.today,
    ...slots.tomorrow,
    ...slots.rest,
  ]);

  const schedule: ScheduleEntry[] = [
    ...entriesForSlot(slots.today, 'today'),
    ...entriesForSlot(slots.tomorrow, 'tomorrow'),
    ...entriesForSlot(slots.rest, 'this-week'),
  ];

  const interviews = schedule.filter(
    (entry): entry is ScheduleInterviewEntry => entry.kind !== 'pto',
  );

  return {
    schedule,
    candidates: candidatesForInterviews(interviews, referencedDays),
  };
}
