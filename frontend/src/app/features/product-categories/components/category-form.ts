import { ChangeDetectionStrategy, Component, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { InputTextComponent } from '../../../shared/ui/input';
import { FormFieldComponent } from '../../../shared/ui/form-field';

export interface CategoryFormValue {
  name: string;
}

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, TranslatePipe, InputTextComponent, FormFieldComponent],
  template: `
    <form class="flex flex-col gap-3" (submit)="onSubmit()">
      <app-form-field [label]="('productCategories.fields.name' | t)" [required]="true">
        <app-input [value]="value().name" (valueChange)="onName($event)" />
      </app-form-field>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CategoryFormComponent {
  value = model<CategoryFormValue>({ name: '' });
  submit = output<CategoryFormValue>();
  cancel = output<void>();

  onName(v: string | null) {
    const name = (v ?? '').toString();
    this.value.set({ ...this.value(), name });
  }

  onSubmit() {
    const v = this.value();
    if ((v.name ?? '').trim().length === 0) return;
    this.submit.emit({ name: v.name.trim() });
  }
}
