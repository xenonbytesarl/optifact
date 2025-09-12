import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { InputTextComponent } from '../../../shared/ui/input';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import {ReactiveFormsModule} from '@angular/forms';

export interface AttachmentTypeFormValue {
  name: string;
}

@Component({
  selector: 'app-attachment-type-form',
  standalone: true,
  imports: [CommonModule, TranslatePipe, InputTextComponent, FormFieldComponent, ReactiveFormsModule],
  template: `
    <form class="flex flex-col gap-3">
      <app-form-field
        [label]="('attachmentTypes.fields.name' | t)"
        [required]="true"
        [error]="nameRequiredError() ? ('validation.required' | t) : null"
      >
        <app-input [disabled]="disabled()" [error]="nameRequiredError()" [value]="value().name" (valueChange)="onName($event)" (blurred)="blur.emit()" />
      </app-form-field>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class AttachmentTypeFormComponent {
  disabled = input<boolean>(false);
  // Flag from parent to indicate whether to show the required error for name
  nameRequiredError = input<boolean>(false);

  value = model<AttachmentTypeFormValue>({ name: '' });
  submit = output<AttachmentTypeFormValue>();
  cancel = output<void>();
  blur = output<void>();

  onName(v: string | null) {
    const name = (v ?? '').toString();
    this.value.set({ ...this.value(), name });
  }
}
