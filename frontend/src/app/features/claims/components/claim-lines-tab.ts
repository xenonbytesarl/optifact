import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimLine } from '../../../core/api/claim.api';
import { BadgeComponent, BadgeTone } from '../../../shared/ui/badge';
import { TranslateService } from '../../../core/i18n/translate.service';
import { AppDateTimePipe } from '../../../shared/pipes/date-time.pipe';

@Component({
  selector: 'app-claim-lines-tab',
  standalone: true,
  imports: [CommonModule, BadgeComponent, AppDateTimePipe],
  template: `
    <div class="grid gap-3">
      @if (!lines().length) {
        <div class="text-sm text-muted">{{ i18n.t('claims.lines.empty') }}</div>
      } @else {
        @for (line of lines(); track line.id) {
          <div class="relative rounded border border-neutral-200 dark:border-neutral-800 p-3">
            <span class="material-symbols-outlined absolute -right-2 -top-3 text-xs text-neutral-200">verified</span>
            <div class="flex items-center justify-between mb-2">
              <div class="text-sm font-medium">#{{ line.attachmentTypeName ?? '—' }}</div>
              <app-badge [tone]="tone(line.status)">{{ getStatusLabel(line.status) }}</app-badge>
            </div>
            <div class="text-xs text-muted">{{ line.reason || '' }}</div>
            <div class="mt-2 grid grid-cols-2 gap-2 text-xs text-muted">
              <div>{{ i18n.t('claims.lines.createdAt') }}: {{ line.createdAt | appDateTime }}</div>
              <div>{{ i18n.t('claims.lines.validatedAt') }}: {{ line.validateAt | appDateTime }}</div>
              <div>{{ i18n.t('claims.lines.rejectedAt') }}: {{ line.rejectedAt | appDateTime }}</div>
              <div>{{ i18n.t('claims.lines.cancelledAt') }}: {{ line.cancelledAt | appDateTime }}</div>
            </div>
            @if (!readOnly()) {
              <div class="absolute right-2 bottom-2">
                <input type="file" class="hidden" [id]="'upload-'+line.id" multiple (change)="onFilesSelected($event, line)" accept="image/*,application/pdf" />
                <label [attr.for]="'upload-'+line.id" class="inline-flex items-center justify-center p-2 rounded-full bg-[var(--color-primary)] text-white shadow hover:opacity-90 cursor-pointer">
                  <span class="material-symbols-outlined text-base">upload</span>
                </label>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ClaimLinesTabComponent {
  lines = input<ClaimLine[]>([]);
  readOnly = input<boolean>(false);
  constructor(public i18n: TranslateService) {}

  onFilesSelected(event: Event, line: ClaimLine) {
    const input = event.target as HTMLInputElement | null;
    const files = input?.files;
    if (!files || files.length === 0) return;
    try {
      // Placeholder: integrate with claims API/store to actually upload and link to this line
      console.log('[ClaimLinesTab] Files selected for line', line.id, files.length);
    } finally {
      if (input) input.value = '';
    }
  }

  tone(status?: string | null): BadgeTone {
    switch (status) {
      case 'DRAFT': return 'neutral';
      case 'VALIDATED': return 'success';
      case 'REJECTED': return 'danger';
      case 'CANCELLED': return 'neutral';
      default: return 'neutral';
    }
  }

  getStatusLabel(status?: string | null) {
    // Ensure recompute on language change
    this.i18n.lang();
    switch (status) {
      case 'DRAFT': return this.i18n.t('claims.lines.status.draft');
      case 'UPLOADED': return this.i18n.t('claims.lines.status.uploaded');
      case 'VALIDATED': return this.i18n.t('claims.lines.status.validated');
      case 'REJECTED': return this.i18n.t('claims.lines.status.rejected');
      case 'CANCELLED': return this.i18n.t('claims.lines.status.cancelled');
      default: return '';
    }
  }
}
