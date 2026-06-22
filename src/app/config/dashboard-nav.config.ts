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
