import { ChangeDetectionStrategy, Component, computed, effect, inject, TemplateRef, viewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { SpinnerComponent } from '../../../shared/ui/spinner';
import { TranslateService } from '../../../core/i18n/translate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { useInvoiceScreen } from './invoice-screen.util';
import { AppDateTimePipe } from '../../../shared/pipes/date-time.pipe';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { actorStore } from '../../actors/actors.store';
import { productStore } from '../../products/products.store';
import { AutocompleteItem } from '../../../shared/ui/autocomplete';
import { claimStore } from '../../claims/claim.store';
import { TableComponent } from '../../../shared/ui/table';
import { AmountCurrencyPipe } from '../../../shared/pipes/amount-currency.pipe';

@Component({
  selector: 'app-invoice-view-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, CardComponent, SpinnerComponent, AppDateTimePipe, TranslatePipe, TableComponent, AmountCurrencyPipe],
  template: `
    <app-action-bar
      [showSave]="false"
      [showCancel]="false"
      (editClicked)="goEdit()"
      (cancelClicked)="goBack()"
    />

    <div class="p-4 flex flex-col gap-4">
      @if (loading()) {
        <app-spinner [overlay]="true" />
      }
      <app-card>
        <div class="mb-4">
          <div class="text-2xl font-bold mt-1 mb-4">{{ formValue().reference || '' }}</div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <div class="text-xs text-muted">{{ i18n.t('invoices.fields.actor') }}</div>
              <div class="text-sm font-medium">{{ actorName() || '—' }}</div>
            </div>
            <div>
              <div class="text-xs text-muted">{{ i18n.t('invoices.fields.createdAt') }}</div>
              <div class="text-sm font-medium">{{ formValue().createdAt | appDateTime }}</div>
            </div>
            <div>
              <div class="text-xs text-muted">{{ i18n.t('invoices.fields.sendAt') }}</div>
              <div class="text-sm font-medium">{{ formValue().sendAt | appDateTime }}</div>
            </div>
            <div>
              <div class="text-xs text-muted">{{ i18n.t('invoices.fields.issueAt') }}</div>
              <div class="text-sm font-medium">{{ formValue().issueAt | appDateTime }}</div>
            </div>
            <div>
              <div class="text-xs text-muted">{{ i18n.t('invoices.fields.claim') }}</div>
              <div class="text-sm font-medium">{{ claimReference() || '—' }}</div>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <div class="font-semibold mb-2">{{ 'invoices.tabs.lines' | t }}</div>

          <!-- cell templates for formatted columns -->
          <ng-template #productTpl let-row>
            {{ productLabel(row.productId) || row.productId || '—' }}
          </ng-template>
          <ng-template #unitPriceTpl let-row>
            {{ row.unitPrice | amountCurrency:  currency():0:0 }}
          </ng-template>
          <ng-template #amountTpl let-row>
            {{ (row.amount || computeLineAmount(row)) | amountCurrency: currency():0:0 }}
          </ng-template>

          <app-table
            [rows]="formValue().lines || []"
            [columns]="columns()"
            [rowId]="rowId"
            [selectable]="false"
          ></app-table>

          <div class="mt-3 flex justify-end">
            <div class="text-sm">
              <span class="font-medium mr-2">{{ 'invoices.fields.total' | t }}:</span>
              <span class="font-bold">{{ totalAmount() | amountCurrency: currency():0:0 }}</span>
            </div>
          </div>
        </div>
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class InvoiceViewPage {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  ui = useInvoiceScreen();
  readonly i18n = inject(TranslateService);
  readonly aStore = inject(actorStore);
  readonly pStore = inject(productStore);
  readonly cStore = inject(claimStore);

  // Template refs for custom cells
  productTpl = viewChild<TemplateRef<any>>('productTpl');
  unitPriceTpl = viewChild<TemplateRef<any>>('unitPriceTpl');
  amountTpl = viewChild<TemplateRef<any>>('amountTpl');

  productItems = computed<AutocompleteItem[]>(() => this.pStore.productPage().elements.map(p => ({
    value: p.id,
    label: p.code ? `${p.name} (${p.code})` : p.name
  })));

  // Resolve claim reference from claimStore by claimId
  claimReference = computed<string | null>(() => {
    return this.formValue().claimId === this.cStore.current()?.id? this.cStore.current()?.reference as string: ''
  });

  actorName = computed<string | null>(() => {
    return this.aStore.current()?.name || null;
  });

  // Currency to use across the view (invoice currency fallback to line currency or EUR)
  currency = computed<string>(() => {
    const fv = this.formValue();
    return (fv.amountCurrency || fv.lines?.[0]?.amountCurrency || fv.lines?.[0]?.unitPriceCurrency || 'EUR') as string;
  });

  // Columns for table component
  columns = computed(() => [
    { key: 'name', header: this.i18n.t('invoices.lines.headers.name') },
    { key: 'productId', header: this.i18n.t('invoices.lines.headers.product'), template: this.productTpl() as any },
    { key: 'quantity', header: this.i18n.t('invoices.lines.headers.qty'), align: 'right' as const },
    { key: 'unitPrice', header: this.i18n.t('invoices.lines.headers.unitPrice'), align: 'right' as const, template: this.unitPriceTpl() as any },
    { key: 'amount', header: this.i18n.t('invoices.lines.headers.amount') || 'Amount', align: 'right' as const, template: this.amountTpl() as any },
  ]);

  // Row id getter
  rowId = (row: any) => row?.id || row?.productId || row?.name || null;

  constructor() {
    effect(() => {
      this.ui.syncFromCurrentIfPristine();
    });
  }

  get formValue() { return this.ui.formValue; }
  get loading() { return this.ui.loading; }

  // Compute a line amount if missing
  computeLineAmount = (row: any): number => {
    const qty = Number(row?.quantity ?? 0);
    const up = Number(typeof row?.unitPrice === 'string' ? row.unitPrice : (row?.unitPrice ?? 0));
    const val = (isNaN(qty) ? 0 : qty) * (isNaN(up) ? 0 : up);
    return val;
  };

  // Total amount for the invoice (prefer invoice amount, else sum of lines)
  totalAmount = computed<number>(() => {
    const fv = this.formValue();
    const invAmount = Number(typeof fv.amount === 'string' ? fv.amount : (fv.amount ?? 0));
    if (!isNaN(invAmount) && invAmount > 0) return invAmount;
    const lines = fv.lines || [];
    return lines.reduce((sum, l: any) => sum + (Number(l.amount ?? 0) || this.computeLineAmount(l)), 0);
  });

  productLabel(id: string | null | undefined): string | null {
    const item = this.productItems().find(p => p.value === id);
    return item?.label ?? null;
  }

  goBack() { return this.ui.goBack(); }
  goEdit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.router.navigate(['/invoices', id, 'edit']);
  }
}
