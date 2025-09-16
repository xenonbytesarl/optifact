import {ChangeDetectionStrategy, Component, computed, input, model, output, signal, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from '../../../shared/ui/dialog';
import { AttachmentDropzoneComponent } from '../../../shared/ui/attachment-dropzone';
import { ButtonComponent } from '../../../shared/ui/button';
import { SpinnerComponent } from '../../../shared/ui/spinner';
import { TranslateService } from '../../../core/i18n/translate.service';
import {AttachmentTransfert, ClaimLine} from '../../../core/api/claim.api';
import { ToastService } from '../../../shared/ui/toast';
import { claimStore } from '../claim.store';

@Component({
  selector: 'app-claim-line-upload-dialog',
  standalone: true,
  imports: [CommonModule, DialogComponent, AttachmentDropzoneComponent, ButtonComponent, SpinnerComponent],
  template: `
    <app-dialog [(open)]="open" [backdropClosable]="!uploading()" [title]="i18n.t('claims.tabs.lines')">
      <div class="space-y-3">
        <div class="text-sm font-medium">{{ line()?.attachmentTypeName }}</div>
        <app-attachment-dropzone [(files)]="files" [multiple]="true" [accept]="accept()" [maxTotalSize]="maxTotalSize()" />
        @if (uploading()) {
          <div class="mt-2 flex items-center gap-2 text-sm text-muted">
            <app-spinner [overlay]="true" />
          </div>
        }
      </div>
      <div dialog-actions class="flex flex-col sm:flex-row gap-2">
        <app-button variant="secondary" icon="close" [label]="i18n.t('actions.cancel')" (clicked)="onCancel()" [disabled]="uploading()" />
        <app-button icon="cloud_upload" [label]="i18n.t('claims.lines.uploadConfirm') || 'Transférer'" [disabled]="disableTransfertButton() || uploading()" (clicked)="onConfirm()" />
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
  maxTotalSize = input<number>(30 * 1024 * 1024);

  claimId = input<string>('');

  // loading state for transfer
  uploading = signal(false);

  disableTransfertButton = computed(() => this.files().length <= 0);

  // events
  confirm = output<AttachmentTransfert>();
  cancelled = output<void>();

  private store = inject(claimStore);
  private toast = inject(ToastService);
  constructor(public i18n: TranslateService) {}


  onCancel() {
    if (this.uploading()) return; // guard while uploading
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
    this.uploading.set(true);
    const payload: AttachmentTransfert = { claimLine, files, claimId: this.claimId() };
    this.store.transfertAttachmentWithProgress(payload).subscribe({
      next: (event: any) => {
        // As soon as we receive the final response, close and emit
        if (event?.type === 4) { // HttpEventType.Response
          this.uploading.set(false);
          this.files.set([]);
          this.open.set(false);
          this.confirm.emit(payload);
        }
      },
      error: (err: any) => {
        this.uploading.set(false);
        const msg = (err?.error?.reason || err?.message || this.i18n.t('common.error'));
        this.toast.error(msg);
      }
    });
  }
}
