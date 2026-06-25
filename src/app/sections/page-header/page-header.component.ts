import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { DatePickerDateMeta } from 'primeng/types/datepicker';

import { DashboardDatePickerComponent } from '../dashboard-date-picker/dashboard-date-picker.component';

import {
  addCalendarDays,
  isSameDay,
  isSelectableCalendarDate,
  startOfDay,
} from '../../data/dashboard-calendar-day.resolver';
import { ViewerDay } from '../../data/dashboard-viewer-day';
import { DashboardUser } from '../../models/dashboard.models';

@Component({
  selector: 'app-page-header',
  imports: [DashboardDatePickerComponent, FormsModule, DatePicker],
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent implements OnChanges {
  /** Popup DatePicker overlay is not SSR-safe; mount after browser bootstrap. */
  protected readonly showDatePicker = isPlatformBrowser(inject(PLATFORM_ID));

  /** Parseable while today/yesterday field is focused for typing. */
  protected readonly editDateFormat = 'm/d/yy';
  /** Default format for all other selected dates. */
  protected readonly defaultDateFormat = 'm/d/yy';

  private readonly accessibleDateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  protected isEditing = false;

  /** Suppresses friendly-label flicker while a calendar day click is closing the panel. */
  private selectingFromPanel = false;
  /** Holds the picked date until the parent @Input catches up after panel close. */
  private pendingSelectedDate: Date | null = null;
  private blurResetTimer: ReturnType<typeof setTimeout> | null = null;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['selectedDate'] || this.pendingSelectedDate === null) {
      return;
    }

    if (isSameDay(this.selectedDate, this.pendingSelectedDate)) {
      this.pendingSelectedDate = null;
    }
  }

  /** Selected date for display; prefers in-flight calendar pick over stale @Input. */
  private get displaySelectedDate(): Date {
    return this.pendingSelectedDate ?? this.selectedDate;
  }

  get isSelectedToday(): boolean {
    return isSameDay(this.displaySelectedDate, this.viewerDay.date);
  }

  get isSelectedYesterday(): boolean {
    return isSameDay(this.displaySelectedDate, addCalendarDays(this.viewerDay.date, -1));
  }

  get usesFriendlyDisplay(): boolean {
    return this.isSelectedToday || this.isSelectedYesterday;
  }

  /** Placeholder-style label when idle on today or yesterday only. */
  get showFriendlyLabel(): boolean {
    return !this.isEditing && this.usesFriendlyDisplay && !this.selectingFromPanel;
  }

  get friendlyDateLabel(): string {
    if (this.isSelectedToday) {
      return 'Today';
    }
    if (this.isSelectedYesterday) {
      return 'Yesterday';
    }
    return '';
  }

  get datePickerAriaLabel(): string {
    const formatted = this.accessibleDateLabel.format(this.displaySelectedDate);
    if (this.isSelectedToday) {
      return `Selected date: ${formatted} (Today)`;
    }
    if (this.isSelectedYesterday) {
      return `Selected date: ${formatted} (Yesterday)`;
    }
    return `Selected date: ${formatted}`;
  }

  get datePickerFormat(): string {
    if (this.usesFriendlyDisplay) {
      return this.editDateFormat;
    }
    return this.defaultDateFormat;
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

  onDateSelect(date: Date): void {
    this.selectingFromPanel = true;
    this.pendingSelectedDate = startOfDay(date);
    this.clearBlurResetTimer();
  }

  onDateFocus(): void {
    if (!this.usesFriendlyDisplay || this.selectingFromPanel) {
      return;
    }
    this.isEditing = true;
  }

  onDateBlur(): void {
    if (!this.usesFriendlyDisplay || this.selectingFromPanel) {
      return;
    }
    this.clearBlurResetTimer();
    this.blurResetTimer = globalThis.setTimeout(() => {
      this.isEditing = false;
      this.blurResetTimer = null;
    }, 150);
  }

  onDatePickerClose(): void {
    this.selectingFromPanel = false;
    this.clearBlurResetTimer();
    if (this.usesFriendlyDisplay) {
      this.isEditing = false;
    }
  }

  onDateChange(date: Date | null): void {
    if (!date) {
      return;
    }

    const normalized = startOfDay(date);
    if (!isSelectableCalendarDate(normalized, this.viewerDay.date)) {
      return;
    }

    if (this.selectingFromPanel) {
      this.pendingSelectedDate = normalized;
    }

    if (!this.selectingFromPanel) {
      this.isEditing = false;
    }
    this.selectedDateChange.emit(normalized);
  }

  onSelectedDateChange(date: Date): void {
    this.selectedDateChange.emit(startOfDay(date));
  }

  private clearBlurResetTimer(): void {
    if (this.blurResetTimer !== null) {
      clearTimeout(this.blurResetTimer);
      this.blurResetTimer = null;
    }
  }
}
