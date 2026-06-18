import {
  PIP_TOKENS,
  PipBottleneckTheme,
  PipChartColor,
  PipFunnelZone,
  PipRiskLevel,
  PipStageTone,
} from './pip-tokens';

export type { PipChartColor, PipBottleneckTheme, PipFunnelZone, PipRiskLevel, PipStageTone };

export function chartColor(token: PipChartColor): string {
  return PIP_TOKENS.chart[token];
}

export function brandIndigo(): string {
  return PIP_TOKENS.brand.indigo;
}

export function riskPill(level: PipRiskLevel): { bg: string; text: string } {
  return PIP_TOKENS.risk[level];
}

export function stagePill(tone: PipStageTone): { bg: string; text: string } {
  switch (tone) {
    case 'screening':
      return PIP_TOKENS.stage.screening;
    case 'interview':
      return PIP_TOKENS.stage.interview;
    case 'final-round':
      return PIP_TOKENS.stage.finalRound;
  }
}

export function bottleneckAccent(theme: PipBottleneckTheme): string {
  switch (theme) {
    case 'waiting-on-me':
      return PIP_TOKENS.bottleneck.waitingOnMe;
    case 'waiting-on-recruiter':
      return PIP_TOKENS.bottleneck.waitingOnRecruiter;
    case 'candidates-aging':
      return PIP_TOKENS.bottleneck.candidatesAging;
  }
}

export function bottleneckIconBg(theme: PipBottleneckTheme): string {
  if (theme === 'waiting-on-me') {
    return PIP_TOKENS.amber.bg;
  }

  return `color-mix(in srgb, ${bottleneckAccent(theme)} 14%, white)`;
}

/** Funnel bars: amber early → blue late. */
export function funnelBarFill(zone: PipFunnelZone, index: number): string {
  if (zone === 'early') {
    const earlyFills = [PIP_TOKENS.amber.bg, PIP_TOKENS.amber.light, PIP_TOKENS.amber.mid];
    return earlyFills[index] ?? earlyFills[earlyFills.length - 1];
  }

  const lateFills = [PIP_TOKENS.blue.bg, PIP_TOKENS.blue.light, PIP_TOKENS.blue.mid];
  return lateFills[index] ?? lateFills[lateFills.length - 1];
}

export function kpiTrendColor(trend: 'up' | 'down' | 'neutral'): string {
  switch (trend) {
    case 'up':
      return PIP_TOKENS.trend.up;
    case 'down':
      return PIP_TOKENS.trend.down;
    case 'neutral':
      return PIP_TOKENS.trend.even;
  }
}

/** KPI value + delta share the same trend-driven color. */
export function kpiColor(trend: 'up' | 'down' | 'neutral' | undefined): string {
  return kpiTrendColor(trend ?? 'neutral');
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

export function paleChartColor(token: PipChartColor, mixPercent = 38): string {
  if (token === 'amber') {
    return PIP_TOKENS.amber.light;
  }

  if (token === 'blue' || token === 'teal') {
    return PIP_TOKENS.blue.light;
  }

  const base = chartColor(token);
  return `color-mix(in srgb, ${base} ${100 - mixPercent}%, white)`;
}
