import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDateTimePipe } from '../../../shared/pipes/date-time.pipe';
import { TranslateService } from '../../../core/i18n/translate.service';
import { ClaimFormModel } from './claim-form';

@Component({
  selector: 'app-claim-audit-tab',
  standalone: true,
  imports: [CommonModule, AppDateTimePipe],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <div class="text-xs text-muted">{{ i18n.t('claims.fields.createdAt') }}</div>
        <div class="text-sm font-medium">{{ value().createdAt | appDateTime }}</div>
      </div>
      <div>
        <div class="text-xs text-muted">{{ i18n.t('claims.fields.submitAt') }}</div>
        <div class="text-sm font-medium">{{ value().submitAt | appDateTime }}</div>
      </div>
      <div>
        <div class="text-xs text-muted">{{ i18n.t('claims.fields.inInstructionAt') }}</div>
        <div class="text-sm font-medium">{{ value().inInstructionAt | appDateTime }}</div>
      </div>
      <div>
        <div class="text-xs text-muted">{{ i18n.t('claims.fields.doneAt') }}</div>
        <div class="text-sm font-medium">{{ value().instructionDoneAt | appDateTime }}</div>
      </div>
      <div>
        <div class="text-xs text-muted">{{ i18n.t('claims.fields.instructionRejectedAt') }}</div>
        <div class="text-sm font-medium">{{ value().instructionRejectedAt | appDateTime }}</div>
      </div>
      <div>
        <div class="text-xs text-muted">{{ i18n.t('claims.fields.compliantAt') }}</div>
        <div class="text-sm font-medium">{{ value().compliantAt | appDateTime }}</div>
      </div>
      <div>
        <div class="text-xs text-muted">{{ i18n.t('claims.fields.agreementGrantedAt') }}</div>
        <div class="text-sm font-medium">{{ value().agreementGrantedAt | appDateTime }}</div>
      </div>
      <div>
        <div class="text-xs text-muted">{{ i18n.t('claims.fields.agreementRefusedAt') }}</div>
        <div class="text-sm font-medium">{{ value().agreementRefusedAt | appDateTime }}</div>
      </div>
      <div>
        <div class="text-xs text-muted">{{ i18n.t('claims.fields.agreementAdjournedAt') }}</div>
        <div class="text-sm font-medium">{{ value().agreementAdjournedAt | appDateTime }}</div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimAuditTabComponent {
  value = input.required<ClaimFormModel>();
  constructor(public i18n: TranslateService) {}
}
