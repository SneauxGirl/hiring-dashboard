/**
 * Pip design tokens — single source of truth for colors.
 * Surfaces/text feed pip-preset.ts (Lara); chart/semantic colors are read directly in theme-colors.ts.
 */
const AMBER = {
  bg: '#fdf0e6',
  text: '#cb6e1d',
  light: '#f3d5b8',
  mid: '#e5a96a',
} as const;

const BLUE = {
  bg: '#e6f6fc',
  text: '#0091d8',
  light: '#b3e3f5',
  mid: '#66c9eb',
} as const;

const RED = {
  bg: '#fceae8',
  text: '#9f291b',
} as const;

export const PIP_TOKENS = {
  surface: {
    page: '#faf8f6',
    card: '#ffffff',
    border: '#cecece',
    /** Subtle fill on hover for nav rows, menu items, etc. — maps to Lara surface.100. */
    hover: '#eef1f8',
  },
  text: {
    color: '#1f2937',
    soft: '#667085',
    muted: '#98a2b3',
  },
  brand: {
    amber: AMBER.text,
    purple: '#8b35c9',
    violet: '#6a2ccf',
    indigo: '#2d2dbd',
    aqua: BLUE.text,
  },
  primary: '#4f46e5',
  amber: AMBER,
  blue: BLUE,
  red: RED,
  chart: {
    amber: AMBER.text,
    purple: '#7c3aed',
    blue: BLUE.text,
    teal: BLUE.text,
    orange: '#f97316',
    green: '#16a34a',
    indigo: '#4f46e5',
  },
  risk: {
    low: { bg: '#dcfce7', text: '#15803d' },
    medium: AMBER,
    high: RED,
  },
  stage: {
    screening: AMBER,
    interview: { bg: '#ede9fe', text: '#6a2ccf' },
    finalRound: BLUE,
  },
  bottleneck: {
    waitingOnMe: AMBER.text,
    waitingOnRecruiter: '#16a34a',
    candidatesAging: '#f97316',
  },
  trend: {
    up: '#16a34a',
    down: AMBER.text,
    even: '#8b35c9',
  },
} as const;

export type PipChartColor = keyof typeof PIP_TOKENS.chart;

export type PipBottleneckTheme =
  | 'waiting-on-me'
  | 'waiting-on-recruiter'
  | 'candidates-aging';

export type PipStageTone = 'screening' | 'interview' | 'final-round';

export type PipRiskLevel = 'low' | 'medium' | 'high';

export type PipFunnelZone = 'early' | 'late';
