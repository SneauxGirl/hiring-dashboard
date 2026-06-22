import { Component, Input } from '@angular/core';
import { Card } from 'primeng/card';
import { Tooltip } from 'primeng/tooltip';

import { KPI_DEFINITIONS } from './kpi.catalog';
import { KpiMetric, KpiWeekValues, KpiTrendDirection } from '../../models/dashboard.models';

@Component({
  selector: 'app-kpi',
  imports: [Card, Tooltip],
  templateUrl: './kpi.component.html',
})
export class KpiComponent {
  @Input({ required: true }) kpiValues: KpiWeekValues[] = [];

  get kpis(): KpiMetric[] {
    return KPI_DEFINITIONS.map((definition, index) => ({
      label: definition.label,
      ...this.kpiValues[index],
    }));
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

  deltaAccessibleLabel(kpi: KpiMetric): string {
    if (!kpi.delta) {
      return '';
    }

    const delta = kpi.delta.trim();

    switch (kpi.trend) {
      case 'up':
        return `Increased by ${delta}`;
      case 'down':
        return `Decreased by ${delta}`;
      default:
        return delta;
    }
  }
}
