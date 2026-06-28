import {
  PIP_PALETTE,
  PIP_TOKENS,
  PipColor,
  PipResponsibility,
  PipRiskLevel,
  PipTrendMetricId,
} from './pip-tokens';

export type { PipColor, PipResponsibility, PipRiskLevel, PipTrendMetricId };

export { PIP_PALETTE };

export function palettePair(color: PipColor): { fill: string; solid: string; ink: string } {
  return PIP_PALETTE[color];
}

export function paletteInk(color: PipColor): string {
  return PIP_PALETTE[color].ink;
}

export function paletteSolid(color: PipColor): string {
  return PIP_PALETTE[color].solid;
}

export function paletteFill(color: PipColor): string {
  return PIP_PALETTE[color].fill;
}

export function responsibilityColor(responsibility: PipResponsibility): PipColor {
  return PIP_TOKENS.responsibility[responsibility];
}

export function responsibilityPill(responsibility: PipResponsibility): { bg: string; text: string } {
  const color = responsibilityColor(responsibility);
  return { bg: paletteFill(color), text: paletteInk(color) };
}

/** Conversion pill background — fill + ink for accessible contrast (not chart solid). */
export function funnelBarColor(stageIndex: number): string {
  const colors = PIP_TOKENS.funnel.bar;
  const color = colors[Math.min(stageIndex, colors.length - 1)];
  return paletteFill(color);
}

export function funnelBarLabelColor(stageIndex: number): string {
  const colors = PIP_TOKENS.funnel.bar;
  const color = colors[Math.min(stageIndex, colors.length - 1)];
  return paletteInk(color);
}

export function funnelBarGlassStyle(stageIndex: number): { ink: string; fill: string } {
  const colors = PIP_TOKENS.funnel.bar;
  const color = colors[Math.min(stageIndex, colors.length - 1)];
  // Chart bars only — solid tint; pills use funnelBarColor (fill) + funnelBarLabelColor (ink).
  return { ink: paletteSolid(color), fill: paletteFill(color) };
}

/** Funnel bar surface — solid ink + fill-tinted bottom cap (pre-blended hex for inline styles). */
export function funnelBarSurfaceStyle(stageIndex: number): {
  background: string;
  border: string;
  boxShadow: string;
} {
  const { ink: solid, fill } = funnelBarGlassStyle(stageIndex);
  const bottomCap = blendHex(solid, fill, 0.30);
  const drop = blendHex(solid, '#000000', 0.4);

  return {
    background: `linear-gradient(to bottom, ${solid} calc(100% - 2px), ${bottomCap} calc(100% - 2px))`,
    border: `1px solid ${solid}`,
    boxShadow: `0 1px 2px ${drop}66`,
  };
}

export function funnelDurationColor(durationIndex: number): string {
  const colors = PIP_TOKENS.funnel.duration;
  const color = colors[Math.min(durationIndex, colors.length - 1)];
  return paletteFill(color);
}

export function riskPill(level: PipRiskLevel): { bg: string; text: string } {
  const color = PIP_TOKENS.risk[level];
  return { bg: paletteFill(color), text: paletteInk('charcoal') };
}

export function bottleneckAccent(responsibility: PipResponsibility): string {
  return paletteInk(responsibilityColor(responsibility));
}

export function bottleneckSolid(responsibility: PipResponsibility): string {
  return paletteSolid(responsibilityColor(responsibility));
}

export function bottleneckIconBg(responsibility: PipResponsibility): string {
  return paletteFill(responsibilityColor(responsibility));
}

export function scheduleGroupColor(group: keyof typeof PIP_TOKENS.schedule): string {
  return paletteSolid(PIP_TOKENS.schedule[group]);
}

export function trendSeriesColor(metricId: PipTrendMetricId): string {
  const color = PIP_TOKENS.trends[metricId];
  return color === 'teal' ? paletteInk(color) : paletteSolid(color);
}

export function trendSeriesPriorColor(metricId: PipTrendMetricId): string {
  const color = PIP_TOKENS.trends[metricId];
  const series = color === 'teal' ? paletteInk(color) : paletteSolid(color);
  return blendHex(paletteFill(color), series, 0.62);
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
