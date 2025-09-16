import { ChangeDetectionStrategy, Component, inject, input, model, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import { AutocompleteComponent, AutocompleteItem } from '../../../shared/ui/autocomplete';
import { InputNumberComponent } from '../../../shared/ui/input-number';
import { InputHiddenComponent } from '../../../shared/ui/input-hidden';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { TranslateService } from '../../../core/i18n/translate.service';
import { InputCurrencyComponent } from '../../../shared/ui/input-currency';
import { TextareaComponent } from '../../../shared/ui/textarea';
import { productStore } from '../../products/products.store';

export type InvoiceLineFormValue = {
  id?: string | null;
  productId: string | null;
  name: string;
  quantity: number;
  unitPrice: string;
  unitPriceCurrency?: string | null;
  amount?: string | null;
  amountCurrency?: string | null;
};

@Component({
  selector: 'app-invoice-line-form',
  standalone: true,
  imports: [CommonModule, FormFieldComponent, AutocompleteComponent, InputNumberComponent, InputHiddenComponent, InputCurrencyComponent, TextareaComponent, TranslatePipe],
  template: `
    <form >
      <app-input-hidden [value]="value().id || null" />
      <app-input-hidden [value]="value().amountCurrency || null" />
      <app-input-hidden [value]="value().unitPriceCurrency || null" />
      <div class="grid gap-4 md:grid-cols-2">
        <div class="col-span-2 md:col-span-1">
          <app-form-field [label]="('invoices.lines.fields.product' | t)" [required]="true" [error]="productErrorVisible() ? ('invoices.lines.validation.productRequired' | t) : null">
            <app-autocomplete
              [disabled]="disabled()"
              [items]="productItems()"
              [placeholder]="('invoices.lines.fields.product' | t)"
              [value]="value().productId"
              (valueChange)="onProduct($event)"
            />
          </app-form-field>
        </div>
        <div class="col-span-2 md:col-span-1">
          <app-form-field [label]="('invoices.lines.fields.qty' | t)" [required]="true" [error]="qtyErrorVisible() ? ('invoices.lines.validation.qtyMin' | t) : null">
            <app-input-number [min]="0" [step]="0.01" [disabled]="disabled()" [value]="value().quantity" (valueChange)="onQty($event)" />
          </app-form-field>
        </div>
        <div class="col-span-2 md:col-span-1">
          <app-form-field [label]="('invoices.lines.fields.unitPrice' | t)" [required]="true" [error]="unitPriceErrorVisible() ? ('invoices.lines.validation.unitPriceMin' | t) : null">
            <app-input-currency [disabled]="disabled()" [currency]="value().unitPriceCurrency || defaultCurrency" [value]="unitPriceNumber()" (valueChange)="onUnitPriceNumber($event)" />
          </app-form-field>
        </div>
        <div class="col-span-2 md:col-span-1">
          <app-form-field [label]="('invoices.lines.fields.amount' | t)">
            <app-input-currency [disabled]="true" [currency]="value().amountCurrency || value().unitPriceCurrency || defaultCurrency" [value]="amountNumber()" />
          </app-form-field>
        </div>
      </div>
      <div class="col-span-1 md:col-span-1 mt-3">
        <app-form-field [label]="('invoices.lines.fields.name' | t)" [required]="true" [error]="nameErrorVisible() ? ('invoices.lines.validation.nameRequired' | t) : null">
          <app-textarea [disabled]="disabled()" [rows]="3" [value]="value().name" (valueChange)="onName($event)" />
        </app-form-field>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class InvoiceLineFormComponent {
  i18n = inject(TranslateService);
  products = inject(productStore);

  disabled = input<boolean>(false);
  productItems = input<AutocompleteItem[]>([]);

  // If no currency provided, fallback to EUR
  defaultCurrency = 'XAF';

  initialInvoiceLine: InvoiceLineFormValue = {
    id: null,
    productId: null,
    name: '',
    quantity: 1,
    unitPrice: '0',
    unitPriceCurrency: 'XAF',
    amount: '0',
    amountCurrency: 'XAF',
  };

  value = model<InvoiceLineFormValue>(this.initialInvoiceLine);

  valueChange = output<InvoiceLineFormValue>();

  // Touched states for showing validation messages only after interaction
  productTouched = signal(false);
  nameTouched = signal(false);
  qtyTouched = signal(false);
  unitPriceTouched = signal(false);

  // Validation helpers (raw)
  productError = computed<boolean>(() => !this.value()?.productId);
  nameError = computed<boolean>(() => !this.value()?.name || this.value()!.name.toString().trim().length === 0);
  qtyError = computed<boolean>(() => !this.value()?.quantity || Number(this.value()!.quantity) <= 0);
  unitPriceError = computed<boolean>(() => this.unitPriceNumber() <= 0);

  // Visible errors only when touched
  productErrorVisible = computed<boolean>(() => this.productTouched() && this.productError());
  nameErrorVisible = computed<boolean>(() => this.nameTouched() && this.nameError());
  qtyErrorVisible = computed<boolean>(() => this.qtyTouched() && this.qtyError());
  unitPriceErrorVisible = computed<boolean>(() => this.unitPriceTouched() && this.unitPriceError());

  private toNumber(s: string | null | undefined): number {
    if (!s) return 0;
    const n = Number((s ?? '0').toString().replace(/,/g, '.'));
    return Number.isFinite(n) ? n : 0;
  }
  unitPriceNumber() { return this.toNumber(this.value().unitPrice); }
  amountNumber() { return this.toNumber(this.value().amount ?? '0'); }

  private computeAmount(qty: number, unitPrice: number): string {
    const amt = (qty || 0) * (unitPrice || 0);
    // keep 2 decimals to behave like currency string
    return amt.toFixed(2);
  }

  onProduct(v: string | null) {
    // mark as touched on interaction
    this.productTouched.set(true);
    if (!v) {
      // reset the entire line
      this.value.set({ id: null, productId: null, name: '', quantity: 1, unitPrice: '0', unitPriceCurrency: null, amount: '0', amountCurrency: null });
      this.valueChange.emit(this.value());
      return;
    }
    const prod = this.products.productPage().elements.find(p => p.id === v);
    const currency = prod?.currency || this.defaultCurrency;
    if (prod) {
      if (prod.type === 'FLAT_AMOUNT') {
        const qty = 1;
        const up = (prod.amount ?? 0);
        const amount = this.computeAmount(qty, up);
        this.value.set({
          ...this.value(),
          productId: v,
          name: prod.name,
          quantity: qty,
          unitPrice: up.toFixed(0),
          unitPriceCurrency: currency,
          amount,
          amountCurrency: currency,
        });
      } else {
        // For percentage products, quantity is rate/100 with two decimals; otherwise use rate as-is
        let qtyBase = Math.max(0, prod.rate ?? 0);
        let qty: number;
        const q = qtyBase / 100.00;
        qty = Number(q.toFixed(2));
        const up = 0;
        const amount = this.computeAmount(qty, up);
        this.value.set({
          ...this.value(),
          productId: v,
          name: prod.name,
          quantity: qty,
          unitPrice: up.toFixed(0),
          unitPriceCurrency: currency,
          amount,
          amountCurrency: currency,
        });
      }
    } else {
      // unknown product id: just set product and reset others
      this.value.set({ id: null, productId: v, name: '', quantity: 1, unitPrice: '0', unitPriceCurrency: null, amount: '0', amountCurrency: null });
    }
    this.valueChange.emit(this.value());
  }
  onName(v: string | null) {
    this.nameTouched.set(true);
    this.value.set({ ...this.value(), name: (v ?? '').toString() });
    this.valueChange.emit(this.value());
  }
  onQty(v: number | null) {
    this.qtyTouched.set(true);
    const value = v ?? 0;
    const q = Math.max(0, Number.isFinite(value) ? value : 1);
    const upNum = this.unitPriceNumber();
    const amount = this.computeAmount(q, upNum);
    this.value.set({ ...this.value(), quantity: q, amount, amountCurrency: this.value().unitPriceCurrency || this.value().amountCurrency || this.defaultCurrency });
    this.valueChange.emit(this.value());
  }
  onUnitPriceNumber(v: number | null) {
    this.unitPriceTouched.set(true);
    const up = v ?? 0;
    const q = this.value().quantity ?? 0;
    const amount = this.computeAmount(q, up);
    this.value.set({ ...this.value(), unitPrice: (up ?? 0).toFixed(2), amount, amountCurrency: this.value().unitPriceCurrency || this.value().amountCurrency || this.defaultCurrency });
    this.valueChange.emit(this.value());
  }
}
