import { DrawerPassThrough } from 'primeng/types/drawer';
import { MenuPassThrough } from 'primeng/types/menu';

export interface DashboardNavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}

/** Sidebar / mobile nav — not week-scoped mock data. */
export const DASHBOARD_NAV_ITEMS: readonly DashboardNavItem[] = [
  { id: 'overview', label: 'Overview', icon: 'pi pi-home', href: '/#overview', active: true },
  { id: 'requisitions', label: 'Requisitions', icon: 'pi pi-briefcase', href: '/#requisitions' },
  { id: 'candidates', label: 'Candidates', icon: 'pi pi-users', href: '/#candidates' },
  { id: 'interviews', label: 'Interviews', icon: 'pi pi-calendar', href: '/#interviews' },
  { id: 'sourcing', label: 'Sourcing', icon: 'pi pi-search', href: '/#sourcing' },
  { id: 'reports', label: 'Reports', icon: 'pi pi-chart-bar', href: '/#reports' },
  { id: 'settings', label: 'Settings', icon: 'pi pi-cog', href: '/#settings' },
] as const;

/** Shared p-menu shell — state colors stay in styles.css (`.dashboard-nav-menu`). */
export const DASHBOARD_NAV_MENU_STYLE_CLASS =
  'dashboard-nav-menu w-full min-w-0 max-w-full border-0 bg-transparent p-0';

export const DASHBOARD_NAV_MENU_PT: MenuPassThrough = {
  list: { class: 'flex w-full min-w-0 max-w-full flex-col gap-1 p-0' },
  item: { class: 'min-w-0 max-w-full' },
  itemContent: { class: 'min-w-0 max-w-full rounded-border' },
  itemLink: { class: 'box-border w-full min-w-0 max-w-full' },
};

export const DASHBOARD_DRAWER_STYLE_CLASS = '!w-[min(18rem,85vw)]';

export const DASHBOARD_DRAWER_PT: DrawerPassThrough = {
  header: { class: 'w-full p-[1.125rem]' },
};
