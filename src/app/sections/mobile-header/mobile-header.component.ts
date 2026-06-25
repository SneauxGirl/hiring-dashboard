import { Component, Input, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Drawer } from 'primeng/drawer';
import { Menu } from 'primeng/menu';

import {
  DASHBOARD_DRAWER_PT,
  DASHBOARD_DRAWER_STYLE_CLASS,
  DASHBOARD_NAV_ITEMS,
  DASHBOARD_NAV_MENU_PT,
  DASHBOARD_NAV_MENU_STYLE_CLASS,
} from '../../config/dashboard-nav.config';
import { DashboardUser } from '../../models/dashboard.models';

@Component({
  selector: 'app-mobile-header',
  imports: [Drawer, Menu, Avatar],
  templateUrl: './mobile-header.component.html',
  host: { class: 'block md:hidden' },
})
export class MobileHeaderComponent {
  @ViewChild(Menu) private navMenu?: Menu;

  readonly drawerStyleClass = DASHBOARD_DRAWER_STYLE_CLASS;
  readonly drawerPt = DASHBOARD_DRAWER_PT;
  readonly navMenuStyleClass = DASHBOARD_NAV_MENU_STYLE_CLASS;
  readonly navMenuPt = DASHBOARD_NAV_MENU_PT;

  readonly iconBtnClass =
    'inline-flex size-[length:var(--dashboard-control-height)] shrink-0 cursor-pointer items-center justify-center rounded-[length:var(--p-content-border-radius)] border-0 bg-transparent p-0 leading-none hover:bg-[color:var(--p-content-hover-background)] focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--pip-nav-active-ink)]';

  @Input({ required: true }) user!: DashboardUser;

  drawerVisible = false;

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
}
