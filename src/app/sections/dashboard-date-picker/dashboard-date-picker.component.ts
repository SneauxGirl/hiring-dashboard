import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Injector,
  Input,
  OnDestroy,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';

import {
  addCalendarDays,
  isSameDay,
  isSelectableCalendarDate,
  startOfDay,
  toDateKey,
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

  private static readonly ARROW_DAY_OFFSET: Partial<Record<string, number>> = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -7,
    ArrowDown: 7,
  };

  protected formatCellAria(cell: DashboardDatePickerCell): string {
    const parts = [this.calendarDayAriaLabel.format(cell.date)];
    if (this.isSelectedCell(cell)) {
      parts.push('selected');
    }
    if (this.isViewerTodayCell(cell)) {
      parts.push('today');
    }
    return parts.join(', ');
  }

  protected readonly showPicker = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);

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

  /** Day buttons — year omitted; dialog title carries month and year. */
  private readonly calendarDayAriaLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  private readonly monthTitleLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  });

  @ViewChild('panel') panelRef?: ElementRef<HTMLElement>;
  @ViewChild('triggerBtn') triggerRef?: ElementRef<HTMLButtonElement>;

  @Input({ required: true }) viewerDay!: ViewerDay;
  @Input({ required: true }) calendarMinDate!: Date;
  @Input({ required: true }) calendarMaxDate!: Date;
  @Input({ required: true }) selectedDate!: Date;
  @Output() readonly selectedDateChange = new EventEmitter<Date>();

  protected panelOpen = false;
  protected panelMonth: Date = startOfDay(new Date());
  protected fieldFocused = false;
  protected hoverDateRevealed = false;
  protected selectionAnnouncement = '';

  private hoverRevealTimer: ReturnType<typeof setTimeout> | null = null;

  readonly weekdayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

  readonly monthNavButtonClass =
    'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-border border-0 bg-transparent text-muted-color hover:bg-[color:var(--p-content-hover-background)] hover:text-[color:var(--p-text-hover-color)] focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--pip-nav-active-ink)] disabled:cursor-not-allowed disabled:opacity-40';

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
      return `Date, Today, ${formatted}`;
    }
    if (this.isSelectedYesterday) {
      return `Date, Yesterday, ${formatted}`;
    }
    return `Date, ${formatted}`;
  }

  get dialogAriaLabel(): string {
    return `Choose date, ${this.monthTitle}`;
  }

  get monthTitle(): string {
    return this.monthTitleLabel.format(this.panelMonth);
  }

  get monthGrid(): DashboardDatePickerCell[] {
    return buildMonthGrid(
      this.panelMonth.getFullYear(),
      this.panelMonth.getMonth(),
      this.viewerDay.date,
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
    afterNextRender(() => this.focusInitialDay(), { injector: this.injector });
  }

  closePanel(returnFocusToTrigger = false): void {
    this.panelOpen = false;
    this.cancelHoverReveal();
    if (returnFocusToTrigger) {
      afterNextRender(() => this.triggerRef?.nativeElement.focus(), { injector: this.injector });
    }
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
    if (!isSelectableCalendarDate(normalized, this.viewerDay.date)) {
      return;
    }

    this.selectionAnnouncement = `${this.calendarDayAriaLabel.format(normalized)} selected`;
    this.selectedDateChange.emit(normalized);
    this.closePanel(true);
  }

  isStoryDayCell(cell: DashboardDatePickerCell): boolean {
    return cell.inMonth && isSelectableCalendarDate(cell.date, this.viewerDay.date);
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

  cellDateKey(cell: DashboardDatePickerCell): string {
    return toDateKey(cell.date);
  }

  onDayKeydown(event: KeyboardEvent, date: Date): void {
    const offset = DashboardDatePickerComponent.ARROW_DAY_OFFSET[event.key];
    if (offset === undefined) {
      return;
    }

    event.preventDefault();
    const next = this.findSelectableDateInDirection(date, offset);
    if (next) {
      this.focusDay(next);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.panelOpen) {
      this.closePanel(true);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.panelOpen || event.key !== 'Tab') {
      return;
    }

    const panel = this.panelRef?.nativeElement;
    if (!panel) {
      return;
    }

    const focusable = panel.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const list = Array.from(focusable);
    if (list.length === 0) {
      return;
    }

    const first = list[0];
    const last = list[list.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
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

  private focusInitialDay(): void {
    if (isSelectableCalendarDate(this.selectedDate, this.viewerDay.date)) {
      this.focusDay(this.selectedDate);
      return;
    }

    const firstSelectable = this.monthGrid.find((cell) => cell.selectable);
    if (firstSelectable) {
      this.focusDay(firstSelectable.date);
    }
  }

  private focusDay(date: Date): void {
    const normalized = startOfDay(date);
    const inPanelMonth =
      normalized.getMonth() === this.panelMonth.getMonth() &&
      normalized.getFullYear() === this.panelMonth.getFullYear();

    if (!inPanelMonth) {
      this.panelMonth = new Date(normalized.getFullYear(), normalized.getMonth(), 1);
    }

    const dateKey = toDateKey(normalized);
    afterNextRender(() => {
      this.panelRef?.nativeElement
        .querySelector<HTMLButtonElement>(`button[data-date-key="${dateKey}"]:not([disabled])`)
        ?.focus();
    }, { injector: this.injector });
  }

  private findSelectableDateInDirection(from: Date, offset: number): Date | null {
    const step = offset > 0 ? 1 : -1;
    let candidate = startOfDay(from);

    for (let moved = 0; moved < Math.abs(offset); moved++) {
      candidate = addCalendarDays(candidate, step);
      if (!this.isDateInCalendarRange(candidate)) {
        return null;
      }
    }

    if (isSelectableCalendarDate(candidate, this.viewerDay.date)) {
      return candidate;
    }

    while (true) {
      const next = addCalendarDays(candidate, step);
      if (!this.isDateInCalendarRange(next)) {
        return null;
      }
      candidate = next;
      if (isSelectableCalendarDate(candidate, this.viewerDay.date)) {
        return candidate;
      }
    }
  }

  private isDateInCalendarRange(date: Date): boolean {
    const time = startOfDay(date).getTime();
    return (
      time >= startOfDay(this.calendarMinDate).getTime() &&
      time <= startOfDay(this.calendarMaxDate).getTime()
    );
  }
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildMonthGrid(
  year: number,
  month: number,
  viewerAnchor: Date,
): DashboardDatePickerCell[] {
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
      selectable: inMonth && isSelectableCalendarDate(normalized, viewerAnchor),
    });
  }

  return cells;
}
