import { DashboardCalendarDay } from './dashboard-daily.mock';
import {
  calendarTodayForDate,
  startOfDay,
  toDateKey,
} from './dashboard-calendar-day.resolver';

export type ViewerDay = {
  dayKey: string;
  date: Date;
  calendarDay: DashboardCalendarDay;
  capturedAt: Date;
};

export function captureViewerDay(now = new Date()): ViewerDay {
  const date = startOfDay(now);

  return {
    dayKey: toDateKey(date),
    date,
    calendarDay: calendarTodayForDate(date),
    capturedAt: now,
  };
}

export function msUntilLocalMidnight(from = new Date()): number {
  const next = startOfDay(from);
  next.setDate(next.getDate() + 1);
  return next.getTime() - from.getTime();
}

/** First day of the prior month through last day of the following month. */
export function calendarNavRangeForDate(date: Date): { min: Date; max: Date } {
  const anchor = startOfDay(date);
  const year = anchor.getFullYear();
  const month = anchor.getMonth();

  return {
    min: new Date(year, month - 1, 1),
    max: new Date(year, month + 2, 0),
  };
}

const STORY_DATE_LABEL = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});

export function formatStoryDateLabel(date: Date): string {
  return STORY_DATE_LABEL.format(date);
}
