import { WorkforceTrendMetricId } from '../../models/dashboard.models';

export const TREND_METRIC_DEFINITIONS: ReadonlyArray<{
  id: WorkforceTrendMetricId;
  label: string;
}> = [
  { id: 'attrition', label: 'Attrition' },
  { id: 'promotions', label: 'Promotions' },
  { id: 'transfers', label: 'Transfers' },
  { id: 'backfills', label: 'Backfills' },
] as const;

export const TREND_CHART_YEARS = {
  currentYear: 2026,
  priorYear: 2025,
} as const;
