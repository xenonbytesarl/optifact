import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimLine } from '../../../core/api/claim.api';
import { BadgeComponent, BadgeTone } from '../../../shared/ui/badge';
import { TranslateService } from '../../../core/i18n/translate.service';
import { AppDateTimePipe } from '../../../shared/pipes/date-time.pipe';
import { DialogComponent } from '../../../shared/ui/dialog';
import { AttachmentDropzoneComponent } from '../../../shared/ui/attachment-dropzone';
import { ButtonComponent } from '../../../shared/ui/button';

@Component({
  selector: 'app-claim-lines-tab',
  standalone: true,
  imports: [CommonModule, BadgeComponent, AppDateTimePipe, DialogComponent, AttachmentDropzoneComponent, ButtonComponent],
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
      <app-dialog [(open)]="uploadDialogOpen" [backdropClosable]="true" [title]="i18n.t('claims.tabs.lines')">
        <div class="space-y-3">
          <div class="text-sm font-medium">{{ selectedLine()?.attachmentTypeName }}</div>
          <app-attachment-dropzone [(files)]="uploadFiles" [accept]="'image/*,.pdf'" [maxTotalSize]="5 * 1024 * 1024" />
        </div>
        <div dialog-actions class="flex flex-col sm:flex-row gap-2">
          <app-button variant="secondary" (clicked)="closeUploadDialog()">
            <span class="material-symbols-outlined text-base">close</span> {{ i18n.t('actions.cancel') }}
          </app-button>
          <app-button (clicked)="confirmUpload()">
            <span class="material-symbols-outlined text-base">cloud_upload</span> {{ i18n.t('claims.lines.uploadConfirm') || 'Transférer' }}
          </app-button>
        </div>
      </app-dialog>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ClaimLinesTabComponent {
  lines = input<ClaimLine[]>([]);
  readOnly = input<boolean>(false);
  // Dialog state
  uploadDialogOpen = signal(false);
  selectedLine = signal<ClaimLine | null>(null);
  uploadFiles = signal<File[]>([]);

  constructor(public i18n: TranslateService) {}

  openUploadDialog(line: ClaimLine) {
    this.selectedLine.set(line);
    this.uploadFiles.set([]);
    this.uploadDialogOpen.set(true);
  }

  closeUploadDialog() {
    this.uploadDialogOpen.set(false);
    this.uploadFiles.set([]);
  }

  confirmUpload() {
    const line = this.selectedLine();
    const files = this.uploadFiles();
    console.log('[ClaimLinesTab] Confirm upload', line?.id, files.map(f => f.name));
    if (!line || !files.length) {
      this.uploadDialogOpen.set(false);
      return;
    }
    // TODO: integrate with claims API/store to upload files for this line
    console.log('[ClaimLinesTab] Transfer files for line', line.id, files.map(f => f.name));
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
