import { Component, computed, signal } from '@angular/core';

import {
  dashboardForDate,
  fromDateKey,
  startOfDay,
  toDateKey,
} from '../../data/dashboard-story-day.resolver';
import { trendsForViewer } from '../../data/dashboard-trends.mock';
import { MOCK_DASHBOARD_USER } from '../../data/dashboard-user.mock';
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
  host: { class: 'block w-full min-w-0 min-h-screen' },
})
export class DashboardPage {
  readonly user = MOCK_DASHBOARD_USER;
  readonly trendValues = trendsForViewer();
  readonly referenceDate = startOfDay(new Date());
  readonly selectedDateKey = signal(toDateKey(this.referenceDate));
  readonly selectedDate = computed(() => fromDateKey(this.selectedDateKey()));
  readonly dashboard = computed(
    () =>
      dashboardForDate(this.selectedDate(), this.referenceDate) ??
      dashboardForDate(this.referenceDate, this.referenceDate)!,
  );

  sidebarCollapsed = false;

  onSelectedDateChange(date: Date): void {
    this.selectedDateKey.set(toDateKey(date));
  }
}
