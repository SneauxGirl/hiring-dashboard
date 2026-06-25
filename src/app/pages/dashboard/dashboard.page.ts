import { Component, computed, linkedSignal, OnDestroy, signal } from '@angular/core';

import {
  DASHBOARD_LG_COLUMN_CLASS,
  DASHBOARD_LG_FILL_COLUMN_CLASS,
} from '../../config/dashboard-layout';
import {
  dashboardForDate,
  fromDateKey,
  toDateKey,
} from '../../data/dashboard-calendar-day.resolver';
import { trendsForDate } from '../../data/dashboard-trends.mock';
import {
  calendarNavRangeForDate,
  captureViewerDay,
  msUntilLocalMidnight,
} from '../../data/dashboard-viewer-day';
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
export class DashboardPage implements OnDestroy {
  readonly lgColumnClass = DASHBOARD_LG_COLUMN_CLASS;
  readonly lgFillColumnClass = DASHBOARD_LG_FILL_COLUMN_CLASS;

  readonly user = MOCK_DASHBOARD_USER;
  readonly viewerDay = signal(captureViewerDay());
  readonly selectedDateKey = linkedSignal({
    source: this.viewerDay,
    computation: (viewer) => viewer.dayKey,
  });
  readonly selectedDate = linkedSignal({
    source: this.selectedDateKey,
    computation: (key) => fromDateKey(key),
  });

  readonly calendarNav = computed(() => calendarNavRangeForDate(this.viewerDay().date));
  readonly trendValues = computed(() => trendsForDate(this.selectedDate()));
  readonly dashboard = computed(() => {
    const anchor = this.viewerDay().date;
    const selected = this.selectedDate();

    return dashboardForDate(selected, anchor) ?? dashboardForDate(anchor, anchor)!;
  });

  sidebarCollapsed = false;

  private midnightTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.scheduleViewerDayRefresh();
  }

  ngOnDestroy(): void {
    if (this.midnightTimer !== null) {
      clearTimeout(this.midnightTimer);
    }
  }

  onSelectedDateChange(date: Date): void {
    this.selectedDateKey.set(toDateKey(date));
  }

  private scheduleViewerDayRefresh(): void {
    this.midnightTimer = setTimeout(() => {
      this.viewerDay.set(captureViewerDay());
      this.scheduleViewerDayRefresh();
    }, msUntilLocalMidnight());
  }
}
