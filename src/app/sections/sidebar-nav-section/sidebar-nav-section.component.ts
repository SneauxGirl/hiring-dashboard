import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Menu } from 'primeng/menu';

import { DashboardUser, NavItem } from '../../models/dashboard.models';

@Component({
  selector: 'app-sidebar-nav-section',
  imports: [Menu, Avatar],
  templateUrl: './sidebar-nav-section.component.html',
  host: {
    class:
      'sidebar-shell hidden md:flex md:sticky md:top-0 md:h-screen md:shrink-0 md:self-start md:overflow-hidden md:transition-[width] md:duration-200 md:ease-out',
  },
})
export class SidebarNavSectionComponent {
  @Input({ required: true }) navItems: NavItem[] = [];
  @Input({ required: true }) user!: DashboardUser;
  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();

  @HostBinding('class.sidebar-shell--collapsed')
  get collapsedHostClass(): boolean {
    return this.collapsed;
  }

  get menuModel(): MenuItem[] {
    return this.navItems.map((item) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      title: this.collapsed ? item.label : undefined,
      styleClass: item.active ? 'nav-item--active' : undefined,
    }));
  }

  get userInitials(): string {
    const parts = this.user.name.trim().split(/\s+/);
    return parts
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  get toggleLabel(): string {
    return this.collapsed ? 'Expand navigation' : 'Collapse navigation';
  }
}
