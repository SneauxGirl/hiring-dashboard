export const FUNNEL_STAGE_DEFINITIONS = [
  { stageKey: 'h1', label: 'Applicants' },
  { stageKey: 'h2', label: 'Screened' },
  { stageKey: 'h3', label: 'Assessment' },
  { stageKey: 'h4', label: 'Interviews' },
  { stageKey: 'h5', label: 'Offer' },
  { stageKey: 'h6', label: 'Hired' },
] as const;

export const FUNNEL_DURATION_SEGMENTS = [
  { fromStage: 'h0', toStage: 'h1' },
  { fromStage: 'h1', toStage: 'h2' },
  { fromStage: 'h2', toStage: 'h3' },
  { fromStage: 'h3', toStage: 'h4' },
  { fromStage: 'h4', toStage: 'h5' },
  { fromStage: 'h5', toStage: 'h6' },
] as const;
