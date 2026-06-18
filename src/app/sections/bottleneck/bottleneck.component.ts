import { Component, Input } from '@angular/core';
import { Card } from 'primeng/card';

import { BottleneckCard, BottleneckTheme } from '../../models/dashboard.models';
import { bottleneckAccent, bottleneckIconBg } from '../../theme/theme-colors';

interface BottleneckThemeConfig {
  iconClass: string;
}

@Component({
  selector: 'app-bottleneck',
  imports: [Card],
  templateUrl: './bottleneck.component.html',
})
export class BottleneckComponent {
  @Input({ required: true }) bottlenecks: BottleneckCard[] = [];

  themeConfig(theme: BottleneckTheme): BottleneckThemeConfig {
    switch (theme) {
      case 'waiting-on-me':
        return { iconClass: 'pi pi-clock' };
      case 'waiting-on-recruiter':
        return { iconClass: 'pi pi-user' };
      case 'candidates-aging':
        return { iconClass: 'pi pi-calendar' };
    }
  }

  accentColor(theme: BottleneckTheme): string {
    return bottleneckAccent(theme);
  }

  iconBg(theme: BottleneckTheme): string {
    return bottleneckIconBg(theme);
  }
}
