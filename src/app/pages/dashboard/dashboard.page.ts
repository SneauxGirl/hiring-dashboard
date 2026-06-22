import { Component, computed, signal } from '@angular/core';

import { MOCK_DASHBOARD_USER } from '../../data/dashboard-user.mock';
import { DASHBOARD_WEEKS, DashboardWeekKey } from '../../data/dashboard-weeks.mock';
import { MOCK_DASHBOARD_BY_WEEK } from '../../data/dashboard-weekly.mock';
import {
  BottleneckComponent,
  FunnelComponent,
  KpiComponent,
  MobileHeaderComponent,
  PageHeaderComponent,
  RequisitionsComponent,
  ScheduleComponent,
  SidebarNavComponent,
  TrendsComponent,
} from '../../sections';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    BottleneckComponent,
    FunnelComponent,
    KpiComponent,
    MobileHeaderComponent,
    PageHeaderComponent,
    RequisitionsComponent,
    ScheduleComponent,
    SidebarNavComponent,
    TrendsComponent,
  ],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage {
  readonly user = MOCK_DASHBOARD_USER;
  readonly weeks = DASHBOARD_WEEKS;
  readonly selectedWeekKey = signal<DashboardWeekKey>('2026-06-15');
  readonly dashboard = computed(
    () => MOCK_DASHBOARD_BY_WEEK[this.selectedWeekKey()] ?? MOCK_DASHBOARD_BY_WEEK['2026-06-15'],
  );

  sidebarCollapsed = false;
}
