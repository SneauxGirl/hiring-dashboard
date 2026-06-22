import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Card } from 'primeng/card';
import { Menu } from 'primeng/menu';

import { DASHBOARD_NAV_ITEMS } from '../../config/dashboard-nav.config';
import { DashboardUser } from '../../models/dashboard.models';

@Component({
  selector: 'app-sidebar-nav',
  imports: [Card, Menu, Avatar],
  templateUrl: './sidebar-nav.component.html',
  host: {
    class:
      'sidebar-shell hidden md:flex md:sticky md:top-0 md:h-screen md:shrink-0 md:self-start md:overflow-hidden md:transition-[width] md:duration-200 md:ease-out',
  },
})
export class SidebarNavComponent {
  @Input({ required: true }) user!: DashboardUser;
  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();

  @HostBinding('class.sidebar-shell--collapsed')
  get collapsedHostClass(): boolean {
    return this.collapsed;
  }

  get menuModel(): MenuItem[] {
    return DASHBOARD_NAV_ITEMS.map((item) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      url: item.href,
      title: this.collapsed ? item.label : undefined,
      styleClass: item.active ? 'nav-item--active' : undefined,
    }));
  }

  get toggleLabel(): string {
    return this.collapsed ? 'Expand navigation' : 'Collapse navigation';
  }
}
