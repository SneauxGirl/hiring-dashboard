/**
 * Pipeline dashboard mock data — edit values here.
 */
import { DashboardData } from '../models/dashboard.models';

export const MOCK_DASHBOARD: DashboardData = {
  user: { name: 'Alex Rivera', title: 'Hiring Manager', avatarUrl: '/user-avatar.png' },
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
    },
    {
      label: 'Average Time To Fill',
      value: 34,
      valueUnit: 'days',
      delta: '5 days',
      trend: 'down',
    },
    {
      label: 'Offer Acceptance Rate',
      value: 87,
      valueUnit: '%',
      delta: '6% this month',
      trend: 'up',
    },
    {
      label: 'Expected Hires This Month',
      value: 6,
      delta: 'No change',
      trend: 'neutral',
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
      responsibility: 'waiting-on-me',
      candidateCount: 4,
      avgMetric: 6.2,
      avgLabel: 'avg delay',
    },
    {
      id: 'b2',
      title: 'Waiting On Recruiter',
      subtitle: 'Pending recruiter action',
      responsibility: 'waiting-on-recruiter',
      candidateCount: 6,
      avgMetric: 4.1,
      avgLabel: 'avg delay',
    },
    {
      id: 'b3',
      title: 'Candidates Aging > 14 Days',
      subtitle: 'No recent activity',
      responsibility: 'candidates-aging',
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
        currentYear: [16, 15, 14, 12, 11, 10, 9, 8, 7, 10, 13, 16],
        priorYear: [13, 12, 14, 11, 10, 10, 8, 7, 7, 9, 12, 16],
      },
      {
        id: 'promotions',
        label: 'Promotions',
        currentYear: [5, 6, 8, 12, 15, 18, 19, 20, 22, 18, 14, 11],
        priorYear: [6, 7, 9, 11, 14, 18, 17, 19, 22, 16, 12, 11],
      },
      {
        id: 'transfers',
        label: 'Transfers',
        currentYear: [4, 4, 5, 6, 8, 9, 10, 11, 12, 9, 7, 6],
        priorYear: [3, 4, 5, 7, 8, 9, 10, 11, 12, 8, 7, 6],
      },
      {
        id: 'backfills',
        label: 'Backfills',
        currentYear: [7, 8, 9, 11, 12, 14, 15, 16, 19, 15, 13, 12],
        priorYear: [8, 8, 9, 12, 13, 14, 16, 17, 19, 14, 11, 12],
      },
    ],
  },
  openRequisitions: {
    items: [
      {
        id: 'r1',
        role: 'Senior Frontend Engineer',
        candidates: 14,
        stage: 'Final Round',
        responsibility: 'waiting-on-me',
        daysOpen: 32,
        risk: 'low',
      },
      {
        id: 'r2',
        role: 'Product Designer',
        candidates: 8,
        stage: 'Interview',
        responsibility: 'waiting-on-recruiter',
        daysOpen: 45,
        risk: 'medium',
      },
      {
        id: 'r3',
        role: 'Marketing Manager',
        candidates: 4,
        stage: 'Screening',
        responsibility: 'candidates-aging',
        daysOpen: 61,
        risk: 'high',
      },
      {
        id: 'r4',
        role: 'Backend Engineer',
        candidates: 6,
        stage: 'Interview',
        responsibility: 'waiting-on-recruiter',
        daysOpen: 28,
        risk: 'low',
      },
      {
        id: 'r5',
        role: 'Data Analyst',
        candidates: 3,
        stage: 'Screening',
        responsibility: 'candidates-aging',
        daysOpen: 35,
        risk: 'medium',
      },
    ],
    moreCount: 3,
  },
  funnelStages: [
    { stageKey: 'h1', label: 'Applicants', count: 3675 },
    { stageKey: 'h2', label: 'Screened', count: 3273, conversionPct: 89.06 },
    { stageKey: 'h3', label: 'Assessment', count: 657, conversionPct: 20.07 },
    { stageKey: 'h4', label: 'Interviews', count: 439, conversionPct: 66.82 },
    { stageKey: 'h5', label: 'Offer', count: 71, conversionPct: 16.17 },
    { stageKey: 'h6', label: 'Hired', count: 69, conversionPct: 97.18 },
  ],
  stageDurations: [
    { fromStage: 'h0', toStage: 'h1', days: 9 },
    { fromStage: 'h1', toStage: 'h2', days: 8 },
    { fromStage: 'h2', toStage: 'h3', days: 16 },
    { fromStage: 'h3', toStage: 'h4', days: 11 },
    { fromStage: 'h4', toStage: 'h5', days: 55 },
    { fromStage: 'h5', toStage: 'h6', days: 2 },
  ],
};
