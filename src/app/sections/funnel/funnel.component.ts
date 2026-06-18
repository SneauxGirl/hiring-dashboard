import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Card } from 'primeng/card';

import {
  FunnelStage,
  StageDuration,
} from '../../models/dashboard.models';
import { funnelBarFill } from '../../theme/theme-colors';

@Component({
  selector: 'app-funnel',
  imports: [Card, DecimalPipe],
  templateUrl: './funnel.component.html',
})
export class FunnelComponent {
  @Input({ required: true }) funnelStages: FunnelStage[] = [];
  @Input({ required: true }) stageDurations: StageDuration[] = [];

  get maxCount(): number {
    return this.funnelStages[0]?.count ?? 1;
  }

  get overallConversionPct(): string {
    const start = this.funnelStages[0]?.count ?? 0;
    const end = this.funnelStages[this.funnelStages.length - 1]?.count ?? 0;
    if (start === 0) {
      return '0';
    }

    return ((end / start) * 100).toFixed(1);
  }

  get totalDurationDays(): number {
    return this.stageDurations.reduce((sum, segment) => sum + segment.days, 0);
  }

  barWidth(count: number): string {
    return `${(count / this.maxCount) * 100}%`;
  }

  barColor(stage: FunnelStage, index: number): string {
    const zoneIndex = stage.colorZone === 'early' ? index : index - 3;
    return funnelBarFill(stage.colorZone, zoneIndex);
  }

  stageTitle(stage: FunnelStage): string {
    return `${stage.stageKey}. ${stage.label}`;
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

  durationColor(durationIndex: number): string {
    const stage = this.funnelStages[durationIndex];
    if (!stage) {
      return funnelBarFill('early', 0);
    }

    return this.barColor(stage, durationIndex);
  }
}
