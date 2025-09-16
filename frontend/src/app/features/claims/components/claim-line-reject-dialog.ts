import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '../../../shared/ui/dialog';
import { ButtonComponent } from '../../../shared/ui/button';
import { TranslateService } from '../../../core/i18n/translate.service';

@Component({
  selector: 'app-claim-line-reject-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogComponent, ButtonComponent],
  template: `
    <app-dialog
      [(open)]="open"
      [title]="titleText()"
      [backdropClosable]="false"
      [panelMaxWidth]="'480px'"
    >
      <div class="space-y-2">
        <div class="text-sm text-muted">{{ messageText() }}</div>
        <textarea
          class="w-full min-h-28 text-sm border border-token bg-transparent p-2 outline-none focus:ring-2 focus:ring-primary"
          [placeholder]="placeholderText()"
          [ngModel]="reasonText()"
          (ngModelChange)="reasonText.set($event)"
        ></textarea>
      </div>
      <div dialog-actions>
        <app-button variant="secondary" [label]="cancelText()" (clicked)="onCancel()" />
        <app-button class="ml-2" variant="danger" [disabled]="invalid()" [label]="okText()" (clicked)="onConfirm()" />
      </div>
    </app-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ClaimLineRejectDialogComponent {
  open = model<boolean>(false);
  confirm = output<string>();
  cancelled = output<void>();

  // two-way bind text using model() so computed reacts
  reasonText = model<string>('');

  // i18n inputs (optional override)
  title = input<string>('');
  message = input<string>('');
  okLabel = input<string>('');
  cancelLabel = input<string>('');
  placeholder = input<string>('');

  constructor(private i18n: TranslateService) {}

  titleText = computed(() => this.title() || this.i18n.t('claims.lines.reject.title'));
  messageText = computed(() => this.message() || this.i18n.t('claims.lines.reject.message'));
  okText = computed(() => this.okLabel() || this.i18n.t('actions.confirm'));
  cancelText = computed(() => this.cancelLabel() || this.i18n.t('actions.cancel'));
  placeholderText = computed(() => this.placeholder() || this.i18n.t('claims.lines.reject.placeholder'));

  invalid = computed(() => !this.reasonText() || this.reasonText().trim().length === 0);

  onCancel() {
    this.open.set(false);
    this.cancelled.emit();
    this.reasonText.set('');
  }

  onConfirm() {
    if (this.invalid()) return;
    const msg = this.reasonText().trim();
    this.open.set(false);
    this.confirm.emit(msg);
    this.reasonText.set('');
  }
}
