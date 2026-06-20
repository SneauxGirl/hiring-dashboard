import { PipResponsibility, PipRiskLevel } from '../theme/pip-tokens';

export type KpiTrendDirection = 'up' | 'down' | 'neutral';

export interface KpiMetric {
  label: string;
  value: string | number;
  valueUnit?: string;
  delta?: string;
  trend?: KpiTrendDirection;
}

export type ScheduleGroup = 'today' | 'tomorrow' | 'this-week';

export interface ScheduleInterview {
  id: string;
  timeLabel: string;
  group: ScheduleGroup;
  candidateId: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  roleTitle: string;
  roleSpecs: string;
}

export interface WeekRangeOption {
  label: string;
  value: string;
}

export type BottleneckTheme = PipResponsibility;

export interface BottleneckCard {
  id: string;
  title: string;
  subtitle: string;
  responsibility: PipResponsibility;
  candidateCount: number;
  avgMetric: number;
  avgLabel: string;
}

export type WorkforceTrendMetricId = 'attrition' | 'promotions' | 'transfers' | 'backfills';

export interface WorkforceTrendSeries {
  id: WorkforceTrendMetricId;
  label: string;
  /** Twelve monthly values — index 0 = January. */
  currentYear: number[];
  /** Twelve monthly values — index 0 = January. */
  priorYear: number[];
}

export interface WorkforceTrends {
  currentYear: number;
  priorYear: number;
  series: WorkforceTrendSeries[];
}

export interface OpenRequisition {
  id: string;
  role: string;
  candidates: number;
  stage: string;
  responsibility: PipResponsibility;
  daysOpen: number;
  risk: PipRiskLevel;
}

export interface OpenRequisitionsData {
  items: OpenRequisition[];
  moreCount: number;
}

export interface FunnelStage {
  stageKey: string;
  label: string;
  count: number;
  conversionPct?: number;
}

export interface StageDuration {
  fromStage: string;
  toStage: string;
  days: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}

export interface DashboardUser {
  name: string;
  title: string;
  avatarUrl: string;
}

export interface DashboardData {
  user: DashboardUser;
  kpis: KpiMetric[];
  schedule: ScheduleInterview[];
  candidates: CandidateProfile[];
  bottlenecks: BottleneckCard[];
  trends: WorkforceTrends;
  openRequisitions: OpenRequisitionsData;
  funnelStages: FunnelStage[];
  stageDurations: StageDuration[];
  navItems: NavItem[];
}
