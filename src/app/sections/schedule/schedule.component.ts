import { NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Card } from 'primeng/card';

import {
  dashboardCardStretchPt,
  dashboardCardStretchStyleClass,
} from '../../config/dashboard-layout';
import {
  addCalendarDays,
  isSameDay,
} from '../../data/dashboard-calendar-day.resolver';
import {
  CandidateProfile,
  ScheduleEntry,
  ScheduleGroup,
  SchedulePtoEntry,
} from '../../models/dashboard.models';
import {
  NA_SCHEDULE_COPY,
  PTO_SCHEDULE_COPY,
  SCHEDULE_VISIBLE_INTERVIEW_CAP,
} from './schedule.catalog';

interface ScheduleGroupConfig {
  key: ScheduleGroup;
  label: string;
}

@Component({
  selector: 'app-schedule',
  imports: [Card, NgTemplateOutlet],
  templateUrl: './schedule.component.html',
})
export class ScheduleComponent {
  readonly cardStyleClass = dashboardCardStretchStyleClass('schedule-card');
  readonly cardPt = dashboardCardStretchPt();

  @Input({ required: true }) schedule: ScheduleEntry[] = [];
  @Input({ required: true }) candidates: CandidateProfile[] = [];
  @Input({ required: true }) selectedDate!: Date;
  @Input({ required: true }) viewerDate!: Date;
  @Input() embedded = false;

  private readonly scheduleDayLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
  });

  readonly ptoCopy = PTO_SCHEDULE_COPY;
  readonly naCopy = NA_SCHEDULE_COPY;

  readonly groupConfigs: ScheduleGroupConfig[] = [
    { key: 'today', label: 'Today' },
    { key: 'tomorrow', label: 'Tomorrow' },
    { key: 'this-week', label: 'This Week' },
  ];

  groupLabel(group: ScheduleGroupConfig): string {
    if (isSameDay(this.selectedDate, this.viewerDate)) {
      return group.label;
    }

    switch (group.key) {
      case 'today':
        return this.formatScheduleDay(this.selectedDate);
      case 'tomorrow':
        return this.formatScheduleDay(addCalendarDays(this.selectedDate, 1));
      case 'this-week':
        return 'Remaining Week';
      default:
        return group.label;
    }
  }

  private formatScheduleDay(date: Date): string {
    const parts = this.scheduleDayLabel.formatToParts(date);
    const weekday = parts.find((part) => part.type === 'weekday')?.value ?? '';
    const month = parts.find((part) => part.type === 'month')?.value ?? '';
    const day = parts.find((part) => part.type === 'day')?.value ?? '';
    return `${weekday} ${month}/${day}`;
  }

  entriesForGroup(group: ScheduleGroup): ScheduleEntry[] {
    return this.schedule.filter((entry) => entry.group === group);
  }

  shouldShowGroup(group: ScheduleGroup): boolean {
    return this.budgetBeforeGroup(group) > 0;
  }

  visibleEntriesForGroup(group: ScheduleGroup): ScheduleEntry[] {
    const budget = this.budgetBeforeGroup(group);
    if (budget <= 0) {
      return [];
    }

    return this.entriesForGroup(group).slice(0, budget);
  }

  hasNextVisibleGroup(group: ScheduleGroup): boolean {
    const index = this.groupOrder.indexOf(group);
    return this.groupOrder.slice(index + 1).some((key) => this.shouldShowGroup(key));
  }

  hiddenInterviewCount(): number {
    let hidden = 0;

    for (const group of this.groupOrder) {
      const all = this.entriesForGroup(group);
      if (all.length === 0) {
        continue;
      }

      hidden += all.length - this.visibleEntriesForGroup(group).length;
    }

    return hidden;
  }

  private readonly groupOrder: ScheduleGroup[] = ['today', 'tomorrow', 'this-week'];

  private budgetBeforeGroup(group: ScheduleGroup): number {
    let remaining = SCHEDULE_VISIBLE_INTERVIEW_CAP;

    for (const key of this.groupOrder) {
      if (key === group) {
        break;
      }

      remaining -= this.slotsUsedByGroup(key);
    }

    return remaining;
  }

  private slotsUsedByGroup(group: ScheduleGroup): number {
    if (!this.shouldShowGroup(group)) {
      return 0;
    }

    const budget = this.budgetBeforeGroup(group);
    const all = this.entriesForGroup(group);

    if (all.length === 0) {
      return 1;
    }

    return Math.min(all.length, budget);
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
}
