import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnDestroy,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';

import {
  addCalendarDays,
  isSameDay,
  startOfDay,
} from '../../data/dashboard-calendar-day.resolver';
import { ViewerDay } from '../../data/dashboard-viewer-day';

export type DashboardDatePickerCell = {
  date: Date;
  day: number;
  inMonth: boolean;
  selectable: boolean;
};

@Component({
  selector: 'app-dashboard-date-picker',
  templateUrl: './dashboard-date-picker.component.html',
  host: { class: 'block shrink-0' },
})
export class DashboardDatePickerComponent implements OnDestroy {
  /** Delay before hover swaps Today/Yesterday to the formatted date. */
  private static readonly FRIENDLY_HOVER_DELAY_MS = 1500;

  protected formatCellAria(date: Date): string {
    return this.accessibleDateLabel.format(date);
  }

  protected readonly showPicker = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly host = inject(ElementRef<HTMLElement>);

  private readonly formattedDateLabel = new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
  });

  private readonly accessibleDateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  private readonly monthTitleLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  });

  @ViewChild('panel') panelRef?: ElementRef<HTMLElement>;

  @Input({ required: true }) viewerDay!: ViewerDay;
  @Input({ required: true }) calendarMinDate!: Date;
  @Input({ required: true }) calendarMaxDate!: Date;
  @Input({ required: true }) selectedDate!: Date;
  @Output() readonly selectedDateChange = new EventEmitter<Date>();

  protected panelOpen = false;
  protected panelMonth: Date = startOfDay(new Date());
  protected fieldFocused = false;
  protected hoverDateRevealed = false;

  private hoverRevealTimer: ReturnType<typeof setTimeout> | null = null;

  readonly weekdayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

  get showDateDetail(): boolean {
    return this.panelOpen || this.fieldFocused || this.hoverDateRevealed;
  }

  get formattedDate(): string {
    return this.formattedDateLabel.format(this.selectedDate);
  }

  get isSelectedToday(): boolean {
    return isSameDay(this.selectedDate, this.viewerDay.date);
  }

  get isSelectedYesterday(): boolean {
    return isSameDay(this.selectedDate, addCalendarDays(this.viewerDay.date, -1));
  }

  get usesFriendlyLabel(): boolean {
    return this.isSelectedToday || this.isSelectedYesterday;
  }

  get friendlyLabel(): string {
    if (this.isSelectedToday) {
      return 'Today';
    }
    if (this.isSelectedYesterday) {
      return 'Yesterday';
    }
    return '';
  }

  get ariaLabel(): string {
    const formatted = this.accessibleDateLabel.format(this.selectedDate);
    if (this.isSelectedToday) {
      return `Selected date: ${formatted} (Today)`;
    }
    if (this.isSelectedYesterday) {
      return `Selected date: ${formatted} (Yesterday)`;
    }
    return `Selected date: ${formatted}`;
  }

  get monthTitle(): string {
    return this.monthTitleLabel.format(this.panelMonth);
  }

  get monthGrid(): DashboardDatePickerCell[] {
    return buildMonthGrid(
      this.panelMonth.getFullYear(),
      this.panelMonth.getMonth(),
      this.calendarMinDate,
      this.calendarMaxDate,
    );
  }

  get canGoPrevMonth(): boolean {
    const prev = new Date(this.panelMonth.getFullYear(), this.panelMonth.getMonth() - 1, 1);
    return startOfDay(prev).getTime() >= startOfMonth(this.calendarMinDate).getTime();
  }

  get canGoNextMonth(): boolean {
    const next = new Date(this.panelMonth.getFullYear(), this.panelMonth.getMonth() + 1, 1);
    return startOfMonth(next).getTime() <= startOfMonth(this.calendarMaxDate).getTime();
  }

  openPanel(): void {
    this.panelMonth = startOfDay(this.selectedDate);
    this.panelOpen = true;
  }

  closePanel(): void {
    this.panelOpen = false;
    this.cancelHoverReveal();
  }

  onControlMouseEnter(): void {
    if (!this.usesFriendlyLabel || this.showDateDetail) {
      return;
    }

    this.cancelHoverReveal();
    this.hoverRevealTimer = globalThis.setTimeout(() => {
      this.hoverDateRevealed = true;
      this.hoverRevealTimer = null;
    }, DashboardDatePickerComponent.FRIENDLY_HOVER_DELAY_MS);
  }

  onControlMouseLeave(): void {
    this.cancelHoverReveal();
    this.hoverDateRevealed = false;
  }

  onFieldFocus(): void {
    this.fieldFocused = true;
    this.cancelHoverReveal();
  }

  onFieldBlur(): void {
    this.fieldFocused = false;
  }

  ngOnDestroy(): void {
    this.cancelHoverReveal();
  }

  private cancelHoverReveal(): void {
    if (this.hoverRevealTimer !== null) {
      clearTimeout(this.hoverRevealTimer);
      this.hoverRevealTimer = null;
    }
  }

  togglePanel(): void {
    if (this.panelOpen) {
      this.closePanel();
      return;
    }
    this.openPanel();
  }

  goPrevMonth(): void {
    if (!this.canGoPrevMonth) {
      return;
    }
    this.panelMonth = new Date(this.panelMonth.getFullYear(), this.panelMonth.getMonth() - 1, 1);
  }

  goNextMonth(): void {
    if (!this.canGoNextMonth) {
      return;
    }
    this.panelMonth = new Date(this.panelMonth.getFullYear(), this.panelMonth.getMonth() + 1, 1);
  }

  selectDate(date: Date): void {
    const normalized = startOfDay(date);
    this.selectedDateChange.emit(normalized);
    this.closePanel();
  }

  isSelectedCell(cell: DashboardDatePickerCell): boolean {
    return cell.inMonth && isSameDay(cell.date, this.selectedDate);
  }

  isViewerTodayCell(cell: DashboardDatePickerCell): boolean {
    return cell.inMonth && isSameDay(cell.date, this.viewerDay.date);
  }

  cellLabel(cell: DashboardDatePickerCell): string {
    return String(cell.day);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.panelOpen) {
      this.closePanel();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.panelOpen) {
      return;
    }

    const target = event.target as Node | null;
    if (target && this.host.nativeElement.contains(target)) {
      return;
    }

    this.closePanel();
  }
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildMonthGrid(
  year: number,
  month: number,
  minDate: Date,
  maxDate: Date,
): DashboardDatePickerCell[] {
  const min = startOfDay(minDate);
  const max = startOfDay(maxDate);
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);
  const cells: DashboardDatePickerCell[] = [];

  for (let index = 0; index < 42; index++) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const normalized = startOfDay(date);
    const inMonth = normalized.getMonth() === month;

    cells.push({
      date: normalized,
      day: normalized.getDate(),
      inMonth,
      selectable:
        inMonth && normalized.getTime() >= min.getTime() && normalized.getTime() <= max.getTime(),
    });
  }

  return cells;
}
