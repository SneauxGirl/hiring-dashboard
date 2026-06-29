import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Menu } from 'primeng/menu';
import { ButtonPassThrough } from 'primeng/types/button';
import { MenuPassThrough } from 'primeng/types/menu';
import type { ChartConfiguration } from 'chart.js';

import {
  dashboardCardPanelPt,
  dashboardCardPanelStyleClass,
  DASHBOARD_SCROLL_CLIP_CLASS,
  DASHBOARD_SCROLL_X_CLASS,
} from '../../config/dashboard-layout';
import {
  TrendWeekData,
  WorkforceTrendSeries,
  WorkforceTrends,
} from '../../models/dashboard.models';
import { PipTrendMetricId } from '../../theme/pip-tokens';
import {
  readThemeVar,
  themeBorderColor,
  trendSeriesColor,
  trendSeriesPriorColor,
} from '../../theme/theme-colors';
import { TREND_METRIC_DEFINITIONS } from './trends.catalog';

type TrendsViewMode = 'chart' | 'table';

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** Chart x-axis: month labels at quarter-end positions (indices 2, 5, 8, 11). */
const CHART_AXIS_LABELS: Record<number, string> = {
  2: 'Mar',
  5: 'Jun',
  8: 'Sep',
  11: 'Dec',
};

@Component({
  selector: 'app-trends',
  imports: [Button, Card, Menu],
  templateUrl: './trends.component.html',
})
export class TrendsComponent implements OnChanges, OnDestroy {
  readonly cardStyleClass = dashboardCardPanelStyleClass('trends-card');
  readonly cardPt = dashboardCardPanelPt();
  readonly scrollClipClass = DASHBOARD_SCROLL_CLIP_CLASS;
  readonly scrollXClass = DASHBOARD_SCROLL_X_CLASS;

  @Input({ required: true }) trendValues!: TrendWeekData;
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('viewMenu') viewMenu?: Menu;
  @ViewChild('tableScroll') tableScroll?: ElementRef<HTMLDivElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private chart: import('chart.js').Chart<'line'> | null = null;

  viewMode: TrendsViewMode = 'chart';
  viewMenuOpen = false;
  viewModeAnnouncement = '';
  canScrollTableLeft = false;
  canScrollTableRight = false;

  readonly menuButtonStyleClass =
    '!size-6 !min-w-6 !min-h-6 shrink-0 !p-0 rounded-border text-muted-color hover:text-color focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--pip-nav-active-ink)]';

  readonly viewMenuPt: MenuPassThrough = {
    item: (pt) => {
      const item = (pt as { context?: { item?: MenuItem } }).context?.item;
      return item?.styleClass?.includes('nav-item--active')
        ? { 'aria-checked': 'true' }
        : { 'aria-checked': 'false' };
    },
  };

  readonly tableScrollButtonClass =
    'inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-border border border-surface bg-surface-0 text-muted-color hover:bg-[color:var(--pip-nav-hover-bg)] hover:text-[color:var(--pip-nav-hover-ink)] active:bg-[color:var(--pip-nav-active-bg)] active:text-[color:var(--pip-nav-active-ink)] focus:outline-none focus-visible:bg-[color:var(--pip-nav-active-bg)] focus-visible:text-[color:var(--pip-nav-active-ink)] focus-visible:shadow-[inset_0_0_0_2px_var(--pip-nav-active-ink)] disabled:cursor-not-allowed disabled:opacity-40';

  readonly monthLabels = MONTH_LABELS;

  get trends(): WorkforceTrends {
    const calendarYear = this.trendValues.calendarYear;

    return {
      currentYear: calendarYear,
      priorYear: calendarYear - 1,
      asOfMonthIndex: this.trendValues.asOfMonthIndex,
      series: TREND_METRIC_DEFINITIONS.map((definition) => ({
        id: definition.id,
        label: definition.label,
        currentYear: [...this.trendValues.series[definition.id].currentYear],
        priorYear: [...this.trendValues.series[definition.id].priorYear],
      })),
    };
  }

  /** First month index that uses prior-year data (the in-progress month). */
  get currentMonthIndex(): number {
    return this.trendValues.asOfMonthIndex;
  }

  get chartOptionsAriaLabel(): string {
    const mode = this.viewMode === 'chart' ? 'chart view' : 'table view';
    return `Chart options, ${mode}`;
  }

  get menuButtonPt(): ButtonPassThrough {
    return {
      root: {
        'aria-haspopup': 'menu',
        'aria-expanded': this.viewMenuOpen,
        'aria-controls': 'trends-view-menu',
      },
    };
  }

  constructor() {
    this.syncViewMenuModel();
    afterNextRender(() => {
      if (this.viewMode === 'chart') {
        this.createChart();
      }
    });
  }

  viewMenuModel: MenuItem[] = [];

  private syncViewMenuModel(): void {
    this.viewMenuModel = [
      {
        id: 'chart',
        label: 'Chart view',
        icon: 'pi pi-chart-line',
        styleClass: this.viewMode === 'chart' ? 'nav-item--active' : undefined,
        command: () => this.selectViewMode('chart'),
      },
      {
        id: 'table',
        label: 'Table view',
        icon: 'pi pi-table',
        styleClass: this.viewMode === 'table' ? 'nav-item--active' : undefined,
        command: () => this.selectViewMode('table'),
      },
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trendValues'] && !changes['trendValues'].firstChange && this.viewMode === 'chart') {
      if (isPlatformBrowser(this.platformId)) {
        requestAnimationFrame(() => this.createChart());
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  /** Clear stale Chart.js sizing and remeasure after funnel row height changes. */
  remeasureChart(): void {
    if (!isPlatformBrowser(this.platformId) || this.viewMode !== 'chart' || !this.chart) {
      return;
    }

    const canvas = this.chartCanvas?.nativeElement;
    if (!canvas) {
      return;
    }

    canvas.style.removeProperty('height');
    canvas.style.removeProperty('width');
    canvas.parentElement?.style.removeProperty('height');

    requestAnimationFrame(() => this.chart?.resize());
  }

  priorYearShort(): string {
    return String(this.trends.priorYear).slice(-2);
  }

  setViewMode(mode: TrendsViewMode): void {
    if (this.viewMode === mode) {
      return;
    }

    this.viewMode = mode;
    this.viewModeAnnouncement =
      mode === 'chart' ? 'Showing chart view' : 'Showing table view';
    this.syncViewMenuModel();

    if (mode === 'chart' && isPlatformBrowser(this.platformId)) {
      requestAnimationFrame(() => this.createChart());
    } else {
      this.destroyChart();
      if (mode === 'table' && isPlatformBrowser(this.platformId)) {
        requestAnimationFrame(() => this.updateTableScrollState());
      }
    }
  }

  private selectViewMode(mode: TrendsViewMode): void {
    this.setViewMode(mode);
    queueMicrotask(() => this.viewMenu?.onListBlur(new FocusEvent('blur')));
  }

  onViewMenuShow(): void {
    this.viewMenuOpen = true;
  }

  onViewMenuHide(): void {
    this.viewMenuOpen = false;
  }

  isPriorMonth(monthIndex: number): boolean {
    return monthIndex >= this.currentMonthIndex;
  }

  valueForMonth(series: WorkforceTrendSeries, monthIndex: number): number {
    return this.isPriorMonth(monthIndex)
      ? series.priorYear[monthIndex]
      : series.currentYear[monthIndex];
  }

  seriesColor(metricId: WorkforceTrendSeries['id']): string {
    return trendSeriesColor(metricId as PipTrendMetricId);
  }

  scrollTableMonths(direction: -1 | 1): void {
    const container = this.tableScroll?.nativeElement;
    if (!container) {
      return;
    }

    const step = this.tableMonthScrollStep(container);
    if (step <= 0) {
      return;
    }

    container.scrollBy({ left: direction * step, behavior: 'smooth' });
    requestAnimationFrame(() => this.updateTableScrollState());
  }

  updateTableScrollState(): void {
    const container = this.tableScroll?.nativeElement;
    if (!container) {
      this.canScrollTableLeft = false;
      this.canScrollTableRight = false;
      return;
    }

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const epsilon = 1;
    this.canScrollTableLeft = container.scrollLeft > epsilon;
    this.canScrollTableRight = container.scrollLeft < maxScrollLeft - epsilon;
  }

  private tableMonthScrollStep(container: HTMLElement): number {
    const monthHeader = container.querySelector<HTMLElement>('thead th:nth-child(2)');
    return monthHeader?.offsetWidth ?? 0;
  }

  yearLabelForMonth(monthIndex: number): string {
    const year = this.isPriorMonth(monthIndex) ? this.trends.priorYear : this.trends.currentYear;
    return `${MONTH_LABELS[monthIndex]} '${String(year).slice(-2)}`;
  }

  private async createChart(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const canvas = this.chartCanvas?.nativeElement;
    if (!canvas) {
      return;
    }

    this.destroyChart();

    const {
      CategoryScale,
      Chart,
      Legend,
      LinearScale,
      LineController,
      LineElement,
      PointElement,
      Tooltip,
    } = await import('chart.js');

    Chart.register(
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      CategoryScale,
      Tooltip,
      Legend,
    );

    const config = this.buildChartConfig();
    this.chart = new Chart(canvas, config);
    requestAnimationFrame(() => this.chart?.resize());
  }

  private destroyChart(): void {
    this.chart?.destroy();
    this.chart = null;
  }

  private buildChartConfig(): ChartConfiguration<'line'> {
    const currentMonthIndex = this.currentMonthIndex;

    return {
      type: 'line',
      data: {
        labels: [...MONTH_LABELS],
        datasets: this.trends.series.map((series) => {
          const metricId = series.id as PipTrendMetricId;
          const color = trendSeriesColor(metricId);
          const priorColor = trendSeriesPriorColor(metricId);

          return {
            label: series.label,
            data: series.currentYear.map((_, monthIndex) =>
              monthIndex < currentMonthIndex
                ? series.currentYear[monthIndex]
                : series.priorYear[monthIndex],
            ),
            borderColor: color,
            pointBackgroundColor: (ctx) =>
              (ctx.dataIndex ?? 0) >= currentMonthIndex ? priorColor : color,
            pointBorderColor: '#fff',
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 2,
            borderWidth: 2.5,
            tension: 0.4,
            spanGaps: false,
            segment: {
              borderColor: (ctx) =>
                (ctx.p1DataIndex ?? 0) >= currentMonthIndex ? priorColor : color,
              borderDash: (ctx) =>
                (ctx.p1DataIndex ?? 0) >= currentMonthIndex ? [5, 4] : undefined,
              borderWidth: (ctx) => ((ctx.p1DataIndex ?? 0) >= currentMonthIndex ? 1.5 : 2.5),
            },
          };
        }),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              color: readThemeVar('text-color'),
              font: { family: this.fontFamily(), size: 14 },
            },
          },
          tooltip: {
            backgroundColor: readThemeVar('text-color'),
            titleFont: { family: this.fontFamily(), size: 14, weight: this.fontWeightStrong() },
            bodyFont: { family: this.fontFamily(), size: 14 },
            padding: 12,
            cornerRadius: 8,
            caretPadding: 16,
            callbacks: {
              title: (items) => {
                const monthIndex = items[0]?.dataIndex ?? 0;
                return this.yearLabelForMonth(monthIndex);
              },
              label: (ctx) => {
                const series = this.trends.series[ctx.datasetIndex];
                const monthIndex = ctx.dataIndex;
                const value = this.valueForMonth(series, monthIndex);
                return ` ${series.label}: ${value}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: this.gridColor() },
            ticks: {
              color: readThemeVar('text-muted-color'),
              font: { family: this.fontFamily(), size: 14 },
              maxRotation: 0,
              autoSkip: false,
              callback: (_value, index) => CHART_AXIS_LABELS[index] ?? '',
            },
          },
          y: {
            min: 0,
            max: 24,
            border: { display: false },
            grid: {
              color: this.gridColor(),
              tickLength: 0,
            },
            ticks: {
              stepSize: 6,
              color: readThemeVar('text-muted-color'),
              font: { family: this.fontFamily(), size: 14 },
              padding: 8,
            },
          },
        },
      },
    };
  }

  private gridColor(): string {
    return themeBorderColor();
  }

  private fontFamily(): string {
    if (!isPlatformBrowser(this.platformId)) {
      return 'sans-serif';
    }

    return getComputedStyle(document.documentElement).getPropertyValue('--font-body').trim();
  }

  private fontWeightStrong(): number {
    if (!isPlatformBrowser(this.platformId)) {
      return 700;
    }

    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--font-weight-bold')
      .trim();
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : 700;
  }
}
