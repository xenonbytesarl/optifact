import {ChangeDetectionStrategy, Component, input, output, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AttachmentTransfert, ClaimLine} from '../../../core/api/claim.api';
import { BadgeComponent, BadgeTone } from '../../../shared/ui/badge';
import { TranslateService } from '../../../core/i18n/translate.service';
import { AppDateTimePipe } from '../../../shared/pipes/date-time.pipe';
import { ButtonComponent } from '../../../shared/ui/button';
import { ClaimLineUploadDialogComponent } from './claim-line-upload-dialog';

@Component({
  selector: 'app-claim-lines-tab',
  standalone: true,
  imports: [CommonModule, BadgeComponent, AppDateTimePipe, ButtonComponent, ClaimLineUploadDialogComponent],
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
              <div>{{ i18n.t('claims.lines.uploadedAt') }}: {{ line.uploadedAt | appDateTime }}</div>
              <div>{{ i18n.t('claims.lines.validatedAt') }}: {{ line.validateAt | appDateTime }}</div>
              <div>{{ i18n.t('claims.lines.rejectedAt') }}: {{ line.rejectedAt | appDateTime }}</div>
              <div>{{ i18n.t('claims.lines.cancelledAt') }}: {{ line.cancelledAt | appDateTime }}</div>
            </div>
            @if (!readOnly()) {
              <div class="absolute right-2 bottom-2">
                <app-button size="icon" shadow="none" variant="ghost" (clicked)="openUploadDialog(line)" aria-label="Upload">
                  <span class="material-symbols-outlined text-base">upload</span>
                </app-button>
              </div>
            }
          </div>
        }
      }

      <!-- Upload Dialog -->
      <app-claim-line-upload-dialog
        [(open)]="uploadDialogOpen"
        [line]="selectedLine()"
        [claimId]="claimId()"
        (confirm)="onDialogConfirm($event)"
        (cancelled)="closeUploadDialog()"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ClaimLinesTabComponent {
  lines = input<ClaimLine[]>([]);
  readOnly = input<boolean>(false);
  claimId = input<string>('');
  // Dialog state
  uploadDialogOpen = signal(false);
  selectedLine = signal<ClaimLine | null>(null);
  attachmentTransfert = output<AttachmentTransfert>()


  constructor(public i18n: TranslateService) {}

  openUploadDialog(line: ClaimLine) {
    this.selectedLine.set(line);
    this.uploadDialogOpen.set(true);
  }

  closeUploadDialog() {
    this.uploadDialogOpen.set(false);
  }

  onDialogConfirm(attachmentTransfert: AttachmentTransfert) {
    this.attachmentTransfert.emit(attachmentTransfert);
    this.closeUploadDialog();
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
