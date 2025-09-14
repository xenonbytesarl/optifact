import { ChangeDetectionStrategy, Component, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from '../../../shared/ui/dialog';
import { AttachmentDropzoneComponent } from '../../../shared/ui/attachment-dropzone';
import { ButtonComponent } from '../../../shared/ui/button';
import { TranslateService } from '../../../core/i18n/translate.service';
import {AttachmentTransfert, ClaimLine} from '../../../core/api/claim.api';

@Component({
  selector: 'app-claim-line-upload-dialog',
  standalone: true,
  imports: [CommonModule, DialogComponent, AttachmentDropzoneComponent, ButtonComponent],
  template: `
    <app-dialog [(open)]="open" [backdropClosable]="true" [title]="i18n.t('claims.tabs.lines')">
      <div class="space-y-3">
        <div class="text-sm font-medium">{{ line()?.attachmentTypeName }}</div>
        <app-attachment-dropzone [(files)]="files" [accept]="accept()" [maxTotalSize]="maxTotalSize()" />
      </div>
      <div dialog-actions class="flex flex-col sm:flex-row gap-2">
        <app-button variant="secondary" (clicked)="onCancel()">
          <span class="material-symbols-outlined text-base">close</span> {{ i18n.t('actions.cancel') }}
        </app-button>
        <app-button (clicked)="onConfirm()">
          <span class="material-symbols-outlined text-base">cloud_upload</span> {{ i18n.t('claims.lines.uploadConfirm') || 'Transférer' }}
        </app-button>
      </div>
    </app-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimLineUploadDialogComponent {
  // two-way open
  open = model<boolean>(false);
  // selected line
  line = input<ClaimLine | null>(null);
  // files managed locally
  files = signal<File[]>([]);
  // configuration
  accept = input<string>('image/*,.pdf');
  maxTotalSize = input<number>(5 * 1024 * 1024);

  claimId = input<string>('');

  // events
  confirm = output<AttachmentTransfert>();
  cancelled = output<void>();

  constructor(public i18n: TranslateService) {}

  onCancel() {
    this.files.set([]);
    this.open.set(false);
    this.cancelled.emit();
  }

  onConfirm() {
    const claimLine = this.line();
    const files = this.files();
    if (!claimLine || !files.length) {
      this.open.set(false);
      return;
    }
    this.confirm.emit({ claimLine, files, claimId: this.claimId() });
    this.files.set([]);
    this.open.set(false);
  }
}
