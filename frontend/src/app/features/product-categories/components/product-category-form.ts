import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { InputTextComponent } from '../../../shared/ui/input';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import {ReactiveFormsModule} from '@angular/forms';

export interface CategoryFormValue {
  name: string;
}

@Component({
  selector: 'app-product-category-form',
  standalone: true,
  imports: [CommonModule, TranslatePipe, InputTextComponent, FormFieldComponent, ReactiveFormsModule],
  template: `
    <form class="flex flex-col gap-3">
      <app-form-field [label]="('productCategories.fields.name' | t)" [required]="true">
        <app-input [disabled]="disabled()" [value]="value().name" (valueChange)="onName($event)" />
      </app-form-field>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductCategoryFormComponent {
  disabled = input<boolean>(false);
  value = model<CategoryFormValue>({ name: '' });
  submit = output<CategoryFormValue>();
  cancel = output<void>();

  onName(v: string | null) {
    const name = (v ?? '').toString();
    this.value.set({ ...this.value(), name });
  }
}
