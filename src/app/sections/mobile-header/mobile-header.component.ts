import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { Menu } from 'primeng/menu';

import { DashboardUser, NavItem } from '../../models/dashboard.models';
import { brandIndigo } from '../../theme/theme-colors';

@Component({
  selector: 'app-mobile-header',
  imports: [Button, Drawer, Menu, Avatar],
  templateUrl: './mobile-header.component.html',
  host: { class: 'block md:hidden' },
})
export class MobileHeaderComponent {
  readonly wordmarkColor = brandIndigo();

  @Input({ required: true }) user!: DashboardUser;
  @Input({ required: true }) navItems: NavItem[] = [];

  drawerVisible = false;

  get menuItems(): MenuItem[] {
    return this.navItems.map((item) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      styleClass: item.active ? 'nav-item--active' : undefined,
      command: () => this.closeDrawer(),
    }));
  }

  get userInitials(): string {
    const parts = this.user.name.trim().split(/\s+/);
    return parts
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  openDrawer(): void {
    this.drawerVisible = true;
  }

  closeDrawer(): void {
    this.drawerVisible = false;
  }
}
