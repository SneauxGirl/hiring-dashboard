import { Component, Input } from '@angular/core';
import { Card } from 'primeng/card';

import { BOTTLENECK_DEFINITIONS } from './bottleneck.catalog';
import { BottleneckCard, BottleneckWeekMetrics } from '../../models/dashboard.models';
import { PipResponsibility } from '../../theme/pip-tokens';
import { bottleneckAccent, bottleneckIconBg } from '../../theme/theme-colors';

@Component({
  selector: 'app-bottleneck',
  imports: [Card],
  templateUrl: './bottleneck.component.html',
  styleUrl: './bottleneck.component.css',
})
export class BottleneckComponent {
  @Input({ required: true }) bottleneckMetrics: BottleneckWeekMetrics[] = [];

  get bottlenecks(): BottleneckCard[] {
    return BOTTLENECK_DEFINITIONS.map((definition) => {
      const metrics = this.metricsFor(definition.responsibility);
      return {
        id: definition.responsibility,
        title: definition.title,
        titleLine2: definition.titleLine2,
        subtitle: definition.subtitle,
        avgLabel: definition.avgLabel,
        responsibility: definition.responsibility,
        candidateCount: metrics?.candidateCount ?? 0,
        avgMetric: metrics?.avgMetric ?? 0,
      };
    });
  }

  candidateLabel(count: number): string {
    return count === 1 ? 'candidate' : 'candidates';
  }

  responsibilityConfig(responsibility: PipResponsibility): { iconClass: string } {
    const definition = BOTTLENECK_DEFINITIONS.find((entry) => entry.responsibility === responsibility);
    return { iconClass: definition?.iconClass ?? 'pi pi-info-circle' };
  }

  accentColor(responsibility: PipResponsibility): string {
    return bottleneckAccent(responsibility);
  }

  iconBg(responsibility: PipResponsibility): string {
    return bottleneckIconBg(responsibility);
  }

  washBg(responsibility: PipResponsibility): string {
    const fill = bottleneckIconBg(responsibility);
    return `color-mix(in srgb, ${fill} 45%, white)`;
  }

  private metricsFor(responsibility: PipResponsibility): BottleneckWeekMetrics | undefined {
    return this.bottleneckMetrics.find((entry) => entry.responsibility === responsibility);
  }
}
