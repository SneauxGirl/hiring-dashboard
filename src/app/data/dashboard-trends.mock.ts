import { StageDuration, TrendWeekData, WorkforceTrendMetricId } from '../models/dashboard.models';
import { DashboardWeekKey } from './dashboard-weeks.mock';

/** Prior calendar year — Jan through Dec (index 0 = January). */
const TREND_PRIOR_YEAR: Record<WorkforceTrendMetricId, readonly number[]> = {
  attrition: [13, 12, 14, 11, 10, 10, 8, 7, 7, 9, 12, 16],
  promotions: [6, 7, 9, 11, 14, 18, 17, 19, 22, 16, 12, 11],
  transfers: [3, 4, 5, 7, 8, 9, 10, 11, 12, 8, 7, 6],
  backfills: [8, 8, 9, 12, 13, 14, 16, 17, 19, 14, 11, 12],
};

/** Current calendar year — Jan through Dec (index 0 = January). */
const TREND_CURRENT_YEAR: Record<WorkforceTrendMetricId, readonly number[]> = {
  attrition: [16, 15, 14, 12, 11, 10, 8, 7, 7, 9, 12, 16],
  promotions: [5, 6, 8, 12, 15, 18, 17, 19, 22, 16, 12, 11],
  transfers: [4, 4, 5, 6, 8, 9, 10, 11, 12, 8, 7, 6],
  backfills: [7, 8, 9, 11, 12, 14, 16, 17, 19, 14, 11, 12],
};

function trendSeries(): TrendWeekData['series'] {
  return {
    attrition: {
      currentYear: [...TREND_CURRENT_YEAR.attrition],
      priorYear: [...TREND_PRIOR_YEAR.attrition],
    },
    promotions: {
      currentYear: [...TREND_CURRENT_YEAR.promotions],
      priorYear: [...TREND_PRIOR_YEAR.promotions],
    },
    transfers: {
      currentYear: [...TREND_CURRENT_YEAR.transfers],
      priorYear: [...TREND_PRIOR_YEAR.transfers],
    },
    backfills: {
      currentYear: [...TREND_CURRENT_YEAR.backfills],
      priorYear: [...TREND_PRIOR_YEAR.backfills],
    },
  };
}

/** Static workforce trends; only the in-progress month boundary follows the viewer's calendar. */
export function trendsForViewer(referenceDate: Date = new Date()): TrendWeekData {
  return {
    asOfMonthIndex: referenceDate.getMonth(),
    series: trendSeries(),
  };
}

/** @deprecated Weekly payloads still attach trends until daily migration; use trendsForViewer on the page. */
export function trendsForWeek(_weekKey: DashboardWeekKey): TrendWeekData {
  return trendsForViewer();
}

const WEEK_STAGE_DURATION_DAYS: Record<DashboardWeekKey, readonly number[]> = {
  '2026-06-01': [10, 9, 18, 14, 62, 3],
  '2026-06-08': [9, 8, 17, 12, 58, 2],
  '2026-06-15': [9, 8, 16, 11, 55, 2],
  '2026-06-22': [8, 7, 15, 10, 48, 2],
  '2026-06-29': [8, 7, 14, 9, 42, 2],
};

export function stageDurationDaysForWeek(weekKey: DashboardWeekKey): number[] {
  return [...WEEK_STAGE_DURATION_DAYS[weekKey]];
}

/** @deprecated Use stageDurationDaysForWeek */
export function stageDurationsForWeek(weekKey: DashboardWeekKey): StageDuration[] {
  return stageDurationDaysForWeek(weekKey).map((days, index) => ({
    fromStage: `h${index}`,
    toStage: `h${index + 1}`,
    days,
  }));
}
