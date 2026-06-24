import { BottleneckWeekMetrics, DashboardDayData } from '../models/dashboard.models';

export type DashboardCalendarDay =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export const DASHBOARD_CALENDAR_DAY_COUNT = 14;

type StoryWeek = 1 | 2;

const STAGE_DURATION_DAYS_BY_STORY_WEEK: Record<StoryWeek, readonly number[]> = {
  1: [10, 9, 18, 14, 62, 3],
  2: [9, 8, 17, 12, 58, 2],
};

function calendarWeekForDay(calendarDay: DashboardCalendarDay): StoryWeek {
  return calendarDay <= 7 ? 1 : 2;
}

function calendarDay(
  calendarDayKey: DashboardCalendarDay,
  data: Omit<DashboardDayData, 'stageDurationDays'>,
): DashboardDayData {
  return {
    ...data,
    stageDurationDays: [...STAGE_DURATION_DAYS_BY_STORY_WEEK[calendarWeekForDay(calendarDayKey)]],
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
const THIRTY_DAY_FUNNEL_BY_CALENDAR_DAY: Record<
  DashboardCalendarDay,
  readonly [number, number, number, number, number, number]
> = {
  1: [2875, 2638, 1582, 214, 15, 13],
  2: [2875, 2638, 1582, 214, 15, 13],
  3: [2928, 2687, 1606, 219, 15, 13],
  4: [2984, 2735, 1634, 224, 16, 14],
  5: [3042, 2791, 1668, 231, 16, 14],
  6: [3098, 2844, 1702, 238, 17, 15],
  7: [3098, 2844, 1702, 238, 17, 15],
  8: [3210, 2947, 1766, 246, 17, 15],
  9: [3210, 2947, 1766, 246, 17, 15],
  10: [3276, 3012, 1810, 254, 18, 16],
  11: [3345, 3078, 1856, 263, 19, 16],
  12: [3416, 3142, 1898, 272, 20, 17],
  13: [3488, 3205, 1936, 281, 21, 18],
  14: [3488, 3205, 1936, 281, 21, 18],
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

function bottlenecks(
  waitingOnMe: number,
  waitingOnRecruiter: number,
  aging: number,
  meAvg: number,
  recruiterAvg: number,
  agingAvg: number,
): BottleneckWeekMetrics[] {
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

const KPI_WEEK1 = [
  { value: 4, delta: '0 this month', trend: 'neutral' },
  { value: 41, valueUnit: 'days', delta: '2 days', trend: 'up' },
  { value: 87, valueUnit: '%', delta: 'No change', trend: 'neutral' },
  { value: 6, delta: '2 versus previous month', trend: 'up' },
] as const;

const KPI_WEEK2 = [
  { value: 5, delta: '1 this month', trend: 'up' },
  { value: 39, valueUnit: 'days', delta: '2 days', trend: 'down' },
  { value: 88, valueUnit: '%', delta: '1% acceptance', trend: 'up' },
  { value: 6, delta: 'no change', trend: 'neutral' },
] as const;


export const MOCK_DASHBOARD_BY_CALENDAR_DAY: Record<DashboardCalendarDay, DashboardDayData> = {
  1: calendarDay(1, {
    kpis: [...KPI_WEEK1],
    openRequisitions: reqs(
      [
        ['r1', 'Senior Frontend Engineer', 612, 'Assessment', 'waiting-on-recruiter', 18, 'medium'],
        ['r2', 'Product Designer', 894, 'Screening', 'candidates-aging', 24, 'medium'],
        ['r4', 'Backend Engineer', 548, 'Assessment', 'waiting-on-recruiter', 21, 'medium'],
        ['r5', 'Data Analyst', 821, 'Screening', 'waiting-on-me', 16, 'low'],
      ],
      0,
    ),
    candidates: [],
    schedule: [],
    bottlenecks: bottlenecks(7, 8, 15, 8.1, 5.6, 20.4),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_CALENDAR_DAY[1]),
  }),

  2: calendarDay(2, {
    kpis: [...KPI_WEEK1],
    openRequisitions: reqs(
      [
        ['r1', 'Senior Frontend Engineer', 612, 'Assessment', 'waiting-on-recruiter', 18, 'medium'],
        ['r2', 'Product Designer', 894, 'Screening', 'candidates-aging', 24, 'medium'],
        ['r4', 'Backend Engineer', 548, 'Assessment', 'waiting-on-recruiter', 21, 'medium'],
        ['r5', 'Data Analyst', 821, 'Screening', 'waiting-on-me', 16, 'low'],
      ],
      0,
    ),
    candidates: [],
    schedule: [],
    bottlenecks: bottlenecks(7, 8, 15, 8.1, 5.6, 20.4),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_CALENDAR_DAY[2]),
  }),

  3: calendarDay(3, {
    kpis: [...KPI_WEEK1],
    openRequisitions: reqs(
      [
        ['r1', 'Senior Frontend Engineer', 608, 'Assessment', 'waiting-on-recruiter', 19, 'medium'],
        ['r2', 'Product Designer', 906, 'Screening', 'candidates-aging', 25, 'medium'],
        ['r4', 'Backend Engineer', 544, 'Assessment', 'waiting-on-recruiter', 22, 'medium'],
        ['r5', 'Data Analyst', 836, 'Screening', 'waiting-on-me', 17, 'low'],
      ],
      0,
    ),
    candidates: [CANDIDATES.lena],
    schedule: [{ id: 'i-d02-1', timeLabel: '10:30 AM', group: 'today', candidateId: 'c-lena-morris' }],
    bottlenecks: bottlenecks(7, 8, 15, 8, 5.5, 20.2),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_CALENDAR_DAY[3]),
  }),

  4: calendarDay(4, {
    kpis: [
      KPI_WEEK1[0],
      { value: 40, valueUnit: 'days', delta: '1 day', trend: 'down' },
      { value: 88, valueUnit: '%', delta: '1% acceptance', trend: 'up' },
      KPI_WEEK1[3],
    ],
    openRequisitions: reqs(
      [
        ['r1', 'Senior Frontend Engineer', 590, 'Assessment', 'waiting-on-recruiter', 20, 'medium'],
        ['r2', 'Product Designer', 918, 'Screening', 'candidates-aging', 26, 'medium'],
        ['r4', 'Backend Engineer', 526, 'Assessment', 'waiting-on-recruiter', 23, 'medium'],
        ['r5', 'Data Analyst', 849, 'Screening', 'waiting-on-me', 18, 'low'],
      ],
      0,
    ),
    candidates: [],
    schedule: [],
    bottlenecks: bottlenecks(7, 8, 14, 7.9, 5.4, 19.8),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_CALENDAR_DAY[4]),
  }),

  5: calendarDay(5, {
    kpis: [
      { value: 5, delta: '1 this month', trend: 'up' },
      { value: 40, valueUnit: 'days', delta: '1 day', trend: 'down' },
      { value: 88, valueUnit: '%', delta: '1% acceptance', trend: 'up' },
      KPI_WEEK1[3],
    ],
    openRequisitions: reqs(
      [
        ['r1', 'Senior Frontend Engineer', 575, 'Assessment', 'waiting-on-recruiter', 21, 'medium'],
        ['r2', 'Product Designer', 930, 'Screening', 'candidates-aging', 27, 'medium'],
        ['r3', 'Marketing Manager', 925, 'Screening', 'candidates-aging', 20, 'medium'],
        ['r4', 'Backend Engineer', 510, 'Assessment', 'waiting-on-recruiter', 24, 'medium'],
        ['r5', 'Data Analyst', 862, 'Screening', 'waiting-on-me', 19, 'low'],
      ],
      0,
    ),
    candidates: [CANDIDATES.omar],
    schedule: [{ id: 'i-d04-1', timeLabel: '1:00 PM', group: 'today', candidateId: 'c-omar-saleh' }],
    bottlenecks: bottlenecks(7, 8, 14, 7.8, 5.3, 19.6),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_CALENDAR_DAY[5]),
  }),

  6: calendarDay(6, {
    kpis: [
      { value: 5, delta: '1 this month', trend: 'up' },
      { value: 39, valueUnit: 'days', delta: '2 days', trend: 'down' },
      { value: 88, valueUnit: '%', delta: '1% acceptance', trend: 'up' },
      KPI_WEEK1[3],
    ],
    openRequisitions: reqs(
      [
        ['r1', 'Senior Frontend Engineer', 552, 'Assessment', 'waiting-on-recruiter', 22, 'medium'],
        ['r2', 'Product Designer', 942, 'Screening', 'candidates-aging', 28, 'medium'],
        ['r3', 'Marketing Manager', 967, 'Screening', 'candidates-aging', 21, 'medium'],
        ['r4', 'Backend Engineer', 492, 'Assessment', 'waiting-on-recruiter', 25, 'medium'],
        ['r5', 'Data Analyst', 875, 'Screening', 'waiting-on-me', 20, 'low'],
      ],
      0,
    ),
    candidates: [],
    schedule: [],
    bottlenecks: bottlenecks(6, 7, 13, 7.6, 5.1, 19.2),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_CALENDAR_DAY[6]),
  }),

  7: calendarDay(7, {
    kpis: [
      { value: 5, delta: '1 this month', trend: 'up' },
      { value: 39, valueUnit: 'days', delta: '2 days', trend: 'down' },
      { value: 88, valueUnit: '%', delta: '1% acceptance', trend: 'up' },
      KPI_WEEK1[3],
    ],
    openRequisitions: reqs(
      [
        ['r1', 'Senior Frontend Engineer', 552, 'Assessment', 'waiting-on-recruiter', 22, 'medium'],
        ['r2', 'Product Designer', 942, 'Screening', 'candidates-aging', 28, 'medium'],
        ['r3', 'Marketing Manager', 967, 'Screening', 'candidates-aging', 21, 'medium'],
        ['r4', 'Backend Engineer', 492, 'Assessment', 'waiting-on-recruiter', 25, 'medium'],
        ['r5', 'Data Analyst', 875, 'Screening', 'waiting-on-me', 20, 'low'],
      ],
      0,
    ),
    candidates: [],
    schedule: [],
    bottlenecks: bottlenecks(6, 7, 13, 7.6, 5.1, 19.2),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_CALENDAR_DAY[7]),
  }),

  8: calendarDay(8, {
    kpis: [...KPI_WEEK2],
    openRequisitions: reqs(
      [
        ['r1', 'Senior Frontend Engineer', 97, 'Interview', 'waiting-on-me', 25, 'medium'],
        ['r2', 'Product Designer', 541, 'Assessment', 'waiting-on-recruiter', 31, 'medium'],
        ['r3', 'Marketing Manager', 967, 'Screening', 'candidates-aging', 24, 'medium'],
        ['r4', 'Backend Engineer', 84, 'Interview', 'waiting-on-recruiter', 28, 'medium'],
        ['r5', 'Data Analyst', 506, 'Assessment', 'waiting-on-me', 23, 'low'],
      ],
      0,
    ),
    candidates: [],
    schedule: [],
    bottlenecks: bottlenecks(6, 7, 13, 7.4, 4.9, 18.8),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_CALENDAR_DAY[8]),
  }),

  9: calendarDay(9, {
    kpis: [...KPI_WEEK2],
    openRequisitions: reqs(
      [
        ['r1', 'Senior Frontend Engineer', 97, 'Interview', 'waiting-on-me', 25, 'medium'],
        ['r2', 'Product Designer', 541, 'Assessment', 'waiting-on-recruiter', 31, 'medium'],
        ['r3', 'Marketing Manager', 967, 'Screening', 'candidates-aging', 24, 'medium'],
        ['r4', 'Backend Engineer', 84, 'Interview', 'waiting-on-recruiter', 28, 'medium'],
        ['r5', 'Data Analyst', 506, 'Assessment', 'waiting-on-me', 23, 'low'],
      ],
      0,
    ),
    candidates: [CANDIDATES.nina, CANDIDATES.daniel],
    schedule: [
      { id: 'i-d06-1', timeLabel: '9:30 AM', group: 'today', candidateId: 'c-nina-walker' },
      { id: 'i-d06-2', timeLabel: '12:00 PM', group: 'today', candidateId: 'c-daniel-kim' },
    ],
    bottlenecks: bottlenecks(6, 7, 13, 7.4, 4.9, 18.8),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_CALENDAR_DAY[9]),
  }),

  10: calendarDay(10, {
    kpis: [
      KPI_WEEK2[0],
      { value: 38, valueUnit: 'days', delta: '3 days', trend: 'down' },
      KPI_WEEK2[2],
      KPI_WEEK2[3],
    ],
    openRequisitions: reqs(
      [
        ['r1', 'Senior Frontend Engineer', 86, 'Interview', 'waiting-on-me', 26, 'medium'],
        ['r2', 'Product Designer', 525, 'Assessment', 'waiting-on-recruiter', 32, 'medium'],
        ['r3', 'Marketing Manager', 904, 'Screening', 'candidates-aging', 25, 'medium'],
        ['r4', 'Backend Engineer', 76, 'Interview', 'waiting-on-recruiter', 29, 'medium'],
        ['r5', 'Data Analyst', 492, 'Assessment', 'waiting-on-me', 24, 'low'],
      ],
      0,
    ),
    candidates: [],
    schedule: [],
    bottlenecks: bottlenecks(6, 7, 12, 7.1, 4.7, 18.2),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_CALENDAR_DAY[10]),
  }),

  11: calendarDay(11, {
    kpis: [
      KPI_WEEK2[0],
      { value: 37, valueUnit: 'days', delta: '4 days', trend: 'down' },
      KPI_WEEK2[2],
      KPI_WEEK2[3],
    ],
    openRequisitions: reqs(
      [
        ['r1', 'Senior Frontend Engineer', 71, 'Interview', 'waiting-on-me', 27, 'medium'],
        ['r2', 'Product Designer', 498, 'Assessment', 'waiting-on-recruiter', 33, 'medium'],
        ['r3', 'Marketing Manager', 842, 'Screening', 'candidates-aging', 26, 'medium'],
        ['r4', 'Backend Engineer', 62, 'Interview', 'waiting-on-recruiter', 30, 'medium'],
        ['r5', 'Data Analyst', 470, 'Assessment', 'waiting-on-me', 25, 'low'],
      ],
      0,
    ),
    candidates: [CANDIDATES.aisha, CANDIDATES.marcus],
    schedule: [
      { id: 'i-d08-1', timeLabel: '10:00 AM', group: 'today', candidateId: 'c-aisha-robinson' },
      { id: 'i-d08-2', timeLabel: '2:30 PM', group: 'today', candidateId: 'c-marcus-green' },
    ],
    bottlenecks: bottlenecks(5, 7, 11, 6.8, 4.5, 17.8),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_CALENDAR_DAY[11]),
  }),

  12: calendarDay(12, {
    kpis: [
      { value: 7, delta: '3 this month', trend: 'up' },
      { value: 36, valueUnit: 'days', delta: '5 days', trend: 'down' },
      KPI_WEEK2[2],
      KPI_WEEK2[3],
    ],
    openRequisitions: reqs(
      [
        ['r1', 'Senior Frontend Engineer', 24, 'Final Round', 'waiting-on-me', 28, 'low'],
        ['r2', 'Product Designer', 126, 'Interview', 'waiting-on-recruiter', 34, 'medium'],
        ['r3', 'Marketing Manager', 642, 'Assessment', 'candidates-aging', 27, 'medium'],
        ['r4', 'Backend Engineer', 20, 'Final Round', 'waiting-on-me', 31, 'medium'],
        ['r5', 'Data Analyst', 575, 'Assessment', 'candidates-aging', 26, 'medium'],
      ],
      2,
    ),
    candidates: [],
    schedule: [],
    bottlenecks: bottlenecks(5, 6, 10, 6.6, 4.3, 17.5),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_CALENDAR_DAY[12]),
  }),

  13: calendarDay(13, {
    kpis: [
      { value: 8, delta: '4 this month', trend: 'up' },
      { value: 35, valueUnit: 'days', delta: '6 days', trend: 'down' },
      { value: 89, valueUnit: '%', delta: '2% acceptance', trend: 'up' },
      KPI_WEEK2[3],
    ],
    openRequisitions: reqs(
      [
        ['r1', 'Senior Frontend Engineer', 18, 'Final Round', 'waiting-on-me', 29, 'low'],
        ['r2', 'Product Designer', 92, 'Interview', 'waiting-on-recruiter', 35, 'medium'],
        ['r3', 'Marketing Manager', 604, 'Assessment', 'candidates-aging', 28, 'medium'],
        ['r4', 'Backend Engineer', 16, 'Final Round', 'waiting-on-me', 32, 'medium'],
        ['r5', 'Data Analyst', 545, 'Assessment', 'candidates-aging', 27, 'medium'],
      ],
      3,
    ),
    candidates: [CANDIDATES.sarah, CANDIDATES.mike],
    schedule: [
      { id: 'i-d10-1', timeLabel: '9:00 AM', group: 'today', candidateId: 'c-sarah-chen' },
      { id: 'i-d10-2', timeLabel: '1:30 PM', group: 'today', candidateId: 'c-mike-davis' },
    ],
    bottlenecks: bottlenecks(4, 6, 9, 6.2, 4.1, 17.3),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_CALENDAR_DAY[13]),
  }),

  14: calendarDay(14, {
    kpis: [
      { value: 8, delta: '4 this month', trend: 'up' },
      { value: 35, valueUnit: 'days', delta: '6 days', trend: 'down' },
      { value: 89, valueUnit: '%', delta: '2% acceptance', trend: 'up' },
      KPI_WEEK2[3],
    ],
    openRequisitions: reqs(
      [
        ['r1', 'Senior Frontend Engineer', 18, 'Final Round', 'waiting-on-me', 29, 'low'],
        ['r2', 'Product Designer', 92, 'Interview', 'waiting-on-recruiter', 35, 'medium'],
        ['r3', 'Marketing Manager', 604, 'Assessment', 'candidates-aging', 28, 'medium'],
        ['r4', 'Backend Engineer', 16, 'Final Round', 'waiting-on-me', 32, 'medium'],
        ['r5', 'Data Analyst', 545, 'Assessment', 'candidates-aging', 27, 'medium'],
      ],
      3,
    ),
    candidates: [],
    schedule: [],
    bottlenecks: bottlenecks(4, 6, 9, 6.2, 4.1, 17.3),
    funnelStages: funnelStages(THIRTY_DAY_FUNNEL_BY_CALENDAR_DAY[14]),
  }),
};

export function dashboardForCalendarDay(calendarDayKey: DashboardCalendarDay): DashboardDayData {
  return MOCK_DASHBOARD_BY_CALENDAR_DAY[calendarDayKey];
}