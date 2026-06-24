import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { DatePickerDateMeta } from 'primeng/types/datepicker';

import {
  disabledDatesOutsideStory,
  isSelectableStoryDate,
  startOfDay,
  storyDateRange,
} from '../../data/dashboard-story-day.resolver';
import { DashboardUser } from '../../models/dashboard.models';

@Component({
  selector: 'app-page-header',
  imports: [FormsModule, DatePicker],
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
  @Input({ required: true }) user!: DashboardUser;
  @Input({ required: true }) referenceDate!: Date;
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

  get minStoryDate(): Date {
    return storyDateRange(this.referenceDate).min;
  }

  get maxStoryDate(): Date {
    return storyDateRange(this.referenceDate).max;
  }

  get disabledStoryDates(): Date[] {
    return disabledDatesOutsideStory(this.referenceDate);
  }

  isStoryDay(date: DatePickerDateMeta): boolean {
    if (date.otherMonth) {
      return false;
    }

    return isSelectableStoryDate(new Date(date.year, date.month, date.day), this.referenceDate);
  }

  onDateChange(date: Date | null): void {
    if (!date) {
      return;
    }

    const normalized = startOfDay(date);
    if (!isSelectableStoryDate(normalized, this.referenceDate)) {
      return;
    }

    this.selectedDateChange.emit(normalized);
  }
}
