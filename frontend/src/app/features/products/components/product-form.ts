import { ChangeDetectionStrategy, Component, OnInit, computed, inject, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { InputTextComponent } from '../../../shared/ui/input';
import { InputNumberComponent } from '../../../shared/ui/input-number';
import {SelectComponent, SelectOption} from '../../../shared/ui/select';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import { ProductType } from '../../../core/api/products.api';
import { ProductCategoriesStore } from '../../product-categories/product-categories.store';
import { AutocompleteComponent, AutocompleteItem } from '../../../shared/ui/autocomplete';
import { InputCurrencyComponent } from '../../../shared/ui/input-currency';

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
    <form class="flex flex-col gap-3" (submit)="onSubmit()">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <app-form-field [label]="('products.fields.code' | t)" [required]="true">
          <app-input [value]="value().code" (valueChange)="onCode($event)" />
        </app-form-field>
        <app-form-field [label]="('products.fields.name' | t)" [required]="true">
          <app-input [value]="value().name" (valueChange)="onName($event)" />
        </app-form-field>

        <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
          <app-form-field [label]="('products.fields.category' | t)" [required]="true">
            <app-autocomplete [placeholder]="('products.fields.selectCategory' | t)"
                               [items]="categoryItems()" [value]="value().categoryId ?? null" (valueChange)="onCategory($event)" />
          </app-form-field>
          <app-form-field [label]="('products.fields.type' | t)" [required]="true">
            <app-select [options]="typeOptions()" [value]="value().type" (valueChange)="onType($event)" />
          </app-form-field>
          @if (value().type === 'forfait') {
            <app-form-field [label]="('products.fields.amount' | t)" [hint]="('products.hints.amount' | t)">
              <app-input-currency [value]="value().amount ?? null" [currency]="'XAF'" (valueChange)="onAmount($event)" />
            </app-form-field>
          }
          @if (value().type === 'pourcentage') {
            <app-form-field [label]="('products.fields.rate' | t)" [hint]="('products.hints.rate' | t)">
              <app-input-number [min]="0" [max]="100" [step]="0.01" [value]="value().rate ?? null" (valueChange)="onRate($event)" />
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
export class ProductFormComponent implements OnInit {
  value = model<ProductFormValue>({ code: '', name: '', type: 'forfait', amount: null, rate: null, categoryId: null, description: '' });
  submit = output<ProductFormValue>();
  cancel = output<void>();

  private categories = inject(ProductCategoriesStore);

  typeOptions = signal<SelectOption[]>([
    { value: 'forfait', label: 'Forfait' },
    { value: 'pourcentage', label: 'Pourcentage' },
  ]);

  categoryItems = computed<AutocompleteItem[]>(() =>
    this.categories.categories().map(c => ({ value: c.id, label: c.name }))
  );

  ngOnInit() {
    // ensure categories are loaded for the select
    this.categories.loadAll();
  }

  onCode(v: string | null) {
    this.value.set({ ...this.value(), code: (v ?? '').toString() });
  }
  onName(v: string | null) {
    this.value.set({ ...this.value(), name: (v ?? '').toString() });
  }
  onType(v: string | null) {
    const t = (v as ProductType) || 'forfait';
    this.value.set({ ...this.value(), type: t });
  }
  onCategory(v: string | null) {
    this.value.set({ ...this.value(), categoryId: v || null });
  }
  onAmount(v: number | null) {
    this.value.set({ ...this.value(), amount: v });
  }
  onRate(v: number | null) {
    this.value.set({ ...this.value(), rate: v });
  }
  onDescription(v: string | null) {
    this.value.set({ ...this.value(), description: (v ?? '').toString() });
  }

  onSubmit() {
    const v = this.value();
    const codeOk = !!v.code?.trim();
    const nameOk = !!v.name?.trim();
    const typeOk = v.type === 'forfait' || v.type === 'pourcentage';
    const catOk = !!v.categoryId;
    if (!codeOk || !nameOk || !typeOk || !catOk) return;
    // Normalize: clear opposite numeric
    const payload = { ...v };
    if (v.type === 'forfait') payload.rate = null;
    if (v.type === 'pourcentage') payload.amount = null;
    this.submit.emit({ ...payload, code: v.code.trim(), name: v.name.trim() });
  }
}
