/**
 * Pip design tokens — single source of truth.
 * Lara surfaces/text/primary are overridden in pip-preset.ts.
 */
export type PipSlot = 0 | 1 | 2 | 3 | 4 | 5;

/** Mockup pastel cycle: teal → purple → orange → gold → pink → charcoal. */
const SLOTS = [
  { fill: '#e7f2f1', ink: '#008782' },
  { fill: '#f0ebf6', ink: '#6b229c' },
  { fill: '#f6f4e6', ink: '#cf4a10' },
  { fill: '#f9f2e2', ink: '#cb911a' },
  { fill: '#FFF2F7', ink: '#E00048' },
  { fill: '#e5e7eb', ink: '#4b5563' },
] as const;

const GREEN = { fill: '#d8edda', ink: '#5a9e6f' } as const;

/**
 * Who owns the delay — shared by requisition stage pills and bottleneck cards.
 * Final Round → waiting on me · Interview → recruiter · Screening → aging pipeline.
 */
export type PipResponsibility =
  | 'waiting-on-me'
  | 'waiting-on-recruiter'
  | 'candidates-aging';

export const PIP_TOKENS = {
  surface: {
    page: '#FeFdFc',
    card: '#ffffff',
    border: '#e8e8e7',
    hover: '#eef1f5',
  },
  text: {
    color: '#374151',
    soft: '#4b5563',
    muted: '#6b7280',
  },
  /** Lara shadow overrides — ink-tinted, slightly softer than default black rgba. */
  shadow: {
    card: '0 1px 3px color-mix(in srgb,rgb(42, 56, 78) 55%, transparent)',
    popover: '0 1px 4px color-mix(in srgb, #374151 8%, transparent)',
    select: '0 2px 10px color-mix(in srgb, #374151 9%, transparent)',
    modal: '0 2px 6px color-mix(in srgb, #374151 22%, transparent)',
    navigation: '0 2px 10px color-mix(in srgb, #374151 9%, transparent)',
  },
  primary: SLOTS[0].ink,
  slots: SLOTS,
  responsibility: {
    'waiting-on-me': 0,
    'waiting-on-recruiter': 1,
    'candidates-aging': 2,
  },
  risk: {
    low: SLOTS[0],
    medium: SLOTS[2],
    high: SLOTS[4],
  },
  schedule: {
    today: GREEN.ink,
    tomorrow: SLOTS[1].ink,
    'this-week': SLOTS[2].ink,
  },
  /** Workforce movement chart — not on reference mockup; fixed palette per metric. */
  trends: {
    attrition: SLOTS[4],
    promotions: SLOTS[1],
    transfers: SLOTS[2],
    backfills: SLOTS[0],
  },
  chart: {
    blue: SLOTS[0].ink,
    purple: SLOTS[1].ink,
    orange: SLOTS[2].ink,
    amber: SLOTS[3].ink,
    teal: SLOTS[0].ink,
    indigo: SLOTS[1].ink,
    green: GREEN.ink,
    pink: SLOTS[4].ink,
  },
} as const;

export type PipChartColor = keyof typeof PIP_TOKENS.chart;

export type PipPatternSlot = PipSlot;

/** @deprecated Use PipResponsibility */
export type PipBottleneckTheme = PipResponsibility;

export type PipRiskLevel = 'low' | 'medium' | 'high';

export type PipTrendMetricId = keyof typeof PIP_TOKENS.trends;
