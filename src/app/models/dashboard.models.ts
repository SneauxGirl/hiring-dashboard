export type KpiColorToken =
  | 'bright-blue'
  | 'electric-violet'
  | 'orange-red'
  | 'vivid-pink';

export type KpiTrendDirection = 'up' | 'down' | 'neutral';

export interface KpiMetric {
  label: string;
  value: string | number;
  valueUnit?: string;
  delta?: string;
  trend?: KpiTrendDirection;
  colorToken: KpiColorToken;
}

export type ScheduleGroup = 'today' | 'tomorrow' | 'this-week';

export type ScheduleGroupColorToken = 'bright-blue' | 'electric-violet' | 'orange-red';

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

export type BottleneckTheme = 'alexandrite' | 'magical' | 'orange';

export interface BottleneckCard {
  id: string;
  title: string;
  subtitle: string;
  theme: BottleneckTheme;
  candidateCount: number;
  avgMetric: number;
  avgLabel: string;
}

export interface TrendPoint {
  period: string;
  value: number;
}

export interface TrendSeries {
  id: string;
  label: string;
  colorToken: 'notable-hue' | 'alexandrite' | 'magical';
  points: TrendPoint[];
}

export interface OpenRequisition {
  id: string;
  role: string;
  candidates: number;
  stage: string;
  daysOpen: number;
  risk: 'low' | 'medium' | 'high';
}

export interface FunnelStage {
  stageKey: string;
  label: string;
  count: number;
  conversionPct?: number;
  colorZone: 'blue' | 'orange';
}

export interface StageDuration {
  fromStage: string;
  toStage: string;
  days: number;
  colorToken: 'chart-blue' | 'chart-purple' | 'attention';
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
}

export interface DashboardData {
  user: DashboardUser;
  kpis: KpiMetric[];
  schedule: ScheduleInterview[];
  candidates: CandidateProfile[];
  bottlenecks: BottleneckCard[];
  trends: TrendSeries[];
  openRequisitions: OpenRequisition[];
  funnelStages: FunnelStage[];
  stageDurations: StageDuration[];
  navItems: NavItem[];
}
