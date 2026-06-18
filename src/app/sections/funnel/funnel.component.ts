import { DecimalPipe, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Card } from 'primeng/card';

import { FunnelStage, StageDuration } from '../../models/dashboard.models';
import {
  funnelStageColor,
  funnelStageGlassStyle,
  funnelStageLabelColor,
} from '../../theme/theme-colors';

@Component({
  selector: 'app-funnel',
  imports: [Card, DecimalPipe, NgStyle],
  templateUrl: './funnel.component.html',
  styles: `
    :host {
      display: block;
    }

    .funnel-stage-bar {
      --bar-opacity: 0.85;
      position: relative;
      min-width: 0;
      max-width: 100%;
      border-radius: 0.5rem;
      border: 1px solid color-mix(in srgb, var(--bar-ink) white 72%);
      background: color-mix(in srgb, var(--bar-ink) calc(var(--bar-opacity) * 100%), transparent);
    }
  `,
})
export class FunnelComponent {
  @Input({ required: true }) funnelStages: FunnelStage[] = [];
  @Input({ required: true }) stageDurations: StageDuration[] = [];

  get maxCount(): number {
    return this.funnelStages[0]?.count ?? 1;
  }

  get totalDurationDays(): number {
    return this.stageDurations.reduce((sum, segment) => sum + segment.days, 0);
  }

  barWidthPct(count: number): number {
    if (this.maxCount === 0) {
      return 0;
    }

    return (count / this.maxCount) * 100;
  }

  barColor(index: number): string {
    return funnelStageColor(index);
  }

  barGlassVars(index: number): Record<string, string> {
    const { ink, fill } = funnelStageGlassStyle(index);
    return {
      '--bar-ink': ink,
      '--bar-fill': fill,
    };
  }

  stageTitle(stage: FunnelStage): string {
    return `${stage.stageKey}. ${stage.label}`;
  }

  stageConversionText(stage: FunnelStage): string {
    if (stage.conversionPct === undefined) {
      return '--';
    }

    return `${stage.conversionPct}%`;
  }

  durationLabel(index: number): string {
    return `h${index}/h${index + 1}`;
  }

  segmentWidth(days: number): string {
    if (this.totalDurationDays === 0) {
      return '0%';
    }

    return `${(days / this.totalDurationDays) * 100}%`;
  }

  showSegmentLabel(days: number): boolean {
    return days >= 8 || (days / this.totalDurationDays) * 100 >= 8;
  }

  barLabelColor(index: number): string {
    return funnelStageLabelColor(index);
  }

  durationColor(durationIndex: number): string {
    return funnelStageColor(durationIndex);
  }
}
