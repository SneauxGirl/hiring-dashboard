import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

import { DashboardWeekKey } from '../../data/dashboard-weeks.mock';
import { DashboardUser } from '../../models/dashboard.models';

@Component({
  selector: 'app-page-header',
  imports: [FormsModule, Select],
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
  @Input({ required: true }) user!: DashboardUser;
  @Input({ required: true }) weeks!: ReadonlyArray<{ key: DashboardWeekKey; label: string }>;
  @Input({ required: true }) selectedWeek!: DashboardWeekKey;
  @Output() readonly selectedWeekChange = new EventEmitter<DashboardWeekKey>();

  get firstName(): string {
    return this.user.name.trim().split(/\s+/)[0] ?? this.user.name;
  }

  get timeGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning, ';
    }
    if (hour < 17) {
      return 'Good afternoon, ';
    }
    return 'Good evening, ';
  }

  onWeekChange(key: DashboardWeekKey): void {
    this.selectedWeekChange.emit(key);
  }
}
