import { Component } from '@angular/core';

import { MOCK_DASHBOARD } from '../../data/mock-dashboard.data';
import {
  BottleneckComponent,
  KpiComponent,
  MobileHeaderComponent,
  PageHeaderComponent,
  ScheduleComponent,
  SidebarNavComponent,
  TrendsComponent,
} from '../../sections';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    BottleneckComponent,
    KpiComponent,
    MobileHeaderComponent,
    PageHeaderComponent,
    ScheduleComponent,
    SidebarNavComponent,
    TrendsComponent,
  ],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage {
  readonly data = MOCK_DASHBOARD;
  sidebarCollapsed = false;
}
