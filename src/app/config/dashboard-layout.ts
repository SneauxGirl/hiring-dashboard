import { CardPassThrough } from 'primeng/types/card';

/**
 * Dashboard grid tiers follow @container/dashboard (main content width), not viewport.
 * Sidebar open/closed changes main width and triggers reflow automatically.
 *
 * Pair (43.25rem / 692px): BN + Trends side by side (tier 3).
 * Wide (68rem / 1088px): BN + Trends fixed 338px when three columns fit (tier 4).
 * Threshold = 1048px flex row + 2× --dashboard-margin on dashboard-page.
 */

/** Row breakers in flex-row only — basis-full in flex-col sets height, not width. */
export const DASHBOARD_SECTION_FULL_ROW =
  'w-full min-w-0 shrink-0 grow-0 @min-[43.25rem]/dashboard:basis-full';

/** BN & Trends — flex-1 pair below wide; fixed 338px at wide. */
export const DASHBOARD_GRID_COLUMN_CLASS =
  '@min-[43.25rem]/dashboard:flex @min-[43.25rem]/dashboard:min-h-0 @min-[43.25rem]/dashboard:flex-1 @min-[43.25rem]/dashboard:min-w-[calc(50%-0.5rem)] @min-[43.25rem]/dashboard:flex-col @min-[43.25rem]/dashboard:self-stretch @min-[68rem]/dashboard:w-[338px] @min-[68rem]/dashboard:min-w-[338px] @min-[68rem]/dashboard:max-w-[338px] @min-[68rem]/dashboard:flex-none';

/** Bottleneck — fixed 338px from pair breakpoint; full width in single column. */
export const DASHBOARD_BOTTLENECK_COLUMN_CLASS =
  '@min-[43.25rem]/dashboard:flex @min-[43.25rem]/dashboard:min-h-0 @min-[43.25rem]/dashboard:w-[420px] @min-[43.25rem]/dashboard:min-w-[338px] @min-[43.25rem]/dashboard:max-w-[338px] @min-[43.25rem]/dashboard:flex-none @min-[43.25rem]/dashboard:flex-col @min-[43.25rem]/dashboard:self-stretch';

/** Schedule — 338px from pair breakpoint (sits beside funnel when wrapped); md+ only (mobile uses drawer). */
export const DASHBOARD_SCHEDULE_COLUMN_CLASS =
  'md:@min-[43.25rem]/dashboard:flex md:@min-[43.25rem]/dashboard:min-h-0 md:@min-[43.25rem]/dashboard:w-[338px] md:@min-[43.25rem]/dashboard:min-w-[338px] md:@min-[43.25rem]/dashboard:max-w-[338px] md:@min-[43.25rem]/dashboard:flex-none md:@min-[43.25rem]/dashboard:flex-col md:@min-[43.25rem]/dashboard:self-stretch';

/** Funnel — grows from pair breakpoint; min 340px. */
export const DASHBOARD_FUNNEL_COLUMN_CLASS =
  '@min-[43.25rem]/dashboard:flex @min-[43.25rem]/dashboard:min-h-0 @min-[43.25rem]/dashboard:min-w-[340px] @min-[43.25rem]/dashboard:max-w-full @min-[43.25rem]/dashboard:flex-1 @min-[43.25rem]/dashboard:flex-col @min-[43.25rem]/dashboard:self-stretch';

/** Open reqs — fills space beside 338px schedule on bottom row. */
export const DASHBOARD_REQS_COLUMN_CLASS =
  '@min-[43.25rem]/dashboard:flex @min-[43.25rem]/dashboard:min-h-0 @min-[43.25rem]/dashboard:flex-1 @min-[43.25rem]/dashboard:flex-col @min-[43.25rem]/dashboard:self-stretch @min-[43.25rem]/dashboard:min-w-[calc(100%-338px-var(--dashboard-grid-gap))]';

const cardStretchRoot =
  'w-full max-w-full min-w-0 min-h-0 @min-[43.25rem]/dashboard:flex @min-[43.25rem]/dashboard:flex-1 @min-[43.25rem]/dashboard:flex-col';

const cardStretchPtBase: CardPassThrough = {
  body: {
    class:
      '@min-[43.25rem]/dashboard:flex @min-[43.25rem]/dashboard:flex-1 @min-[43.25rem]/dashboard:flex-col @min-[43.25rem]/dashboard:min-h-0',
  },
  content: {
    class:
      '@min-[43.25rem]/dashboard:flex @min-[43.25rem]/dashboard:flex-1 @min-[43.25rem]/dashboard:flex-col @min-[43.25rem]/dashboard:min-h-0',
  },
};

/** Column cards that fill available height (schedule, bottleneck). */
export function dashboardCardStretchStyleClass(cardClass: string): string {
  return `${cardClass} ${cardStretchRoot}`;
}

export function dashboardCardStretchPt(): CardPassThrough {
  return { ...cardStretchPtBase };
}

/** Panel cards with a minimum content height (trends, requisitions). */
export function dashboardCardPanelStyleClass(cardClass: string): string {
  return `${cardClass} ${cardStretchRoot}`;
}

export function dashboardCardPanelPt(): CardPassThrough {
  return {
    body: {
      class:
        '@min-[43.25rem]/dashboard:flex @min-[43.25rem]/dashboard:flex-1 @min-[43.25rem]/dashboard:flex-col @min-[43.25rem]/dashboard:min-h-0',
    },
    content: {
      class:
        '@min-[43.25rem]/dashboard:flex @min-[43.25rem]/dashboard:flex-1 @min-[43.25rem]/dashboard:flex-col @min-[43.25rem]/dashboard:min-h-[375px]',
    },
  };
}

/** Horizontal scroll wrappers for wide tables. */
export const DASHBOARD_SCROLL_CLIP_CLASS =
  'max-w-full min-w-0 overflow-x-clip [contain:inline-size]';

export const DASHBOARD_SCROLL_X_CLASS =
  'max-w-full min-w-0 overflow-x-auto max-[379px]:w-full max-[379px]:max-w-full';
