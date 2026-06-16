import { Component, Input } from '@angular/core';
import { Card } from 'primeng/card';

import { KpiColorToken, KpiMetric, KpiTrendDirection } from '../../models/dashboard.models';

@Component({
  selector: 'app-kpi-section',
  imports: [Card],
  templateUrl: './kpi-section.component.html',
})
export class KpiSectionComponent {
  @Input({ required: true }) kpis: KpiMetric[] = [];

  colorVar(token: KpiColorToken): string {
    return `var(--${token})`;
  }

  trendIcon(trend?: KpiTrendDirection): string | null {
    switch (trend) {
      case 'up':
        return 'pi pi-arrow-up-right';
      case 'down':
        return 'pi pi-arrow-down';
      default:
        return null;
    }
  }

  trendColor(kpi: KpiMetric): string {
    return kpi.trend === 'neutral' ? 'var(--gray-700)' : this.colorVar(kpi.colorToken);
  }
}
