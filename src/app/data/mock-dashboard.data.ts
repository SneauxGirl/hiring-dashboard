/**
 * Pipeline dashboard mock data — edit values here.
 */
import { DashboardData } from '../models/dashboard.models';

export const MOCK_DASHBOARD: DashboardData = {
  user: { name: 'Alex Rivera', title: 'Hiring Manager' },
  navItems: [
    { id: 'overview', label: 'Overview', icon: 'pi pi-home', active: true },
    { id: 'requisitions', label: 'Requisitions', icon: 'pi pi-briefcase' },
    { id: 'candidates', label: 'Candidates', icon: 'pi pi-users' },
    { id: 'interviews', label: 'Interviews', icon: 'pi pi-calendar' },
    { id: 'sourcing', label: 'Sourcing', icon: 'pi pi-search' },
    { id: 'reports', label: 'Reports', icon: 'pi pi-chart-bar' },
    { id: 'settings', label: 'Settings', icon: 'pi pi-cog' },
  ],
  kpis: [
    {
      label: 'Open Requisitions',
      value: 8,
      delta: '2 this month',
      trend: 'up',
      colorToken: 'bright-blue',
    },
    {
      label: 'Average Time To Fill',
      value: 34,
      valueUnit: 'days',
      delta: '5 days',
      trend: 'down',
      colorToken: 'electric-violet',
    },
    {
      label: 'Offer Acceptance Rate',
      value: 87,
      valueUnit: '%',
      delta: '6% this month',
      trend: 'up',
      colorToken: 'orange-red',
    },
    {
      label: 'Expected Hires This Month',
      value: 6,
      delta: 'No change',
      trend: 'neutral',
      colorToken: 'vivid-pink',
    },
  ],
  schedule: [
    {
      id: '1',
      timeLabel: '10:00 AM',
      group: 'today',
      candidateId: 'c-sarah-chen',
    },
    {
      id: '2',
      timeLabel: '1:30 PM',
      group: 'today',
      candidateId: 'c-mike-davis',
    },
    {
      id: '3',
      timeLabel: '3:00 PM',
      group: 'today',
      candidateId: 'c-emma-white',
    },
    {
      id: '4',
      timeLabel: '11:00 AM',
      group: 'tomorrow',
      candidateId: 'c-james-patel',
    },
    {
      id: '5',
      timeLabel: 'Thu 10:30 AM',
      group: 'this-week',
      candidateId: 'c-olivia-brown',
    },
  ],
  candidates: [
    {
      id: 'c-sarah-chen',
      name: 'Sarah Chen',
      roleTitle: 'Senior Frontend Engineer',
      roleSpecs:
        '5+ years building responsive web apps with Angular or React. Leads UI implementation, mentors junior engineers, and partners with design on component systems.',
    },
    {
      id: 'c-mike-davis',
      name: 'Mike Davis',
      roleTitle: 'Product Designer',
      roleSpecs:
        'End-to-end product designer with strong UX research and visual design skills. Portfolio should show mobile-first flows and design-system work.',
    },
    {
      id: 'c-emma-white',
      name: 'Emma White',
      roleTitle: 'Marketing Manager',
      roleSpecs:
        'B2B marketing lead with campaign strategy, demand gen, and cross-functional launch experience. Comfortable owning pipeline metrics and content calendar.',
    },
    {
      id: 'c-james-patel',
      name: 'James Patel',
      roleTitle: 'Backend Engineer',
      roleSpecs:
        'Backend engineer focused on API design, data modeling, and service reliability. Experience with Node or Java and cloud-native deployment patterns.',
    },
    {
      id: 'c-olivia-brown',
      name: 'Olivia Brown',
      roleTitle: 'Data Analyst',
      roleSpecs:
        'Analyst who translates hiring and business data into dashboards and recommendations. SQL, spreadsheet modeling, and clear stakeholder communication required.',
    },
  ],
  bottlenecks: [
    {
      id: 'b1',
      title: 'Waiting On Me',
      subtitle: 'Feedback overdue',
      theme: 'alexandrite',
      candidateCount: 4,
      avgMetric: 6.2,
      avgLabel: 'avg delay',
    },
    {
      id: 'b2',
      title: 'Waiting On Recruiter',
      subtitle: 'Pending recruiter action',
      theme: 'magical',
      candidateCount: 6,
      avgMetric: 4.1,
      avgLabel: 'avg delay',
    },
    {
      id: 'b3',
      title: 'Candidates Aging > 14 Days',
      subtitle: 'No recent activity',
      theme: 'orange',
      candidateCount: 9,
      avgMetric: 17.3,
      avgLabel: 'avg idle time',
    },
  ],
  trends: {
    currentYear: 2026,
    priorYear: 2025,
    series: [
      {
        id: 'attrition',
        label: 'Attrition',
        colorToken: 'vivid-pink',
        currentYear: [16, 15, 14, 12, 11, 10, 9, 8, 7, 10, 13, 16],
        priorYear: [13, 12, 14, 11, 10, 10, 8, 7, 7, 9, 12, 16],
      },
      {
        id: 'promotions',
        label: 'Promotions',
        colorToken: 'bright-blue',
        currentYear: [5, 6, 8, 12, 15, 18, 19, 20, 22, 18, 14, 11],
        priorYear: [6, 7, 9, 11, 14, 18, 17, 19, 22, 16, 12, 11],
      },
      {
        id: 'transfers',
        label: 'Transfers',
        colorToken: 'alexandrite',
        currentYear: [4, 4, 5, 6, 8, 9, 10, 11, 12, 9, 7, 6],
        priorYear: [3, 4, 5, 7, 8, 9, 10, 11, 12, 8, 7, 6],
      },
      {
        id: 'backfills',
        label: 'Backfills',
        colorToken: 'orange',
        currentYear: [7, 8, 9, 11, 12, 14, 15, 16, 19, 15, 13, 12],
        priorYear: [8, 8, 9, 12, 13, 14, 16, 17, 19, 14, 11, 12],
      },
    ],
  },
  openRequisitions: [
    {
      id: 'r1',
      role: 'Senior Frontend Engineer',
      candidates: 14,
      stage: 'Final Round',
      daysOpen: 32,
      risk: 'low',
    },
    {
      id: 'r2',
      role: 'Product Designer',
      candidates: 8,
      stage: 'Interview',
      daysOpen: 45,
      risk: 'medium',
    },
    {
      id: 'r3',
      role: 'Marketing Manager',
      candidates: 4,
      stage: 'Screening',
      daysOpen: 61,
      risk: 'high',
    },
    {
      id: 'r4',
      role: 'Backend Engineer',
      candidates: 6,
      stage: 'Interview',
      daysOpen: 28,
      risk: 'low',
    },
    {
      id: 'r5',
      role: 'Data Analyst',
      candidates: 3,
      stage: 'Screening',
      daysOpen: 35,
      risk: 'medium',
    },
  ],
  funnelStages: [
    { stageKey: 'f0', label: 'Application', count: 3675, colorZone: 'blue' },
    { stageKey: 'f1', label: 'Review', count: 3273, conversionPct: 89.06, colorZone: 'blue' },
    { stageKey: 'f2', label: 'Assessment', count: 657, conversionPct: 20.07, colorZone: 'blue' },
    { stageKey: 'f3', label: 'Interview 1', count: 439, conversionPct: 66.82, colorZone: 'blue' },
    { stageKey: 'f4', label: 'Interview 2', count: 162, conversionPct: 36.9, colorZone: 'orange' },
    { stageKey: 'f5', label: 'Offer', count: 71, conversionPct: 43.83, colorZone: 'orange' },
    { stageKey: 'f6', label: 'Response', count: 71, conversionPct: 100, colorZone: 'orange' },
    { stageKey: 'f7', label: 'Start', count: 69, conversionPct: 97.18, colorZone: 'orange' },
  ],
  stageDurations: [
    { fromStage: 'f1', toStage: 'f0', days: 9, colorToken: 'chart-blue' },
    { fromStage: 'f2', toStage: 'f1', days: 3, colorToken: 'chart-blue' },
    { fromStage: 'f3', toStage: 'f2', days: 7, colorToken: 'chart-blue' },
    { fromStage: 'f4', toStage: 'f3', days: 9, colorToken: 'chart-purple' },
    { fromStage: 'f5', toStage: 'f4', days: 11, colorToken: 'attention' },
    { fromStage: 'f6', toStage: 'f5', days: 54, colorToken: 'attention' },
  ],
};
