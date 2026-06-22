export const INTERVIEW_ALLOWED_STAGES = ['Interview', 'Final Round', 'Offer'] as const;

export type InterviewAllowedStage = (typeof INTERVIEW_ALLOWED_STAGES)[number];

export function canScheduleInterview(stage: string): stage is InterviewAllowedStage {
  return (INTERVIEW_ALLOWED_STAGES as readonly string[]).includes(stage);
}
