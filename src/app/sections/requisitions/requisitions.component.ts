import { Component, Input } from '@angular/core';
import { Card } from 'primeng/card';

import { OpenRequisition, OpenRequisitionsData } from '../../models/dashboard.models';
import { PipColor, PipRiskLevel } from '../../theme/pip-tokens';
import { paletteFill, paletteInk, paletteSolid } from '../../theme/theme-colors';
import { REQUISITIONS_DISPLAY_ROW_COUNT } from './requisitions.catalog';

const STAGE_PILL_COLORS: Record<string, PipColor> = {
  Screening: 'purple',
  Assessment: 'orange',
  Interview: 'purple',
  'Final Round': 'teal',
  Offer: 'pink',
};

@Component({
  selector: 'app-requisitions',
  imports: [Card],
  templateUrl: './requisitions.component.html',
})
export class RequisitionsComponent {
  @Input({ required: true }) requisitions!: OpenRequisitionsData;

  displayRows(): Array<OpenRequisition | null> {
    const rows: Array<OpenRequisition | null> = this.requisitions.items.slice(
      0,
      REQUISITIONS_DISPLAY_ROW_COUNT,
    );

    while (rows.length < REQUISITIONS_DISPLAY_ROW_COUNT) {
      rows.push(null);
    }

    return rows;
  }

  moreCount(): number {
    return this.requisitions.moreCount ?? 0;
  }

  stageStyle(stage: string): { bg: string; text: string } {
    const color = STAGE_PILL_COLORS[stage] ?? 'charcoal';
    return { bg: paletteFill(color), text: paletteInk(color) };
  }

  riskLabel(risk: OpenRequisition['risk']): string {
    return risk.charAt(0).toUpperCase() + risk.slice(1);
  }

  riskInk(level: PipRiskLevel): string | undefined {
    return level === 'high' ? paletteSolid('red') : undefined;
  }
}
