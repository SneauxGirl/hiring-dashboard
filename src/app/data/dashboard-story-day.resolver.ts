import {
  DASHBOARD_STORY_DAY_COUNT,
  DashboardStoryDay,
  dashboardForStoryDay,
} from './dashboard-daily.mock';

/** Story "today" by real weekday — Sun=0 … Sat=6. */
const STORY_TODAY_BY_DOW: Record<number, DashboardStoryDay> = {
  0: 5,
  1: 6,
  2: 7,
  3: 8,
  4: 4,
  5: 5,
  6: 5,
};

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

export function storyTodayForDate(referenceDate: Date = new Date()): DashboardStoryDay {
  return STORY_TODAY_BY_DOW[startOfDay(referenceDate).getDay()];
}

export function businessDaysBetween(from: Date, to: Date): number {
  let current = startOfDay(from);
  const target = startOfDay(to);

  if (current.getTime() === target.getTime()) {
    return 0;
  }

  const step = target > current ? 1 : -1;
  let count = 0;

  while (current.getTime() !== target.getTime()) {
    current.setDate(current.getDate() + step);
    if (!isWeekend(current)) {
      count += step;
    }
  }

  return count;
}

export function addBusinessDays(start: Date, days: number): Date {
  const result = startOfDay(start);

  if (days === 0) {
    return result;
  }

  const step = days > 0 ? 1 : -1;
  let remaining = Math.abs(days);

  while (remaining > 0) {
    result.setDate(result.getDate() + step);
    if (!isWeekend(result)) {
      remaining--;
    }
  }

  return result;
}

export function storyDayForDate(
  targetDate: Date,
  referenceDate: Date = new Date(),
): DashboardStoryDay | null {
  const anchor = storyTodayForDate(referenceDate);
  const storyDay = anchor + businessDaysBetween(referenceDate, targetDate);

  if (storyDay < 1 || storyDay > DASHBOARD_STORY_DAY_COUNT) {
    return null;
  }

  return storyDay as DashboardStoryDay;
}

export function dateForStoryDay(
  storyDay: DashboardStoryDay,
  referenceDate: Date = new Date(),
): Date {
  const anchor = storyTodayForDate(referenceDate);
  return addBusinessDays(referenceDate, storyDay - anchor);
}

export function selectableStoryDates(referenceDate: Date = new Date()): Date[] {
  const ref = startOfDay(referenceDate);
  const dates: Date[] = [];

  for (let storyDay = 1; storyDay <= DASHBOARD_STORY_DAY_COUNT; storyDay++) {
    dates.push(dateForStoryDay(storyDay as DashboardStoryDay, ref));
  }

  return dates;
}

export function isSelectableStoryDate(
  targetDate: Date,
  referenceDate: Date = new Date(),
): boolean {
  return storyDayForDate(targetDate, referenceDate) !== null;
}

export function storyDateRange(referenceDate: Date = new Date()): { min: Date; max: Date } {
  const dates = selectableStoryDates(referenceDate);
  return { min: dates[0], max: dates[dates.length - 1] };
}

/** Weekdays in the story span that do not map to story data (e.g. weekends). */
export function disabledDatesOutsideStory(referenceDate: Date = new Date()): Date[] {
  const { min, max } = storyDateRange(referenceDate);
  const disabled: Date[] = [];
  const cursor = startOfDay(min);

  while (cursor.getTime() <= max.getTime()) {
    if (!isSelectableStoryDate(cursor, referenceDate)) {
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
  const storyDay = storyDayForDate(targetDate, referenceDate);
  if (storyDay === null) {
    return null;
  }

  return dashboardForStoryDay(storyDay);
}
