import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

import { DashboardUser, WeekRangeOption } from '../../models/dashboard.models';

@Component({
  selector: 'app-page-header-section',
  imports: [FormsModule, Select],
  templateUrl: './page-header-section.component.html',
})
export class PageHeaderSectionComponent implements OnInit {
  @Input({ required: true }) user!: DashboardUser;

  weekOptions: WeekRangeOption[] = [];
  selectedWeek = '';

  private static readonly weekCount = 9;
  private static readonly weeksBefore = 4;

  ngOnInit(): void {
    this.weekOptions = this.buildWeekOptions();
    this.selectedWeek = this.weekOptions[PageHeaderSectionComponent.weeksBefore]?.value ?? '';
  }

  get firstName(): string {
    return this.user.name.trim().split(/\s+/)[0] ?? this.user.name;
  }

  get timeGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning, ';
    }
    if (hour < 17) {
      return 'Good afternoon, ';
    }
    return 'Good evening, ';
  }

  private buildWeekOptions(): WeekRangeOption[] {
    const currentWeekStart = this.startOfWeek(new Date());
    const options: WeekRangeOption[] = [];

    for (let offset = -PageHeaderSectionComponent.weeksBefore; offset < PageHeaderSectionComponent.weekCount - PageHeaderSectionComponent.weeksBefore; offset++) {
      const start = new Date(currentWeekStart);
      start.setDate(start.getDate() + offset * 7);
      options.push({
        label: this.formatWeekLabel(start),
        value: this.toDateKey(start),
      });
    }

    return options;
  }

  private startOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  private formatWeekLabel(weekStart: Date): string {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const month = new Intl.DateTimeFormat('en-US', { month: 'short' });
    const day = new Intl.DateTimeFormat('en-US', { day: 'numeric' });
    const year = weekEnd.getFullYear();

    if (weekStart.getMonth() === weekEnd.getMonth() && weekStart.getFullYear() === weekEnd.getFullYear()) {
      return `${month.format(weekStart)} ${day.format(weekStart)} – ${day.format(weekEnd)}, ${year}`;
    }

    const startLabel = `${month.format(weekStart)} ${day.format(weekStart)}`;
    const endLabel = `${month.format(weekEnd)} ${day.format(weekEnd)}, ${year}`;
    return `${startLabel} – ${endLabel}`;
  }

  private toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
