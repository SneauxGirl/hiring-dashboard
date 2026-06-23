import { PipResponsibility } from '../../theme/pip-tokens';

export interface BottleneckDefinition {
  responsibility: PipResponsibility;
  title: string;
  titleLine2?: string;
  subtitle: string;
  avgLabel: string;
  iconClass: string;
}

export const BOTTLENECK_DEFINITIONS: readonly BottleneckDefinition[] = [
  {
    responsibility: 'waiting-on-me',
    title: 'Waiting On Me',
    subtitle: 'Feedback overdue',
    avgLabel: 'avg delay',
    iconClass: 'pi pi-clock',
  },
  {
    responsibility: 'waiting-on-recruiter',
    title: 'Waiting On Recruiter',
    subtitle: 'Pending recruiter action',
    avgLabel: 'avg delay',
    iconClass: 'pi pi-user',
  },
  {
    responsibility: 'candidates-aging',
    title: 'Candidates Aging',
    titleLine2: '> 14 Days',
    subtitle: 'No recent activity',
    avgLabel: 'avg idle time',
    iconClass: 'pi pi-calendar',
  },
] as const;
