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
import { EMPTY_SCHEDULE_COPY, PTO_SCHEDULE_COPY } from './schedule.catalog';
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
  @Input() todayGroupLabel = 'Today';
  @Input() viewingHistoricalDate = false;

  dialogVisible = false;
  selectedCandidate: CandidateProfile | null = null;

  readonly ptoCopy = PTO_SCHEDULE_COPY;
  readonly emptyCopy = EMPTY_SCHEDULE_COPY;

  readonly groupConfigs: ScheduleGroupConfig[] = [
    { key: 'today', label: 'Today' },
    { key: 'tomorrow', label: 'Tomorrow' },
    { key: 'this-week', label: 'Later This Week' },
  ];

  groupLabel(group: ScheduleGroupConfig): string {
    if (group.key === 'today') {
      return this.todayGroupLabel;
    }

    if (this.viewingHistoricalDate && group.key === 'tomorrow') {
      return 'Next Day';
    }

    if (this.viewingHistoricalDate && group.key === 'this-week') {
      return 'Rest of Week';
    }

    return group.label;
  }

  entriesForGroup(group: ScheduleGroup): ScheduleEntry[] {
    return this.schedule.filter((entry) => entry.group === group);
  }

  visibleGroups(): ScheduleGroupConfig[] {
    const withEntries = this.groupConfigs.filter(
      (group) => this.entriesForGroup(group.key).length > 0,
    );

    if (withEntries.length === 0) {
      return [...this.groupConfigs];
    }

    const groups = [...withEntries];
    if (!groups.some((group) => group.key === 'this-week')) {
      const thisWeek = this.groupConfigs.find((group) => group.key === 'this-week');
      if (thisWeek) {
        groups.push(thisWeek);
      }
    }

    return groups;
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
