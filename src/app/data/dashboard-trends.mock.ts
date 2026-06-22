import { StageDuration, TrendWeekData, WorkforceTrendMetricId } from '../models/dashboard.models';
import { DashboardWeekKey } from './dashboard-weeks.mock';

const PRIOR_YEAR_2025: Record<WorkforceTrendMetricId, readonly number[]> = {
  attrition: [13, 12, 14, 11, 10, 10, 8, 7, 7, 9, 12, 16],
  promotions: [6, 7, 9, 11, 14, 18, 17, 19, 22, 16, 12, 11],
  transfers: [3, 4, 5, 7, 8, 9, 10, 11, 12, 8, 7, 6],
  backfills: [8, 8, 9, 12, 13, 14, 16, 17, 19, 14, 11, 12],
};

/** Jan–May 2026 — stable history across June weeks. */
const BASE_JAN_MAY_2026: Record<WorkforceTrendMetricId, readonly number[]> = {
  attrition: [16, 15, 14, 12, 11],
  promotions: [5, 6, 8, 12, 15],
  transfers: [4, 4, 5, 6, 8],
  backfills: [7, 8, 9, 11, 12],
};

/** Jun 15 baseline — mid-month reference. */
const BASE_JUNE_2026: Record<WorkforceTrendMetricId, number> = {
  attrition: 10,
  promotions: 18,
  transfers: 9,
  backfills: 14,
};

/** Jun 8 / early Jul — limited movement after PTO week. */
const LIMITED_MONTH_2026: Record<WorkforceTrendMetricId, number> = {
  attrition: 4,
  promotions: 6,
  transfers: 3,
  backfills: 5,
};

const WEEK_TREND_SNAPSHOT: Record<
  DashboardWeekKey,
  { asOfMonthIndex: number; june: Record<WorkforceTrendMetricId, number>; july?: Record<WorkforceTrendMetricId, number> }
> = {
  '2026-06-01': {
    asOfMonthIndex: 5,
    june: { attrition: 0, promotions: 0, transfers: 0, backfills: 0 },
  },
  '2026-06-08': {
    asOfMonthIndex: 5,
    june: LIMITED_MONTH_2026,
  },
  '2026-06-15': {
    asOfMonthIndex: 5,
    june: BASE_JUNE_2026,
  },
  '2026-06-22': {
    asOfMonthIndex: 5,
    june: { attrition: 11, promotions: 19, transfers: 10, backfills: 15 },
  },
  '2026-06-29': {
    asOfMonthIndex: 6,
    june: { attrition: 12, promotions: 20, transfers: 11, backfills: 16 },
    july: LIMITED_MONTH_2026,
  },
};

const WEEK_STAGE_DURATION_DAYS: Record<DashboardWeekKey, readonly number[]> = {
  '2026-06-01': [10, 9, 18, 14, 62, 3],
  '2026-06-08': [9, 8, 17, 12, 58, 2],
  '2026-06-15': [9, 8, 16, 11, 55, 2],
  '2026-06-22': [8, 7, 15, 10, 48, 2],
  '2026-06-29': [8, 7, 14, 9, 42, 2],
};

function buildCurrentYear(
  june: Record<WorkforceTrendMetricId, number>,
  july?: Record<WorkforceTrendMetricId, number>,
): Record<WorkforceTrendMetricId, number[]> {
  return {
    attrition: [
      ...BASE_JAN_MAY_2026.attrition,
      june.attrition,
      july?.attrition ?? PRIOR_YEAR_2025.attrition[6],
      ...PRIOR_YEAR_2025.attrition.slice(7),
    ],
    promotions: [
      ...BASE_JAN_MAY_2026.promotions,
      june.promotions,
      july?.promotions ?? PRIOR_YEAR_2025.promotions[6],
      ...PRIOR_YEAR_2025.promotions.slice(7),
    ],
    transfers: [
      ...BASE_JAN_MAY_2026.transfers,
      june.transfers,
      july?.transfers ?? PRIOR_YEAR_2025.transfers[6],
      ...PRIOR_YEAR_2025.transfers.slice(7),
    ],
    backfills: [
      ...BASE_JAN_MAY_2026.backfills,
      june.backfills,
      july?.backfills ?? PRIOR_YEAR_2025.backfills[6],
      ...PRIOR_YEAR_2025.backfills.slice(7),
    ],
  };
}

export function trendsForWeek(weekKey: DashboardWeekKey): TrendWeekData {
  const snapshot = WEEK_TREND_SNAPSHOT[weekKey];
  const currentYear = buildCurrentYear(snapshot.june, snapshot.july);

  return {
    asOfMonthIndex: snapshot.asOfMonthIndex,
    series: {
      attrition: {
        currentYear: [...currentYear.attrition],
        priorYear: [...PRIOR_YEAR_2025.attrition],
      },
      promotions: {
        currentYear: [...currentYear.promotions],
        priorYear: [...PRIOR_YEAR_2025.promotions],
      },
      transfers: {
        currentYear: [...currentYear.transfers],
        priorYear: [...PRIOR_YEAR_2025.transfers],
      },
      backfills: {
        currentYear: [...currentYear.backfills],
        priorYear: [...PRIOR_YEAR_2025.backfills],
      },
    },
  };
}

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
