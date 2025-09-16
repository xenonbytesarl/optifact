import {ChangeDetectionStrategy, Component, computed, effect, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { SpinnerComponent } from '../../../shared/ui/spinner';
import { DialogComponent } from '../../../shared/ui/dialog';
import { ButtonComponent } from '../../../shared/ui/button';
import { InvoiceLineFormComponent, InvoiceLineFormValue } from '../components/invoice-line-form';
import { TranslateService } from '../../../core/i18n/translate.service';
import { ActivatedRoute } from '@angular/router';
import { useInvoiceScreen } from './invoice-screen.util';
import { InvoiceFormComponent } from '../components/invoice-form';
import { actorStore } from '../../actors/actors.store';
import { productStore } from '../../products/products.store';
import { AutocompleteItem } from '../../../shared/ui/autocomplete';
import { claimStore } from '../../claims/claim.store';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-invoice-edit-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, CardComponent, SpinnerComponent, InvoiceFormComponent, DialogComponent, ButtonComponent, InvoiceLineFormComponent, TranslatePipe],
  template: `
    <app-action-bar
      [showNew]="false"
      [showEdit]="false"
      [disableSave]="loading() || ui.invalid()"
      (saveClicked)="save()"
      (cancelClicked)="goBack()"
    />

    <div class="p-4 flex flex-col gap-4">
      @if (loading()) {
        <app-spinner [overlay]="true" />
      }
      <app-card>
        <div class="mb-4">
          <app-invoice-form
            [disabled]="loading()"
            [addDisabled]="form.invalid"
            [value]="formValue()"
            [actorItems]="actorItems()"
            [productItems]="productItems()"
            [showClaimField]="true"
            [claimReference]="claimReference()"
            (valueChange)="onValueChange($event)"
            (requestAddLine)="openLineDialog()"
            (requestEditLine)="openEditLineDialog($event)"
          />
        </div>
      </app-card>
    </div>

    <app-dialog [(open)]="lineDialogOpen" [title]="('invoices.lines.dialog.title' | t)" (closed)="onLineDialogClosed()">
      <app-invoice-line-form [productItems]="productItems()" [value]="lineModel()" (valueChange)="onLineFormChange($event)" />
      <div dialog-actions class="flex flex-col sm:flex-row gap-2">
        <app-button [fullWidth]="true" class="sm:w-auto" variant="secondary" size="md" (clicked)="closeLineDialog()">
          <span class="material-symbols-outlined text-base">close</span>
          <span class="ml-1">{{ 'invoices.lines.dialog.action.cancel' | t }}</span>
        </app-button>
        <app-button [fullWidth]="true" class="sm:w-auto" variant="primary" size="md" [disabled]="lineInvalid()" (clicked)="saveLineAndNew()">
          <span class="material-symbols-outlined text-base">add_circle</span>
          <span class="ml-1">{{ 'invoices.lines.dialog.action.addNew' | t }}</span>
        </app-button>
        <app-button [fullWidth]="true" class="sm:w-auto" variant="primary" size="md" [disabled]="lineInvalid()" (clicked)="saveLineAndClose()">
          <span class="material-symbols-outlined text-base">check_circle</span>
          <span class="ml-1">{{ 'invoices.lines.dialog.action.addClose' | t }}</span>
        </app-button>
      </div>
    </app-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class InvoiceEditPage {
  readonly route = inject(ActivatedRoute);
  ui = useInvoiceScreen();
  readonly i18n = inject(TranslateService);
  readonly actors = inject(actorStore);
  readonly products = inject(productStore);
  readonly claims = inject(claimStore);

  actorItems = computed<AutocompleteItem[]>(() => this.actors.actorPage().elements.map(a => ({
    value: a.id,
    label: a.reference ? `${a.name} (${a.reference})` : a.name
  })));

  productItems = computed<AutocompleteItem[]>(() => this.products.productPage().elements.map(p => ({
    value: p.id,
    label: p.code ? `${p.name} (${p.code})` : p.name
  })));

  // Claim reference derived from claimStore (resolver preloads claim if any)
  claimReference = computed<string | null>(() => this.claims.current()?.reference || null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ui.store.findById(id);
    }
    effect(() => {
      this.ui.syncFromCurrentIfPristine();
    });
  }

  // Dialog state for adding/editing invoice lines
  lineDialogOpen = signal(false);
  // null means adding; otherwise editing at index
  editingIndex = signal<number | null>(null);
  lineModel = signal<InvoiceLineFormValue>({ id: null, productId: null, name: '', quantity: 1, unitPrice: '0', unitPriceCurrency: null, amount: '0', amountCurrency: null });

  // Disable actions when line is invalid
  lineInvalid = computed(() => {
    const m = this.lineModel();
    const productEmpty = !m.productId || String(m.productId).trim().length === 0;
    const nameEmpty = !m.name || m.name.toString().trim().length === 0;
    const qtyZero = !m.quantity || Number(m.quantity) === 0;
    const priceZero = !m.unitPrice || Number((m.unitPrice || '0').toString().replace(/,/g, '.')) === 0;
    return productEmpty || nameEmpty || qtyZero || priceZero;
  });

  get form() { return this.ui.form; }
  get formValue() { return this.ui.formValue; }
  get loading() { return this.ui.loading; }

  onValueChange(v: any) { return this.ui.onValueChange(v); }

  openLineDialog() {
    this.lineDialogOpen.set(true);
    this.editingIndex.set(null);
    this.lineModel.set({ id: null, productId: null, name: '', quantity: 1, unitPrice: '0', unitPriceCurrency: null, amount: '0', amountCurrency: null });
  }
  openEditLineDialog(line: any) {
    const formVal = this.formValue();
    const idx = (formVal.lines || []).findIndex((l: any) => (l.id && line?.id && l.id === line.id) || (!l.id && !line?.id && l.name === line?.name));
    this.editingIndex.set(idx >= 0 ? idx : null);
    this.lineModel.set({
      id: line?.id ?? null,
      productId: line?.productId ?? null,
      name: line?.name ?? '',
      quantity: Math.max(0, Number(line?.quantity ?? 0)),
      unitPrice: (line?.unitPrice ?? '0').toString(),
      unitPriceCurrency: line?.unitPriceCurrency ?? null,
      amount: (line?.amount ?? '0').toString(),
      amountCurrency: line?.amountCurrency ?? (line?.unitPriceCurrency ?? null)
    });
    this.lineDialogOpen.set(true);
  }
  closeLineDialog() { this.lineDialogOpen.set(false); }
  onLineDialogClosed() {
    this.editingIndex.set(null);
    this.lineModel.set({ id: null, productId: null, name: '', quantity: 1, unitPrice: '0', unitPriceCurrency: null, amount: '0', amountCurrency: null });
  }
  onLineFormChange(v: InvoiceLineFormValue) { this.lineModel.set(v); }
  private addLineCommon(closeAfter: boolean) {
    const formVal = this.formValue();
    const next = { ...formVal } as any;
    const lines = [...(formVal.lines || [])];
    const m = this.lineModel();
    const payload = { id: m.id ?? undefined, productId: m.productId || '', name: m.name, quantity: Number(m.quantity ?? 0), unitPrice: m.unitPrice || '0', unitPriceCurrency: m.unitPriceCurrency ?? null, amount: m.amount ?? '0', amountCurrency: m.amountCurrency ?? (m.unitPriceCurrency ?? null) } as any;
    const idx = this.editingIndex();
    if (idx != null && idx >= 0 && idx < lines.length) {
      lines[idx] = payload;
    } else {
      lines.push(payload);
    }
    next.lines = lines;
    this.onValueChange(next);
    if (closeAfter) this.lineDialogOpen.set(false);
    this.editingIndex.set(null);
    this.lineModel.set({ id: null, productId: null, name: '', quantity: 1, unitPrice: '0', unitPriceCurrency: null, amount: '0', amountCurrency: null });
  }
  saveLineAndNew() { this.addLineCommon(false); }
  saveLineAndClose() { this.addLineCommon(true); }

  save() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) return this.ui.saveEdit(id);
    return;
  }
  goBack() { return this.ui.goBack(); }
}
