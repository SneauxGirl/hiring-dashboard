export type DashboardWeekKey =
  | '2026-06-01'
  | '2026-06-08'
  | '2026-06-15'
  | '2026-06-22'
  | '2026-06-29';

export const DASHBOARD_WEEKS = [
  { key: '2026-06-01', label: 'Jun 1 – 7, 2026' },
  { key: '2026-06-08', label: 'Jun 8 – 14, 2026' },
  { key: '2026-06-15', label: 'Jun 15 – 21, 2026' },
  { key: '2026-06-22', label: 'Jun 22 – 28, 2026' },
  { key: '2026-06-29', label: 'Jun 29 – Jul 5, 2026' },
] as const satisfies ReadonlyArray<{ key: DashboardWeekKey; label: string }>;
