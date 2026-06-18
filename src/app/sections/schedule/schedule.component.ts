import { Component, Input } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Dialog } from 'primeng/dialog';

import {
  CandidateProfile,
  ScheduleGroup,
  ScheduleInterview,
} from '../../models/dashboard.models';

interface ScheduleGroupConfig {
  key: ScheduleGroup;
  label: string;
}

@Component({
  selector: 'app-schedule',
  imports: [Button, Card, Dialog],
  templateUrl: './schedule.component.html',
})
export class ScheduleComponent {
  @Input({ required: true }) schedule: ScheduleInterview[] = [];
  @Input({ required: true }) candidates: CandidateProfile[] = [];

  dialogVisible = false;
  selectedCandidate: CandidateProfile | null = null;

  readonly groupConfigs: ScheduleGroupConfig[] = [
    { key: 'today', label: 'Today' },
    { key: 'tomorrow', label: 'Tomorrow' },
    { key: 'this-week', label: 'This week' },
  ];

  interviewsForGroup(group: ScheduleGroup): ScheduleInterview[] {
    return this.schedule.filter((interview) => interview.group === group);
  }

  candidateFor(interview: ScheduleInterview): CandidateProfile | undefined {
    return this.candidates.find((candidate) => candidate.id === interview.candidateId);
  }

  openCandidate(candidateId: string): void {
    const candidate = this.candidates.find((entry) => entry.id === candidateId);
    if (!candidate) {
      return;
    }

    this.selectedCandidate = candidate;
    this.dialogVisible = true;
  }

  closeCandidateDialog(): void {
    this.dialogVisible = false;
    this.selectedCandidate = null;
  }
}
