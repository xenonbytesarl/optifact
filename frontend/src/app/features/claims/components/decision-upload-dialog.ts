import { ChangeDetectionStrategy, Component, computed, inject, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from '../../../shared/ui/dialog';
import { AttachmentDropzoneComponent } from '../../../shared/ui/attachment-dropzone';
import { ButtonComponent } from '../../../shared/ui/button';
import { SpinnerComponent } from '../../../shared/ui/spinner';
import { TranslateService } from '../../../core/i18n/translate.service';

export type DecisionAction = 'granted' | 'refused';

export interface DecisionUploadPayload {
  claimId: string;
  files: File[];
  action: DecisionAction;
}

@Component({
  selector: 'app-decision-upload-dialog',
  standalone: true,
  imports: [CommonModule, DialogComponent, AttachmentDropzoneComponent, ButtonComponent, SpinnerComponent],
  template: `
    <app-dialog [(open)]="open" [backdropClosable]="!uploading()" [title]="dialogTitle()">
      <div class="space-y-3">
        <app-attachment-dropzone [(files)]="files" [multiple]="false" [accept]="accept()" [maxTotalSize]="maxTotalSize()" />
        @if (uploading()) {
          <div class="mt-2 flex items-center gap-2 text-sm text-muted">
            <app-spinner [overlay]="true" />
          </div>
        }
      </div>
      <div dialog-actions class="flex flex-col sm:flex-row gap-2">
        <app-button variant="secondary" icon="close" [label]="i18n.t('actions.cancel')" (clicked)="onCancel()" [disabled]="uploading()" />
        <app-button icon="check_circle" [label]="confirmLabel()" [disabled]="disableConfirm() || uploading()" (clicked)="onConfirm()" />
      </div>
    </app-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DecisionUploadDialogComponent {
  // two-way open
  open = model<boolean>(false);
  // inputs
  claimId = input<string>('');
  action = input<DecisionAction>('granted');
  // local files
  files = signal<File[]>([]);
  accept = input<string>('image/*,.pdf');
  maxTotalSize = input<number>(30 * 1024 * 1024);

  // state
  uploading = signal(false);

  // events
  confirm = output<DecisionUploadPayload>();
  cancelled = output<void>();

  constructor(public i18n: TranslateService) {}

  dialogTitle = computed(() => this.action() === 'granted' ? (this.i18n.t('claims.decision.grantTitle') || 'Accorder la décision') : (this.i18n.t('claims.decision.refuseTitle') || 'Refuser la décision'));
  confirmLabel = computed(() => this.action() === 'granted' ? (this.i18n.t('actions.grant') || 'Accorder') : (this.i18n.t('actions.reject') || 'Refuser'));
  disableConfirm = computed(() => this.files().length !== 1);

  onCancel() {
    if (this.uploading()) return;
    this.files.set([]);
    this.open.set(false);
    this.cancelled.emit();
  }

  onConfirm() {
    const files = this.files();
    const claimId = this.claimId();
    if (!files || files.length === 0 || !claimId) {
      this.open.set(false);
      return;
    }
    this.uploading.set(true);
    // Let the parent handle the upload; we just emit the payload
    const payload: DecisionUploadPayload = { claimId, files, action: this.action() };
    this.uploading.set(false);
    this.files.set([]);
    this.open.set(false);
    this.confirm.emit(payload);
  }
}
