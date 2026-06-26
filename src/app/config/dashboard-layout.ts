import { CardPassThrough } from 'primeng/types/card';

/**
 * Dashboard grid tiers follow @container/dashboard (main content width), not viewport.
 * Sidebar open/closed changes main width and triggers reflow automatically.
 *
 * Pair (43.25rem / 692px): BN + Trends side by side (tier 3).
 * Wide (64.5rem / 1032px): BN + Trends + Funnel on one row (tier 4).
 */

/** Row breakers in flex-row only — basis-full in flex-col sets height, not width. */
export const DASHBOARD_SECTION_FULL_ROW =
  'w-full min-w-0 shrink-0 grow-0 @min-[43.25rem]/dashboard:basis-full';

/** BN & Trends — flex-1 pair below wide; fixed 338px at wide. */
export const DASHBOARD_GRID_COLUMN_CLASS =
  '@min-[43.25rem]/dashboard:flex @min-[43.25rem]/dashboard:flex-1 @min-[43.25rem]/dashboard:min-w-[calc(50%-0.5rem)] @min-[43.25rem]/dashboard:flex-col @min-[43.25rem]/dashboard:self-stretch @min-[64.5rem]/dashboard:w-[338px] @min-[64.5rem]/dashboard:min-w-[338px] @min-[64.5rem]/dashboard:max-w-[338px] @min-[64.5rem]/dashboard:flex-none';

/** Schedule — 338px from pair breakpoint (sits beside funnel when wrapped). */
export const DASHBOARD_SCHEDULE_COLUMN_CLASS =
  '@min-[43.25rem]/dashboard:flex @min-[43.25rem]/dashboard:w-[338px] @min-[43.25rem]/dashboard:min-w-[338px] @min-[43.25rem]/dashboard:max-w-[338px] @min-[43.25rem]/dashboard:flex-none @min-[43.25rem]/dashboard:flex-col @min-[43.25rem]/dashboard:self-stretch';

/** Funnel — grows from pair breakpoint; min 340px. */
export const DASHBOARD_FUNNEL_COLUMN_CLASS =
  '@min-[43.25rem]/dashboard:flex @min-[43.25rem]/dashboard:min-w-[340px] @min-[43.25rem]/dashboard:max-w-full @min-[43.25rem]/dashboard:flex-1 @min-[43.25rem]/dashboard:flex-col @min-[43.25rem]/dashboard:self-stretch';

/** Open reqs — fills space beside 338px schedule on bottom row. */
export const DASHBOARD_REQS_COLUMN_CLASS =
  '@min-[43.25rem]/dashboard:flex @min-[43.25rem]/dashboard:flex-1 @min-[43.25rem]/dashboard:flex-col @min-[43.25rem]/dashboard:self-stretch @min-[43.25rem]/dashboard:min-w-[calc(100%-338px-var(--dashboard-grid-gap))]';

/** @deprecated Use DASHBOARD_GRID_COLUMN_CLASS */
export const DASHBOARD_LG_COLUMN_CLASS = DASHBOARD_GRID_COLUMN_CLASS;

/** @deprecated Use DASHBOARD_REQS_COLUMN_CLASS */
export const DASHBOARD_LG_FILL_COLUMN_CLASS = DASHBOARD_REQS_COLUMN_CLASS;

const cardStretchRoot = 'w-full max-w-full min-w-0 lg:flex lg:flex-1 lg:flex-col lg:min-h-0';

const cardStretchPtBase: CardPassThrough = {
  body: { class: 'lg:flex lg:flex-1 lg:flex-col lg:min-h-0' },
  content: { class: 'lg:flex lg:flex-1 lg:flex-col lg:min-h-0' },
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
    body: { class: 'lg:flex lg:flex-1 lg:flex-col lg:min-h-0' },
    content: { class: 'lg:flex lg:flex-1 lg:flex-col lg:min-h-[375px]' },
  };
}

/** Horizontal scroll wrappers for wide tables. */
export const DASHBOARD_SCROLL_CLIP_CLASS =
  'max-w-full min-w-0 overflow-x-clip [contain:inline-size]';

export const DASHBOARD_SCROLL_X_CLASS =
  'max-w-full min-w-0 overflow-x-auto max-[379px]:w-full max-[379px]:max-w-full';
