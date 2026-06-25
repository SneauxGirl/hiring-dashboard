import { Component, EventEmitter, HostBinding, Input, Output, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

import {
  DASHBOARD_NAV_ITEMS,
  DASHBOARD_NAV_MENU_PT,
  DASHBOARD_NAV_MENU_STYLE_CLASS,
} from '../../config/dashboard-nav.config';
import { DashboardUser } from '../../models/dashboard.models';

@Component({
  selector: 'app-sidebar-nav',
  imports: [Menu],
  templateUrl: './sidebar-nav.component.html',
  host: {
    class:
      'sidebar-shell w-[length:var(--sidebar-width)] [&.sidebar-shell--collapsed]:w-[length:var(--sidebar-width-collapsed)] hidden md:flex md:sticky md:top-0 md:h-screen md:shrink-0 md:self-start md:overflow-hidden md:transition-[width] md:duration-200 md:ease-out',
  },
})
export class SidebarNavComponent {
  readonly navMenuStyleClass = `${DASHBOARD_NAV_MENU_STYLE_CLASS} mt-6 flex-1`;
  readonly navMenuPt = DASHBOARD_NAV_MENU_PT;

  @ViewChild(Menu) private navMenu?: Menu;

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
      title: this.collapsed ? item.label : undefined,
      styleClass: item.active ? 'nav-item--active' : undefined,
      command: () => this.resetNavFocus(),
    }));
  }

  private resetNavFocus(): void {
    queueMicrotask(() => this.navMenu?.onListBlur(new FocusEvent('blur')));
  }

  get toggleLabel(): string {
    return this.collapsed ? 'Expand navigation' : 'Collapse navigation';
  }
}
