import { Component, Input } from '@angular/core';
import { Card } from 'primeng/card';

import { KpiMetric, KpiTrendDirection } from '../../models/dashboard.models';
import { kpiColor } from '../../theme/theme-colors';

@Component({
  selector: 'app-kpi',
  imports: [Card],
  templateUrl: './kpi.component.html',
})
export class KpiComponent {
  @Input({ required: true }) kpis: KpiMetric[] = [];

  metricColor(trend?: KpiTrendDirection): string {
    return kpiColor(trend);
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
}
