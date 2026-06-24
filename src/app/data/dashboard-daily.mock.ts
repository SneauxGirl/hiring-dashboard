import { DashboardWeekData } from '../models/dashboard.models';
import { stageDurationDaysForWeek, trendsForWeek } from './dashboard-trends.mock';
import { DashboardWeekKey } from './dashboard-weeks.mock';

export type DashboardDayKey =
  | '2026-06-01'
  | '2026-06-02'
  | '2026-06-03'
  | '2026-06-04'
  | '2026-06-05'
  | '2026-06-08'
  | '2026-06-09'
  | '2026-06-10'
  | '2026-06-11'
  | '2026-06-12'
  | '2026-06-15'
  | '2026-06-16'
  | '2026-06-17'
  | '2026-06-18'
  | '2026-06-19';

export const DASHBOARD_DAYS = [
  { key: '2026-06-01', label: 'Mon, Jun 1' },
  { key: '2026-06-02', label: 'Tue, Jun 2' },
  { key: '2026-06-03', label: 'Wed, Jun 3' },
  { key: '2026-06-04', label: 'Thu, Jun 4' },
  { key: '2026-06-05', label: 'Fri, Jun 5' },
  { key: '2026-06-08', label: 'Mon, Jun 8' },
  { key: '2026-06-09', label: 'Tue, Jun 9' },
  { key: '2026-06-10', label: 'Wed, Jun 10' },
  { key: '2026-06-11', label: 'Thu, Jun 11' },
  { key: '2026-06-12', label: 'Fri, Jun 12' },
  { key: '2026-06-15', label: 'Mon, Jun 15' },
  { key: '2026-06-16', label: 'Tue, Jun 16' },
  { key: '2026-06-17', label: 'Wed, Jun 17' },
  { key: '2026-06-18', label: 'Thu, Jun 18' },
  { key: '2026-06-19', label: 'Fri, Jun 19' },
] as const satisfies ReadonlyArray<{ key: DashboardDayKey; label: string }>;

function weekKeyForDay(dayKey: DashboardDayKey): DashboardWeekKey {
  if (dayKey <= '2026-06-05') return '2026-06-01';
  if (dayKey <= '2026-06-12') return '2026-06-08';
  return '2026-06-15';
}

function day(
  dayKey: DashboardDayKey,
  data: Omit<DashboardWeekData, 'trends' | 'stageDurationDays'>,
): DashboardWeekData {
  const weekKey = weekKeyForDay(dayKey);

  return {
    ...data,
    trends: trendsForWeek(weekKey),
    stageDurationDays: stageDurationDaysForWeek(weekKey),
  };
}

function pct(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Number(((current / previous) * 100).toFixed(2));
}

function funnelStages(counts: readonly [number, number, number, number, number, number]) {
  return counts.map((count, index) =>
    index === 0 ? { count } : { count, conversionPct: pct(count, counts[index - 1]) },
  );
}

/**
 * Funnel is rolling 30-day movement as of the selected business day.
 *
 * These are not single-day active counts. They represent candidates who entered
 * or moved through each stage during the trailing 30-day window.
 *
 * During PTO week, top/middle funnel can still move because recruiters can add,
 * screen, and send assessments. Interviews, final rounds, offers, and hires do
 * not advance that week.
 */
const THIRTY_DAY_FUNNEL_BY_DAY: Record<
  DashboardDayKey,
  readonly [number, number, number, number, number, number]
> = {
  '2026-06-01': [2875, 2638, 1582, 214, 15, 13],
  '2026-06-02': [2928, 2687, 1606, 219, 15, 13],
  '2026-06-03': [2984, 2735, 1634, 224, 16, 14],
  '2026-06-04': [3042, 2791, 1668, 231, 16, 14],
  '2026-06-05': [3098, 2844, 1702, 238, 17, 15],
  '2026-06-08': [3210, 2947, 1766, 246, 17, 15],
  '2026-06-09': [3276, 3012, 1810, 254, 18, 16],
  '2026-06-10': [3345, 3078, 1856, 263, 19, 16],
  '2026-06-11': [3416, 3142, 1898, 272, 20, 17],
  '2026-06-12': [3488, 3205, 1936, 281, 21, 18],
  '2026-06-15': [3560, 3260, 1958, 281, 21, 18],
  '2026-06-16': [3634, 3315, 1986, 281, 21, 18],
  '2026-06-17': [3712, 3374, 2016, 281, 21, 18],
  '2026-06-18': [3790, 3435, 2048, 281, 21, 18],
  '2026-06-19': [3868, 3492, 2076, 281, 21, 18],
};

type Stage = 'Application' | 'Screening' | 'Assessment' | 'Interview' | 'Final Round' | 'Offer' | 'Hired';
type Responsibility = 'waiting-on-me' | 'waiting-on-recruiter' | 'candidates-aging';
type Risk = 'low' | 'medium' | 'high';

type ReqInput = readonly [
  id: string,
  role: string,
  candidates: number,
  stage: Stage,
  responsibility: Responsibility,
  daysOpen: number,
  risk: Risk,
];

function reqs(items: readonly ReqInput[], moreCount: number) {
  return {
    items: items.map(([id, role, candidates, stage, responsibility, daysOpen, risk]) => ({
      id,
      role,
      candidates,
      stage,
      responsibility,
      daysOpen,
      risk,
    })),
    moreCount,
  };
}

function bottlenecks(waitingOnMe: number, waitingOnRecruiter: number, aging: number, meAvg: number, recruiterAvg: number, agingAvg: number) {
  return [
    { responsibility: 'waiting-on-me', candidateCount: waitingOnMe, avgMetric: meAvg },
    { responsibility: 'waiting-on-recruiter', candidateCount: waitingOnRecruiter, avgMetric: recruiterAvg },
    { responsibility: 'candidates-aging', candidateCount: aging, avgMetric: agingAvg },
  ];
}

const CANDIDATES = {
  lena: {
    id: 'c-lena-morris',
    name: 'Lena Morris',
    roleTitle: 'Senior Frontend Engineer',
    roleSpecs: 'Frontend engineer with Angular, accessibility, and design-system experience.',
  },
  omar: {
    id: 'c-omar-saleh',
    name: 'Omar Saleh',
    roleTitle: 'Backend Engineer',
    roleSpecs: 'Backend engineer focused on APIs, services, and cloud deployment.',
  },
  nina: {
    id: 'c-nina-walker',
    name: 'Nina Walker',
    roleTitle: 'Senior Frontend Engineer',
    roleSpecs: 'Senior frontend engineer with Angular and component-library ownership.',
  },
  daniel: {
    id: 'c-daniel-kim',
    name: 'Daniel Kim',
    roleTitle: 'Backend Engineer',
    roleSpecs: 'Backend engineer with API, database, and service reliability experience.',
  },
  aisha: {
    id: 'c-aisha-robinson',
    name: 'Aisha Robinson',
    roleTitle: 'Senior Frontend Engineer',
    roleSpecs: 'Frontend lead with accessibility, state management, and UI architecture experience.',
  },
  marcus: {
    id: 'c-marcus-green',
    name: 'Marcus Green',
    roleTitle: 'Backend Engineer',
    roleSpecs: 'Backend engineer with distributed systems, API design, and cloud deployment experience.',
  },
  sarah: {
    id: 'c-sarah-chen',
    name: 'Sarah Chen',
    roleTitle: 'Senior Frontend Engineer',
    roleSpecs:
      '5+ years building responsive web apps with Angular or React. Leads UI implementation, mentors junior engineers, and partners with design on component systems.',
  },
  mike: {
    id: 'c-mike-davis',
    name: 'Mike Davis',
    roleTitle: 'Product Designer',
    roleSpecs:
      'End-to-end product designer with strong UX research and visual design skills. Portfolio should show mobile-first flows and design-system work.',
  },
  priya: {
    id: 'c-priya-shah',
    name: 'Priya Shah',
    roleTitle: 'Product Designer',
    roleSpecs:
      'Product designer with mobile-first UX, research synthesis, and design-system experience.',
  },
  grace: {
    id: 'c-grace-lee',
    name: 'Grace Lee',
    roleTitle: 'Senior Frontend Engineer',
    roleSpecs: 'Senior UI engineer with component architecture and mentoring experience.',
  },
};

const PTO_SCHEDULE = [
  { id: 'pto-today', kind: 'pto', group: 'today' },
  { id: 'pto-tomorrow', kind: 'pto', group: 'tomorrow' },
  { id: 'pto-week', kind: 'pto', group: 'this-week' },
] as const;

const KPI_0601 = [
  { value: 4, delta: '0 this month', trend: 'neutral' },
  { value: 41, valueUnit: 'days', delta: '2 days', trend: 'up' },
  { value: 87, valueUnit: '%', delta: 'No change', trend: 'neutral' },
  { value: 6, delta: '2 versus previous month', trend: 'up' },
] as const;

const KPI_0608 = [
  { value: 5, delta: '1 this month', trend: 'up' },
  { value: 39, valueUnit: 'days', delta: '2 days', trend: 'down' },
  { value: 88, valueUnit: '%', delta: '1% acceptance', trend: 'up' },
  { value: 6, delta: 'no change', trend: 'neutral' },
] as const;

const KPI_0615 = [
  { value: 8, delta: '4 this month', trend: 'up' },
  { value: 35, valueUnit: 'days', delta: '6 days', trend: 'down' },
  { value: 89, valueUnit: '%', delta: '2% acceptance', trend: 'up' },
  { value: 6, delta: 'PTO week', trend: 'neutral' },
] as const;

export const MOCK_DASHBOARD_BY_DAY: Record<DashboardDayKey, DashboardWeekData> = {
  '2026-06-01': day('2026-06-01', {
    kpis: KPI_0601,
    openRequisitions: reqs([
      ['r1', 'Senior Frontend Engineer', 612, 'Assessment', 'waiting-on-recruiter', 18, 'medium'],
      ['r2', 'Product Designer', 894, 'Screening', 'candidates-aging', 24, 'medium'],
      ['r4', 'Backend Engineer', 548, 'Assessment', 'waiting-on-recruiter', 21, 'medium'],
      ['r5', 'Data Analyst', 821, 'Screening', 'waiting-on-me', 16, 'low'],
    ], 0),
    candidates: [],
    schedule: [],
    bottlenecks: bottlenecks(7, 8, 15, 8.1, 5.6, 20.4),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_DAY['2026-06-01']),
  }),

  '2026-06-02': day('2026-06-02', {
    kpis: KPI_0601,
    openRequisitions: reqs([
      ['r1', 'Senior Frontend Engineer', 608, 'Assessment', 'waiting-on-recruiter', 19, 'medium'],
      ['r2', 'Product Designer', 906, 'Screening', 'candidates-aging', 25, 'medium'],
      ['r4', 'Backend Engineer', 544, 'Assessment', 'waiting-on-recruiter', 22, 'medium'],
      ['r5', 'Data Analyst', 836, 'Screening', 'waiting-on-me', 17, 'low'],
    ], 0),
    candidates: [CANDIDATES.lena],
    schedule: [{ id: 'i-0602-1', timeLabel: '10:30 AM', group: 'today', candidateId: 'c-lena-morris' }],
    bottlenecks: bottlenecks(7, 8, 15, 8, 5.5, 20.2),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_DAY['2026-06-02']),
  }),

  '2026-06-03': day('2026-06-03', {
    kpis: [KPI_0601[0], { value: 40, valueUnit: 'days', delta: '1 day', trend: 'down' }, { value: 88, valueUnit: '%', delta: '1% acceptance', trend: 'up' }, KPI_0601[3]],
    openRequisitions: reqs([
      ['r1', 'Senior Frontend Engineer', 590, 'Assessment', 'waiting-on-recruiter', 20, 'medium'],
      ['r2', 'Product Designer', 918, 'Screening', 'candidates-aging', 26, 'medium'],
      ['r4', 'Backend Engineer', 526, 'Assessment', 'waiting-on-recruiter', 23, 'medium'],
      ['r5', 'Data Analyst', 849, 'Screening', 'waiting-on-me', 18, 'low'],
    ], 0),
    candidates: [],
    schedule: [],
    bottlenecks: bottlenecks(7, 8, 14, 7.9, 5.4, 19.8),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_DAY['2026-06-03']),
  }),

  '2026-06-04': day('2026-06-04', {
    kpis: [{ value: 5, delta: '1 this month', trend: 'up' }, { value: 40, valueUnit: 'days', delta: '1 day', trend: 'down' }, { value: 88, valueUnit: '%', delta: '1% acceptance', trend: 'up' }, KPI_0601[3]],
    openRequisitions: reqs([
      ['r1', 'Senior Frontend Engineer', 575, 'Assessment', 'waiting-on-recruiter', 21, 'medium'],
      ['r2', 'Product Designer', 930, 'Screening', 'candidates-aging', 27, 'medium'],
      ['r3', 'Marketing Manager', 925, 'Screening', 'candidates-aging', 20, 'medium'],
      ['r4', 'Backend Engineer', 510, 'Assessment', 'waiting-on-recruiter', 24, 'medium'],
      ['r5', 'Data Analyst', 862, 'Screening', 'waiting-on-me', 19, 'low'],
    ], 0),
    candidates: [CANDIDATES.omar],
    schedule: [{ id: 'i-0604-1', timeLabel: '1:00 PM', group: 'today', candidateId: 'c-omar-saleh' }],
    bottlenecks: bottlenecks(7, 8, 14, 7.8, 5.3, 19.6),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_DAY['2026-06-04']),
  }),

  '2026-06-05': day('2026-06-05', {
    kpis: [{ value: 5, delta: '1 this month', trend: 'up' }, { value: 39, valueUnit: 'days', delta: '2 days', trend: 'down' }, { value: 88, valueUnit: '%', delta: '1% acceptance', trend: 'up' }, KPI_0601[3]],
    openRequisitions: reqs([
      ['r1', 'Senior Frontend Engineer', 552, 'Assessment', 'waiting-on-recruiter', 22, 'medium'],
      ['r2', 'Product Designer', 942, 'Screening', 'candidates-aging', 28, 'medium'],
      ['r3', 'Marketing Manager', 967, 'Screening', 'candidates-aging', 21, 'medium'],
      ['r4', 'Backend Engineer', 492, 'Assessment', 'waiting-on-recruiter', 25, 'medium'],
      ['r5', 'Data Analyst', 875, 'Screening', 'waiting-on-me', 20, 'low'],
    ], 0),
    candidates: [],
    schedule: [],
    bottlenecks: bottlenecks(6, 7, 13, 7.6, 5.1, 19.2),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_DAY['2026-06-05']),
  }),

  '2026-06-08': day('2026-06-08', {
    kpis: KPI_0608,
    openRequisitions: reqs([
      ['r1', 'Senior Frontend Engineer', 97, 'Interview', 'waiting-on-me', 25, 'medium'],
      ['r2', 'Product Designer', 541, 'Assessment', 'waiting-on-recruiter', 31, 'medium'],
      ['r3', 'Marketing Manager', 967, 'Screening', 'candidates-aging', 24, 'medium'],
      ['r4', 'Backend Engineer', 84, 'Interview', 'waiting-on-recruiter', 28, 'medium'],
      ['r5', 'Data Analyst', 506, 'Assessment', 'waiting-on-me', 23, 'low'],
    ], 0),
    candidates: [CANDIDATES.nina, CANDIDATES.daniel],
    schedule: [
      { id: 'i-0608-1', timeLabel: '9:30 AM', group: 'today', candidateId: 'c-nina-walker' },
      { id: 'i-0608-2', timeLabel: '12:00 PM', group: 'today', candidateId: 'c-daniel-kim' },
    ],
    bottlenecks: bottlenecks(6, 7, 13, 7.4, 4.9, 18.8),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_DAY['2026-06-08']),
  }),

  '2026-06-09': day('2026-06-09', {
    kpis: [KPI_0608[0], { value: 38, valueUnit: 'days', delta: '3 days', trend: 'down' }, KPI_0608[2], KPI_0608[3]],
    openRequisitions: reqs([
      ['r1', 'Senior Frontend Engineer', 86, 'Interview', 'waiting-on-me', 26, 'medium'],
      ['r2', 'Product Designer', 525, 'Assessment', 'waiting-on-recruiter', 32, 'medium'],
      ['r3', 'Marketing Manager', 904, 'Screening', 'candidates-aging', 25, 'medium'],
      ['r4', 'Backend Engineer', 76, 'Interview', 'waiting-on-recruiter', 29, 'medium'],
      ['r5', 'Data Analyst', 492, 'Assessment', 'waiting-on-me', 24, 'low'],
    ], 0),
    candidates: [],
    schedule: [],
    bottlenecks: bottlenecks(6, 7, 12, 7.1, 4.7, 18.2),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_DAY['2026-06-09']),
  }),

  '2026-06-10': day('2026-06-10', {
    kpis: [KPI_0608[0], { value: 37, valueUnit: 'days', delta: '4 days', trend: 'down' }, KPI_0608[2], KPI_0608[3]],
    openRequisitions: reqs([
      ['r1', 'Senior Frontend Engineer', 71, 'Interview', 'waiting-on-me', 27, 'medium'],
      ['r2', 'Product Designer', 498, 'Assessment', 'waiting-on-recruiter', 33, 'medium'],
      ['r3', 'Marketing Manager', 842, 'Screening', 'candidates-aging', 26, 'medium'],
      ['r4', 'Backend Engineer', 62, 'Interview', 'waiting-on-recruiter', 30, 'medium'],
      ['r5', 'Data Analyst', 470, 'Assessment', 'waiting-on-me', 25, 'low'],
    ], 0),
    candidates: [CANDIDATES.aisha, CANDIDATES.marcus],
    schedule: [
      { id: 'i-0610-1', timeLabel: '10:00 AM', group: 'today', candidateId: 'c-aisha-robinson' },
      { id: 'i-0610-2', timeLabel: '2:30 PM', group: 'today', candidateId: 'c-marcus-green' },
    ],
    bottlenecks: bottlenecks(5, 7, 11, 6.8, 4.5, 17.8),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_DAY['2026-06-10']),
  }),

  '2026-06-11': day('2026-06-11', {
    kpis: [{ value: 7, delta: '3 this month', trend: 'up' }, { value: 36, valueUnit: 'days', delta: '5 days', trend: 'down' }, KPI_0608[2], KPI_0608[3]],
    openRequisitions: reqs([
      ['r1', 'Senior Frontend Engineer', 24, 'Final Round', 'waiting-on-me', 28, 'low'],
      ['r2', 'Product Designer', 126, 'Interview', 'waiting-on-recruiter', 34, 'medium'],
      ['r3', 'Marketing Manager', 642, 'Assessment', 'candidates-aging', 27, 'medium'],
      ['r4', 'Backend Engineer', 20, 'Final Round', 'waiting-on-me', 31, 'medium'],
      ['r5', 'Data Analyst', 575, 'Assessment', 'candidates-aging', 26, 'medium'],
    ], 2),
    candidates: [],
    schedule: [],
    bottlenecks: bottlenecks(5, 6, 10, 6.6, 4.3, 17.5),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_DAY['2026-06-11']),
  }),

  '2026-06-12': day('2026-06-12', {
    kpis: [{ value: 8, delta: '4 this month', trend: 'up' }, { value: 35, valueUnit: 'days', delta: '6 days', trend: 'down' }, { value: 89, valueUnit: '%', delta: '2% acceptance', trend: 'up' }, KPI_0608[3]],
    openRequisitions: reqs([
      ['r1', 'Senior Frontend Engineer', 18, 'Final Round', 'waiting-on-me', 29, 'low'],
      ['r2', 'Product Designer', 92, 'Interview', 'waiting-on-recruiter', 35, 'medium'],
      ['r3', 'Marketing Manager', 604, 'Assessment', 'candidates-aging', 28, 'medium'],
      ['r4', 'Backend Engineer', 16, 'Final Round', 'waiting-on-me', 32, 'medium'],
      ['r5', 'Data Analyst', 545, 'Assessment', 'candidates-aging', 27, 'medium'],
    ], 3),
    candidates: [CANDIDATES.sarah, CANDIDATES.mike],
    schedule: [
      { id: 'i-0612-1', timeLabel: '9:00 AM', group: 'today', candidateId: 'c-sarah-chen' },
      { id: 'i-0612-2', timeLabel: '1:30 PM', group: 'today', candidateId: 'c-mike-davis' },
    ],
    bottlenecks: bottlenecks(4, 6, 9, 6.2, 4.1, 17.3),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_DAY['2026-06-12']),
  }),

  '2026-06-15': day('2026-06-15', {
    kpis: KPI_0615,
    openRequisitions: reqs([
      ['r1', 'Senior Frontend Engineer', 18, 'Final Round', 'waiting-on-me', 30, 'low'],
      ['r2', 'Product Designer', 92, 'Interview', 'waiting-on-recruiter', 36, 'medium'],
      ['r3', 'Marketing Manager', 612, 'Assessment', 'candidates-aging', 31, 'medium'],
      ['r4', 'Backend Engineer', 16, 'Final Round', 'waiting-on-me', 33, 'medium'],
      ['r5', 'Data Analyst', 552, 'Assessment', 'candidates-aging', 30, 'medium'],
    ], 3),
    candidates: [CANDIDATES.priya, CANDIDATES.grace],
    schedule: PTO_SCHEDULE,
    bottlenecks: bottlenecks(4, 6, 9, 6.2, 4.1, 17.3),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_DAY['2026-06-15']),
  }),

  '2026-06-16': day('2026-06-16', {
    kpis: KPI_0615,
    openRequisitions: reqs([
      ['r1', 'Senior Frontend Engineer', 18, 'Final Round', 'waiting-on-me', 31, 'low'],
      ['r2', 'Product Designer', 92, 'Interview', 'waiting-on-recruiter', 37, 'medium'],
      ['r3', 'Marketing Manager', 624, 'Assessment', 'candidates-aging', 32, 'medium'],
      ['r4', 'Backend Engineer', 16, 'Final Round', 'waiting-on-me', 34, 'medium'],
      ['r5', 'Data Analyst', 560, 'Assessment', 'candidates-aging', 31, 'medium'],
    ], 3),
    candidates: [],
    schedule: PTO_SCHEDULE,
    bottlenecks: bottlenecks(5, 6, 10, 6.5, 4.2, 17.8),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_DAY['2026-06-16']),
  }),

  '2026-06-17': day('2026-06-17', {
    kpis: KPI_0615,
    openRequisitions: reqs([
      ['r1', 'Senior Frontend Engineer', 18, 'Final Round', 'waiting-on-me', 32, 'low'],
      ['r2', 'Product Designer', 92, 'Interview', 'waiting-on-recruiter', 38, 'medium'],
      ['r3', 'Marketing Manager', 638, 'Assessment', 'candidates-aging', 33, 'medium'],
      ['r4', 'Backend Engineer', 16, 'Final Round', 'waiting-on-me', 35, 'medium'],
      ['r5', 'Data Analyst', 568, 'Assessment', 'candidates-aging', 32, 'medium'],
    ], 3),
    candidates: [],
    schedule: PTO_SCHEDULE,
    bottlenecks: bottlenecks(5, 7, 11, 6.8, 4.4, 18.3),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_DAY['2026-06-17']),
  }),

  '2026-06-18': day('2026-06-18', {
    kpis: KPI_0615,
    openRequisitions: reqs([
      ['r1', 'Senior Frontend Engineer', 18, 'Final Round', 'waiting-on-me', 33, 'low'],
      ['r2', 'Product Designer', 92, 'Interview', 'waiting-on-recruiter', 39, 'medium'],
      ['r3', 'Marketing Manager', 650, 'Assessment', 'candidates-aging', 34, 'medium'],
      ['r4', 'Backend Engineer', 16, 'Final Round', 'waiting-on-me', 36, 'medium'],
      ['r5', 'Data Analyst', 576, 'Assessment', 'candidates-aging', 33, 'medium'],
    ], 3),
    candidates: [],
    schedule: PTO_SCHEDULE,
    bottlenecks: bottlenecks(6, 7, 12, 7.1, 4.6, 18.9),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_DAY['2026-06-18']),
  }),

  '2026-06-19': day('2026-06-19', {
    kpis: KPI_0615,
    openRequisitions: reqs([
      ['r1', 'Senior Frontend Engineer', 18, 'Final Round', 'waiting-on-me', 34, 'low'],
      ['r2', 'Product Designer', 92, 'Interview', 'waiting-on-recruiter', 40, 'medium'],
      ['r3', 'Marketing Manager', 662, 'Assessment', 'candidates-aging', 35, 'medium'],
      ['r4', 'Backend Engineer', 16, 'Final Round', 'waiting-on-me', 37, 'medium'],
      ['r5', 'Data Analyst', 584, 'Assessment', 'candidates-aging', 34, 'medium'],
    ], 3),
    candidates: [],
    schedule: PTO_SCHEDULE,
    bottlenecks: bottlenecks(7, 8, 13, 7.4, 4.9, 19.4),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_DAY['2026-06-19']),
  }),
};
