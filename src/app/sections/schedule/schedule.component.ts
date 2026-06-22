import { Component, Input } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Dialog } from 'primeng/dialog';

import {
  CandidateProfile,
  ScheduleEntry,
  ScheduleGroup,
  SchedulePtoEntry,
} from '../../models/dashboard.models';
import { PTO_SCHEDULE_COPY } from './schedule.catalog';
import { scheduleGroupColor } from '../../theme/theme-colors';

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
  @Input({ required: true }) schedule: ScheduleEntry[] = [];
  @Input({ required: true }) candidates: CandidateProfile[] = [];

  dialogVisible = false;
  selectedCandidate: CandidateProfile | null = null;

  readonly ptoCopy = PTO_SCHEDULE_COPY;

  readonly groupConfigs: ScheduleGroupConfig[] = [
    { key: 'today', label: 'Today' },
    { key: 'tomorrow', label: 'Tomorrow' },
    { key: 'this-week', label: 'This week' },
  ];

  entriesForGroup(group: ScheduleGroup): ScheduleEntry[] {
    return this.schedule.filter((entry) => entry.group === group);
  }

  isPto(entry: ScheduleEntry): entry is SchedulePtoEntry {
    return entry.kind === 'pto';
  }

  candidateFor(entry: ScheduleEntry): CandidateProfile | undefined {
    if (this.isPto(entry)) {
      return undefined;
    }

    return this.candidates.find((candidate) => candidate.id === entry.candidateId);
  }

  groupColor(group: ScheduleGroup): string {
    return scheduleGroupColor(group);
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
