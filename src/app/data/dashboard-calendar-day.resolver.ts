import {
  DASHBOARD_CALENDAR_DAY_COUNT,
  DashboardCalendarDay,
  dashboardForCalendarDay,
} from './dashboard-daily.mock';
import { resolveScheduleForCalendarDay } from './dashboard-schedule.resolver';

/** Narrative "today" on first load by real weekday — Sun=0 … Sat=6. */
const CALENDAR_TODAY_BY_DOW: Record<number, DashboardCalendarDay> = {
  0: 8,
  1: 9,
  2: 10,
  3: 11,
  4: 12,
  5: 13,
  6: 14,
};

const MS_PER_DAY = 86_400_000;

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
  const viewerToday = calendarTodayForDate(referenceDate);
  const calendarDay = viewerToday + calendarDaysBetween(referenceDate, targetDate);

  if (calendarDay < 1 || calendarDay > DASHBOARD_CALENDAR_DAY_COUNT) {
    return null;
  }

  if (calendarDay > viewerToday) {
    return null;
  }

  return calendarDay as DashboardCalendarDay;
}

export function dateForCalendarDay(
  calendarDay: DashboardCalendarDay,
  referenceDate: Date = new Date(),
): Date {
  const viewerToday = calendarTodayForDate(referenceDate);
  return addCalendarDays(referenceDate, calendarDay - viewerToday);
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
