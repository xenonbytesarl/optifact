import {
  ChangeDetectionStrategy,
  Component,
  model,
  output,
  input, computed, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { InputTextComponent } from '../../../shared/ui/input';
import { InputNumberComponent } from '../../../shared/ui/input-number';
import {SelectComponent, SelectOption} from '../../../shared/ui/select';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import { ProductType } from '../../../core/api/products.api';
import {AutocompleteComponent, AutocompleteItem} from '../../../shared/ui/autocomplete';
import { InputCurrencyComponent } from '../../../shared/ui/input-currency';
import {CategoryFormValue} from '../../product-categories/components/product-category-form';
import {productCategoryStore} from '../../product-categories/product-category.store';
import {TranslateService} from '../../../core/i18n/translate.service';

export interface ProductFormValue {
  code: string;
  name: string;
  type: ProductType;
  amount?: number | null;
  rate?: number | null;
  categoryId?: string | null;
  description?: string | null;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, TranslatePipe, InputTextComponent, InputNumberComponent, InputCurrencyComponent, AutocompleteComponent, FormFieldComponent, SelectComponent],
  template: `
    <form class="flex flex-col gap-3">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <app-form-field [label]="('products.fields.code' | t)" [required]="true" [error]="codeRequiredError() ? ('validation.required' | t) : null">
          <app-input [disabled]="disabled()" [error]="codeRequiredError()" [value]="value().code" (valueChange)="onCode($event)" (blurred)="blurCode.emit()" />
        </app-form-field>
        <app-form-field [label]="('products.fields.name' | t)" [required]="true" [error]="nameRequiredError() ? ('validation.required' | t) : null">
          <app-input [disabled]="disabled()" [error]="nameRequiredError()" [value]="value().name" (valueChange)="onName($event)" (blurred)="blurName.emit()" />
        </app-form-field>

        <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
          <app-form-field [label]="('products.fields.category' | t)" [required]="true" [error]="categoryIdRequiredError() ? ('validation.required' | t) : null" >
            <app-autocomplete [disabled]="disabled()"   [placeholder]="('products.fields.selectCategory' | t)" [error]="categoryIdRequiredError()"
                               [items]="categoryItems()" [value]="value().categoryId ?? null" (valueChange)="onCategoryId($event)" (blurred)="blurCategory.emit()" />
          </app-form-field>
          <app-form-field [label]="('products.fields.type' | t)" [required]="true" [error]="typeRequiredError() ? ('validation.required' | t) : null">
            <app-select [disabled]="disabled()"  [options]="typeOptions()" [value]="value().type" (valueChange)="onType($event)" [error]="typeRequiredError()" (blurred)="blurType.emit()" />
          </app-form-field>
          @if (value().type === 'FLAT_AMOUNT') {
            <app-form-field [label]="('products.fields.amount' | t)" [hint]="('products.hints.amount' | t)" [error]="amountRequiredError() ? ('validation.required' | t) : null">
              <app-input-currency [disabled]="disabled()" [value]="value().amount ?? null" [currency]="'XAF'" [error]="amountRequiredError()" (valueChange)="onAmount($event)" (blurred)="blurAmount.emit()"/>
            </app-form-field>
          }
          @if (value().type === 'PERCENTAGE') {
            <app-form-field [label]="('products.fields.rate' | t)" [hint]="('products.hints.rate' | t)" [error]="rateRequiredError() ? ('validation.required' | t) : null">
              <app-input-number [disabled]="disabled()" [min]="0" [error]="rateRequiredError()" [max]="100" [step]="0.01" [value]="value().rate ?? null" (valueChange)="onRate($event)" (blurred)="blurRate.emit()"/>
            </app-form-field>
          }
        </div>
      </div>
      <app-form-field [label]="('products.fields.description' | t)">
        <textarea class="w-full  border border-token bg-surface text-fg placeholder-muted px-3 py-2 text-sm outline-none focus:ring-1 ring-primary shadow-sm min-h-24" [value]="value().description ?? ''" (input)="onDescription(($any($event.target)).value)"></textarea>
      </app-form-field>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductFormComponent {

  private categoryStore = inject(productCategoryStore);
  protected i18n = inject(TranslateService);

  disabled = input<boolean>(false);
  // Flag from parent to indicate whether to show the required error for name
  nameRequiredError = input<boolean>(false);
  codeRequiredError = input<boolean>(false);
  categoryIdRequiredError = input<boolean>(false);
  typeRequiredError = input<boolean>(false);
  rateRequiredError = input<boolean>(false);
  amountRequiredError = input<boolean>(false);
  value = model<ProductFormValue>({
    code: '',
    name: '',
    type: 'FLAT_AMOUNT',
    amount: null,
    rate: null,
    categoryId: null,
    description: ''
  });

  submit = output<CategoryFormValue>();
  cancel = output<void>();
  blurCode = output<void>();
  blurName = output<void>();
  blurCategory = output<void>();
  blurType = output<void>();
  blurRate = output<void>();
  blurAmount = output<void>();

  // Build type options from i18n so labels are translated
  typeOptions = computed<SelectOption[]>(() => {
    // depend on lang signal for recomputation
    this.i18n.lang();
    return [
      { value: 'FLAT_AMOUNT', label: this.i18n.t('products.types.forfait') },
      { value: 'PERCENTAGE', label: this.i18n.t('products.types.pourcentage') },
    ];
  });

  categoryItems = computed<AutocompleteItem[]>(() =>
    this.categoryStore.categoryPage().elements.map(c => ({ value: c.id, label: c.name }))
  );


  onCode(v: string | null) {
    const code = (v ?? '').toString();
    this.value.set({ ...this.value(), code });
  }

  onName(v: string | null) {
    const name = (v ?? '').toString();
    this.value.set({ ...this.value(), name });
  }

  onCategoryId(v: string | null) {
    const categoryId = (v ?? '').toString();
    this.value.set({ ...this.value(), categoryId });
  }

  onDescription(v: string | null) {
    const description = (v ?? '').toString();
    this.value.set({ ...this.value(), description });
  }

  onType(v: string | null) {
    const type = (v ?? 'FLAT_AMOUNT') as ProductType;
    this.value.set({ ...this.value(), type });
  }

  onRate(v: number | null) {
    const rate = (v ?? null);
    this.value.set({ ...this.value(), rate });
  }

  onAmount(v: number | null) {
    const amount = (v ?? null);
    this.value.set({ ...this.value(), amount });
  }

}
