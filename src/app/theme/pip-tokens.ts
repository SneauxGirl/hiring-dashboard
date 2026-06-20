/**
 * Pip design tokens — single source of truth.
 * Lara surfaces/text/primary are overridden in pip-preset.ts.
 */

/** Fill + solid + ink triples keyed by color name. Charts use solid; pills/labels use fill + ink. */
export const PIP_PALETTE = {
  teal: { fill: '#e7f2f1', solid: '#008782', ink: '#008782' },
  purple: { fill: '#f0ebf6', solid: '#6b229c', ink: '#6b229c' },
  orange: { fill: '#FFF1EB', solid: '#F85330', ink: '#C94327' },
  gold: { fill: '#f9f2e2', solid: '#e5b82e', ink: '#cb911a' },
  pink: { fill: '#FFF0F6', solid: '#D0356D', ink: '#7A1D42' },
  red: { fill: '#fce8ec', solid: '#DC143C', ink: '#9B1B30' },
  charcoal: { fill: '#F1F0F2', solid: '#B0ACB4', ink: '#251827' },
  blue: { fill: '#ECEBF8', solid: '#413E96', ink: '#252356' },
  green: { fill: '#EAF8EB', solid: '#4CC851', ink: '#3C8735' },
} as const;

export type PipColor = keyof typeof PIP_PALETTE;

/**
 * Who owns the delay — shared by requisition stage pills and bottleneck cards.
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
  /**
   * Text tiers — keys match PrimeNG `text.*` slots and tailwindcss-primeui utilities.
   * Lara default: surface.700 / .800 / .500 / .600 (slate steps, not % black).
   * Pip uses slate (blue-tinted gray), not neutral gray — lighter steps read cooler.
   */
  text: {
    color: '#1C1C1E', // slate-700 → text-color
    hoverColor: '#242227', // slate-800 → text-color-emphasis
    mutedColor: '#6f6c7c', // slate-500 → text-muted-color
    hoverMutedColor: '#2B292E', // slate-600 → text-muted-color-emphasis (KPI numbers)
  },
  shadow: {
    card: '0 1px 3px color-mix(in srgb,rgb(42, 56, 78) 55%, transparent)',
    popover: '0 1px 4px color-mix(in srgb, #334155 8%, transparent)',
    select: '0 2px 10px color-mix(in srgb, #334155 9%, transparent)',
    modal: '0 2px 6px color-mix(in srgb, #334155 22%, transparent)',
    navigation: '0 2px 10px color-mix(in srgb, #334155 9%, transparent)',
  },
  primary: PIP_PALETTE.purple.solid,
  nav: 'purple' satisfies PipColor,
  responsibility: {
    'waiting-on-me': 'teal',
    'waiting-on-recruiter': 'purple',
    'candidates-aging': 'orange',
  } satisfies Record<PipResponsibility, PipColor>,
  risk: {
    low: 'teal',
    medium: 'gold',
    high: 'red',
  } satisfies Record<'low' | 'medium' | 'high', PipColor>,
  schedule: {
    today: 'teal',
    tomorrow: 'purple',
    'this-week': 'purple',
  } satisfies Record<'today' | 'tomorrow' | 'this-week', PipColor>,
  trends: {
    attrition: 'pink',
    promotions: 'gold',
    transfers: 'teal',
    backfills: 'blue',
  } satisfies Record<'attrition' | 'promotions' | 'transfers' | 'backfills', PipColor>,
  /** Stage index → palette color (h1 applicants → h6 hired). Aligns with responsibility hues from h3 onward. */
  funnel: {
    bar: ['blue', 'purple', 'orange', 'teal', 'pink', 'charcoal'],
    duration: ['blue', 'purple', 'orange', 'teal', 'pink', 'charcoal'],
  } satisfies { bar: readonly PipColor[]; duration: readonly PipColor[] },
} as const;

export type PipRiskLevel = 'low' | 'medium' | 'high';

export type PipTrendMetricId = keyof typeof PIP_TOKENS.trends;

/** @deprecated Use PipResponsibility */
export type PipBottleneckTheme = PipResponsibility;
