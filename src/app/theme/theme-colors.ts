import {
  PIP_TOKENS,
  PipChartColor,
  PipPatternSlot,
  PipResponsibility,
  PipRiskLevel,
  PipSlot,
  PipTrendMetricId,
} from './pip-tokens';

export type {
  PipChartColor,
  PipPatternSlot,
  PipResponsibility,
  PipRiskLevel,
  PipSlot,
  PipTrendMetricId,
};

export function responsibilitySlot(responsibility: PipResponsibility): PipSlot {
  return PIP_TOKENS.responsibility[responsibility];
}

export function slotFill(slot: PipSlot): string {
  return PIP_TOKENS.slots[slot].fill;
}

export function slotInk(slot: PipSlot): string {
  return PIP_TOKENS.slots[slot].ink;
}

export function responsibilityPill(responsibility: PipResponsibility): { bg: string; text: string } {
  const slot = responsibilitySlot(responsibility);
  return { bg: slotFill(slot), text: slotInk(slot) };
}

export function funnelStageColor(stageIndex: number): string {
  const slot = Math.min(stageIndex, PIP_TOKENS.slots.length - 1) as PipSlot;
  return slotFill(slot);
}

export function funnelStageLabelColor(stageIndex: number): string {
  const slot = Math.min(stageIndex, PIP_TOKENS.slots.length - 1) as PipSlot;
  return slotInk(slot);
}

/** Funnel glass bars — layered ink/fill at ~85% strength for glass styling. */
export function funnelStageGlassStyle(stageIndex: number): {
  ink: string;
  fill: string;
} {
  const slot = Math.min(stageIndex, PIP_TOKENS.slots.length - 1) as PipSlot;
  const { fill, ink } = PIP_TOKENS.slots[slot];

  return { ink, fill };
}

export function chartColor(token: PipChartColor): string {
  return PIP_TOKENS.chart[token];
}

export function brandIndigo(): string {
  return PIP_TOKENS.text.color;
}

export function riskPill(level: PipRiskLevel): { bg: string; text: string } {
  const colors = PIP_TOKENS.risk[level];
  return { bg: colors.fill, text: colors.ink };
}

export function bottleneckAccent(responsibility: PipResponsibility): string {
  return slotInk(responsibilitySlot(responsibility));
}

export function bottleneckIconBg(responsibility: PipResponsibility): string {
  return slotFill(responsibilitySlot(responsibility));
}

export function scheduleGroupColor(group: keyof typeof PIP_TOKENS.schedule): string {
  return PIP_TOKENS.schedule[group];
}

export function trendSeriesColor(metricId: PipTrendMetricId): string {
  return PIP_TOKENS.trends[metricId].ink;
}

/** Prior-year projection segments — darker than fill, lighter than current-year ink. */
export function trendSeriesPriorColor(metricId: PipTrendMetricId): string {
  const { fill, ink } = PIP_TOKENS.trends[metricId];
  return blendHex(fill, ink, 0.62);
}

function blendHex(from: string, to: string, toWeight: number): string {
  const parse = (hex: string): [number, number, number] => {
    const value = hex.replace('#', '');
    return [
      Number.parseInt(value.slice(0, 2), 16),
      Number.parseInt(value.slice(2, 4), 16),
      Number.parseInt(value.slice(4, 6), 16),
    ];
  };

  const [fr, fg, fb] = parse(from);
  const [tr, tg, tb] = parse(to);
  const fromWeight = 1 - toWeight;

  const channel = (f: number, t: number) =>
    Math.round(f * fromWeight + t * toWeight)
      .toString(16)
      .padStart(2, '0');

  return `#${channel(fr, tr)}${channel(fg, tg)}${channel(fb, tb)}`;
}

export function kpiMetricColor(slot: PipPatternSlot): string {
  return slotInk(slot);
}

export function themeTextColor(): string {
  return 'var(--p-text-color)';
}

export function themeMutedColor(): string {
  return 'var(--p-text-muted-color)';
}

export function themeBorderColor(): string {
  return 'var(--p-content-border-color)';
}

export function readThemeVar(token: string): string {
  if (typeof document === 'undefined') {
    return '';
  }

  const name = token.startsWith('--') ? token : `--p-${token}`;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function readChartColor(token: PipChartColor): string {
  return chartColor(token);
}

export function paleChartColor(token: PipChartColor): string {
  return chartColor(token);
}
