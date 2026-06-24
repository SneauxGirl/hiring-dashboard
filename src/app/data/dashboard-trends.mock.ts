import { TrendWeekData, WorkforceTrendMetricId } from '../models/dashboard.models';

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

/** Static workforce trends; month boundary and year labels follow the viewed calendar date. */
export function trendsForDate(viewDate: Date): TrendWeekData {
  return {
    asOfMonthIndex: viewDate.getMonth(),
    calendarYear: viewDate.getFullYear(),
    series: trendSeries(),
  };
}
