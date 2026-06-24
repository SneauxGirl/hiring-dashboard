import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { DatePickerDateMeta } from 'primeng/types/datepicker';

import {
  isSameDay,
  isSelectableCalendarDate,
  startOfDay,
} from '../../data/dashboard-calendar-day.resolver';
import { ViewerDay } from '../../data/dashboard-viewer-day';
import { DashboardUser } from '../../models/dashboard.models';

@Component({
  selector: 'app-page-header',
  imports: [FormsModule, DatePicker],
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
  /** Popup DatePicker overlay is not SSR-safe; mount after browser bootstrap. */
  protected readonly showDatePicker = isPlatformBrowser(inject(PLATFORM_ID));

  @Input({ required: true }) user!: DashboardUser;
  @Input({ required: true }) viewerDay!: ViewerDay;
  @Input({ required: true }) calendarMinDate!: Date;
  @Input({ required: true }) calendarMaxDate!: Date;
  @Input({ required: true }) disabledStoryDates!: Date[];
  @Input({ required: true }) selectedDate!: Date;
  @Output() readonly selectedDateChange = new EventEmitter<Date>();

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

  isStoryDay(date: DatePickerDateMeta): boolean {
    if (date.otherMonth) {
      return false;
    }

    return isSelectableCalendarDate(
      new Date(date.year, date.month, date.day),
      this.viewerDay.date,
    );
  }

  isViewerToday(date: DatePickerDateMeta): boolean {
    if (date.otherMonth) {
      return false;
    }

    const cell = new Date(date.year, date.month, date.day);
    return isSameDay(cell, this.viewerDay.date);
  }

  onDateChange(date: Date | null): void {
    if (!date) {
      return;
    }

    const normalized = startOfDay(date);
    if (!isSelectableCalendarDate(normalized, this.viewerDay.date)) {
      return;
    }

    this.selectedDateChange.emit(normalized);
  }
}
