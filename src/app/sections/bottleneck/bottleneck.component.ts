import { Component, Input } from '@angular/core';
import { Card } from 'primeng/card';

import { BottleneckCard } from '../../models/dashboard.models';
import { PipResponsibility } from '../../theme/pip-tokens';
import { bottleneckAccent, bottleneckIconBg } from '../../theme/theme-colors';

interface ResponsibilityConfig {
  iconClass: string;
}

@Component({
  selector: 'app-bottleneck',
  imports: [Card],
  templateUrl: './bottleneck.component.html',
})
export class BottleneckComponent {
  @Input({ required: true }) bottlenecks: BottleneckCard[] = [];

  responsibilityConfig(responsibility: PipResponsibility): ResponsibilityConfig {
    switch (responsibility) {
      case 'waiting-on-me':
        return { iconClass: 'pi pi-clock' };
      case 'waiting-on-recruiter':
        return { iconClass: 'pi pi-user' };
      case 'candidates-aging':
        return { iconClass: 'pi pi-calendar' };
    }
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
}
