import {
  DASHBOARD_CALENDAR_DAY_COUNT,
  DashboardCalendarDay,
  dashboardForCalendarDay,
} from './dashboard-daily.mock';
import { resolveScheduleForCalendarDay } from './dashboard-schedule.resolver';

/** Narrative anchor by real weekday — Sun=0 … Sat=6. */
const CALENDAR_TODAY_BY_DOW: Record<number, DashboardCalendarDay> = {
  0: 6,
  1: 9,
  2: 10,
  3: 11,
  4: 5,
  5: 6,
  6: 6,
};

const MS_PER_DAY = 86_400_000;

/** Su3 — present in the grid but not user-selectable. */
export const UNSELECTABLE_CALENDAR_DAY = 15 as DashboardCalendarDay;

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function toDateKey(date: Date): string {
  const normalized = startOfDay(date);
  const year = normalized.getFullYear();
  const month = String(normalized.getMonth() + 1).padStart(2, '0');
  const day = String(normalized.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function calendarTodayForDate(referenceDate: Date = new Date()): DashboardCalendarDay {
  return CALENDAR_TODAY_BY_DOW[startOfDay(referenceDate).getDay()];
}

export function calendarDaysBetween(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / MS_PER_DAY);
}

export function addCalendarDays(start: Date, days: number): Date {
  const result = startOfDay(start);
  result.setDate(result.getDate() + days);
  return result;
}

export function calendarDayForDate(
  targetDate: Date,
  referenceDate: Date = new Date(),
): DashboardCalendarDay | null {
  const anchor = calendarTodayForDate(referenceDate);
  const calendarDay = anchor + calendarDaysBetween(referenceDate, targetDate);

  if (calendarDay < 1 || calendarDay > DASHBOARD_CALENDAR_DAY_COUNT) {
    return null;
  }

  if (calendarDay === UNSELECTABLE_CALENDAR_DAY) {
    return null;
  }

  return calendarDay as DashboardCalendarDay;
}

export function dateForCalendarDay(
  calendarDay: DashboardCalendarDay,
  referenceDate: Date = new Date(),
): Date {
  const anchor = calendarTodayForDate(referenceDate);
  return addCalendarDays(referenceDate, calendarDay - anchor);
}

export function selectableCalendarDates(referenceDate: Date = new Date()): Date[] {
  const dates: Date[] = [];

  for (let calendarDay = 1; calendarDay <= DASHBOARD_CALENDAR_DAY_COUNT; calendarDay++) {
    if (calendarDay === UNSELECTABLE_CALENDAR_DAY) {
      continue;
    }

    dates.push(dateForCalendarDay(calendarDay as DashboardCalendarDay, referenceDate));
  }

  return dates;
}

export function isSelectableCalendarDate(
  targetDate: Date,
  referenceDate: Date = new Date(),
): boolean {
  return calendarDayForDate(targetDate, referenceDate) !== null;
}

/** Non-narrative days within the calendar navigation window. */
export function disabledDatesInCalendarNav(
  viewerAnchor: Date,
  navRange: { min: Date; max: Date },
): Date[] {
  const disabled: Date[] = [];
  const cursor = startOfDay(navRange.min);

  while (cursor.getTime() <= navRange.max.getTime()) {
    if (!isSelectableCalendarDate(cursor, viewerAnchor)) {
      disabled.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return disabled;
}

export function dashboardForDate(
  targetDate: Date,
  referenceDate: Date = new Date(),
) {
  const calendarDay = calendarDayForDate(targetDate, referenceDate);
  if (calendarDay === null) {
    return null;
  }

  const dashboard = dashboardForCalendarDay(calendarDay);
  const { schedule, candidates } = resolveScheduleForCalendarDay(calendarDay);

  return {
    ...dashboard,
    schedule,
    candidates,
  };
}
