import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Menu } from 'primeng/menu';
import type { ChartConfiguration } from 'chart.js';

import {
  WorkforceTrendSeries,
  WorkforceTrends,
} from '../../models/dashboard.models';
import { readChartColor, readThemeVar, paleChartColor, themeBorderColor } from '../../theme/theme-colors';

type TrendsViewMode = 'chart' | 'table';

interface QuarterRow {
  label: string;
  monthIndex: number;
}

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

const QUARTER_AXIS_LABELS: Record<number, string> = {
  2: 'Q1',
  5: 'Q2',
  8: 'Q3',
  11: 'Q4',
};

const QUARTER_ROWS: QuarterRow[] = [
  { label: 'Q1', monthIndex: 2 },
  { label: 'Q2', monthIndex: 5 },
  { label: 'Q3', monthIndex: 8 },
  { label: 'Q4', monthIndex: 11 },
];

@Component({
  selector: 'app-trends',
  imports: [Button, Card, Menu],
  templateUrl: './trends.component.html',
})
export class TrendsComponent implements OnDestroy {
  @Input({ required: true }) trends!: WorkforceTrends;
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private chart: import('chart.js').Chart<'line'> | null = null;

  viewMode: TrendsViewMode = 'chart';

  readonly monthLabels = MONTH_LABELS;
  readonly quarterRows = QUARTER_ROWS;

  /** Last month index (inclusive) that uses current-year data. */
  readonly currentMonthIndex = new Date().getMonth();

  constructor() {
    afterNextRender(() => {
      if (this.viewMode === 'chart') {
        this.createChart();
      }
    });
  }

  readonly viewMenuItems: MenuItem[] = [
    {
      label: 'Chart view',
      icon: 'pi pi-chart-line',
      command: () => this.setViewMode('chart'),
    },
    {
      label: 'Table view',
      icon: 'pi pi-table',
      command: () => this.setViewMode('table'),
    },
  ];

  ngOnDestroy(): void {
    this.destroyChart();
  }

  priorYearShort(): string {
    return String(this.trends.priorYear).slice(-2);
  }

  setViewMode(mode: TrendsViewMode): void {
    if (this.viewMode === mode) {
      return;
    }

    this.viewMode = mode;

    if (mode === 'chart' && isPlatformBrowser(this.platformId)) {
      requestAnimationFrame(() => this.createChart());
    } else {
      this.destroyChart();
    }
  }

  isPriorMonth(monthIndex: number): boolean {
    return monthIndex > this.currentMonthIndex;
  }

  valueForMonth(series: WorkforceTrendSeries, monthIndex: number): number {
    return this.isPriorMonth(monthIndex)
      ? series.priorYear[monthIndex]
      : series.currentYear[monthIndex];
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
          const color = readChartColor(series.colorToken);
          const paleColor = paleChartColor(series.colorToken);

          return {
            label: series.label,
            data: series.currentYear.map((_, monthIndex) =>
              monthIndex <= currentMonthIndex
                ? series.currentYear[monthIndex]
                : series.priorYear[monthIndex],
            ),
            borderColor: color,
            pointBackgroundColor: (ctx) =>
              (ctx.dataIndex ?? 0) > currentMonthIndex ? paleColor : color,
            pointBorderColor: '#fff',
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 2,
            borderWidth: 2.5,
            tension: 0.4,
            spanGaps: false,
            segment: {
              borderColor: (ctx) =>
                (ctx.p1DataIndex ?? 0) > currentMonthIndex ? paleColor : color,
              borderDash: (ctx) =>
                (ctx.p1DataIndex ?? 0) > currentMonthIndex ? [5, 4] : undefined,
              borderWidth: (ctx) => ((ctx.p1DataIndex ?? 0) > currentMonthIndex ? 1.5 : 2.5),
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
            titleFont: { family: this.fontFamily(), size: 14, weight: 'bold' },
            bodyFont: { family: this.fontFamily(), size: 14 },
            padding: 12,
            cornerRadius: 8,
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
              callback: (_value, index) => QUARTER_AXIS_LABELS[index] ?? '',
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
}
