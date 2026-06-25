import { CardPassThrough } from 'primeng/types/card';

/** Fixed lg column for schedule, bottleneck, trends. */
export const DASHBOARD_LG_COLUMN_CLASS =
  'lg:flex lg:w-[338px] lg:min-w-[338px] lg:max-w-[338px] lg:flex-none lg:flex-col lg:self-stretch';

/** Requisitions row beside a 338px column + grid gap. */
export const DASHBOARD_LG_FILL_COLUMN_CLASS =
  'lg:flex lg:flex-1 lg:flex-col lg:self-stretch lg:min-w-[calc(100%-338px-var(--dashboard-grid-gap))]';

const cardStretchRoot = 'w-full max-w-full min-w-0 lg:flex lg:flex-1 lg:flex-col lg:min-h-0';

const cardStretchPtBase: CardPassThrough = {
  body: { class: 'lg:flex lg:flex-1 lg:flex-col lg:min-h-0' },
  content: { class: 'lg:flex lg:flex-1 lg:flex-col lg:min-h-0' },
};

/** lg column cards that fill available height (schedule, bottleneck). */
export function dashboardCardStretchStyleClass(cardClass: string): string {
  return `${cardClass} ${cardStretchRoot}`;
}

export function dashboardCardStretchPt(): CardPassThrough {
  return { ...cardStretchPtBase };
}

/** lg panel cards with a minimum content height (trends, requisitions). */
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
