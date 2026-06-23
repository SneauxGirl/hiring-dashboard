import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Drawer } from 'primeng/drawer';
import { Menu } from 'primeng/menu';
import { Select } from 'primeng/select';

import { DASHBOARD_NAV_ITEMS } from '../../config/dashboard-nav.config';
import { DashboardWeekKey } from '../../data/dashboard-weeks.mock';
import { DashboardUser } from '../../models/dashboard.models';

@Component({
  selector: 'app-mobile-header',
  imports: [Drawer, FormsModule, Menu, Avatar, Select],
  templateUrl: './mobile-header.component.html',
  host: { class: 'block md:hidden' },
})
export class MobileHeaderComponent {
  @ViewChild(Menu) private navMenu?: Menu;
  @ViewChild('weekDrawerSelect') private weekDrawerSelect?: Select;

  @Input({ required: true }) user!: DashboardUser;
  @Input({ required: true }) weeks!: ReadonlyArray<{ key: DashboardWeekKey; label: string }>;
  @Input({ required: true }) selectedWeek!: DashboardWeekKey;
  @Output() readonly selectedWeekChange = new EventEmitter<DashboardWeekKey>();

  drawerVisible = false;
  weekDrawerVisible = false;

  get menuItems(): MenuItem[] {
    return DASHBOARD_NAV_ITEMS.map((item) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      styleClass: item.active ? 'nav-item--active' : undefined,
      command: () => {
        queueMicrotask(() => this.navMenu?.onListBlur(new FocusEvent('blur')));
        this.closeDrawer();
      },
    }));
  }

  openDrawer(): void {
    this.drawerVisible = true;
  }

  closeDrawer(): void {
    this.drawerVisible = false;
  }

  openWeekDrawer(): void {
    this.weekDrawerVisible = true;
  }

  onWeekDrawerShow(): void {
    queueMicrotask(() => this.weekDrawerSelect?.hide());
  }

  onWeekDrawerHide(): void {
    this.weekDrawerSelect?.hide();
    this.weekDrawerVisible = false;
  }

  closeWeekDrawer(): void {
    this.weekDrawerVisible = false;
  }

  onWeekChange(key: DashboardWeekKey): void {
    this.selectedWeekChange.emit(key);
    if (this.weekDrawerVisible) {
      this.closeWeekDrawer();
    }
  }
}
