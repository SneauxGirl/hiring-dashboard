import { Component, Input } from '@angular/core';
import { Card } from 'primeng/card';

import { OpenRequisition, OpenRequisitionsData } from '../../models/dashboard.models';
import { PipRiskLevel, PipStageTone } from '../../theme/pip-tokens';
import { riskPill, stagePill } from '../../theme/theme-colors';

@Component({
  selector: 'app-requisitions',
  imports: [Card],
  templateUrl: './requisitions.component.html',
})
export class RequisitionsComponent {
  @Input({ required: true }) requisitions!: OpenRequisitionsData;

  stageStyle(tone: PipStageTone): { bg: string; text: string } {
    return stagePill(tone);
  }

  riskStyle(level: PipRiskLevel): { bg: string; text: string } {
    return riskPill(level);
  }

  riskLabel(risk: OpenRequisition['risk']): string {
    return risk.charAt(0).toUpperCase() + risk.slice(1);
  }
}
