/** Max interview rows shown across Today → Tomorrow → This Week. */
export const SCHEDULE_VISIBLE_INTERVIEW_CAP = 4;

export const PTO_SCHEDULE_COPY = {
  timeLabel: 'All day',
  title: 'PTO',
  subtitle: 'Out of office',
  ariaLabel: 'Out of office',
} as const;

export const NA_SCHEDULE_COPY = {
  timeLabel: 'All day',
  title: 'None',
  ariaLabel: 'No interviews scheduled',
} as const;
