import { Component } from '@angular/core';

import { MOCK_DASHBOARD } from '../../data/mock-dashboard.data';
import {
  HeaderSectionComponent,
  KpiSectionComponent,
  PageHeaderSectionComponent,
  SidebarNavSectionComponent,
} from '../../sections';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    HeaderSectionComponent,
    KpiSectionComponent,
    PageHeaderSectionComponent,
    SidebarNavSectionComponent,
  ],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage {
  readonly data = MOCK_DASHBOARD;
}
