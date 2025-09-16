import { ChangeDetectionStrategy, Component, TemplateRef, input, output, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button';
import { TableComponent } from '../../../shared/ui/table';
import { AutocompleteItem } from '../../../shared/ui/autocomplete';
import { InvoiceLine } from '../../../core/api/invoice.api';
import {TranslatePipe} from '../../../core/i18n/translate.pipe';
import { TranslateService } from '../../../core/i18n/translate.service';
import {AmountCurrencyPipe} from '../../../shared/pipes/amount-currency.pipe';

@Component({
  selector: 'app-invoice-tab',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TableComponent, TranslatePipe, AmountCurrencyPipe],
  template: `
    <div>
      <div class="flex items-center justify-between mb-2">
        <app-button size="sm" icon="add" (clicked)="add.emit()" [disabled]="disabled() || addDisabled()" [label]="('invoices.lines.actions.add' | t)"/>
        <div class="font-semibold">{{ 'invoices.tabs.lines' | t }}</div>
      </div>

      @if (!!lines() && lines().length > 0) {
        <app-table [rows]="lines()" [columns]="columns">
          <ng-template #productTpl let-row>
            {{ productLabel(row?.productId) || row?.productId || '—' }}
          </ng-template>
          <ng-template #unitPriceTpl let-row>
            {{ row?.unitPrice | amountCurrency: row?.unitPriceCurrency:0:0}}
          </ng-template>
          <ng-template #amountTpl let-row>
            {{ row?.amount | amountCurrency: row?.amountCurrency:0:0 }}
          </ng-template>
          <ng-template #actions let-row>
            @if (!disabled()) {
              <app-button size="sm" variant="ghost" shadow="none" hoverShadow="none" (clicked)="edit.emit(row)" [attr.aria-label]="('common.actions.edit' | t)">
                <span class="material-symbols-outlined text-base text-blue-600">edit</span>
              </app-button>
              <app-button size="sm" variant="ghost" shadow="none" hoverShadow="none" (clicked)="remove.emit(row)" [attr.aria-label]="('common.actions.delete' | t)">
                <span class="material-symbols-outlined text-base text-red-600">delete</span>
              </app-button>
            }
          </ng-template>
        </app-table>
      } @else {
        <div class="text-sm text-muted">{{ 'invoices.lines.empty' | t }}</div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class InvoiceTabComponent {
  i18n = inject(TranslateService);
  lines = input.required<InvoiceLine[]>();
  productItems = input<AutocompleteItem[]>([]);
  disabled = input<boolean>(false);
  // Disable only the Add button (e.g., when form is invalid)
  addDisabled = input<boolean>(false);

  add = output<void>();
  remove = output<InvoiceLine>();
  edit = output<InvoiceLine>();

  productTpl = viewChild<TemplateRef<any>>('productTpl');
  unitPriceTpl = viewChild<TemplateRef<any>>('unitPriceTpl');
  amountTpl = viewChild<TemplateRef<any>>('amountTpl');
  actions = viewChild<TemplateRef<any>>('actions');

  get columns(): { key: string; header: string; template?: TemplateRef<any>; class?: string; headerClass?: string; align?: 'left' | 'center' | 'right'; sortable?: boolean }[] {
    // depend on lang so headers update with language change
    this.i18n.lang();
    return [
      { key: 'name', header: this.i18n.t('invoices.lines.headers.name') },
      { key: 'productId', header: this.i18n.t('invoices.lines.headers.product'), template: this.productTpl() },
      { key: 'quantity', header: this.i18n.t('invoices.lines.headers.qty') },
      { key: 'unitPrice', header: this.i18n.t('invoices.lines.headers.unitPrice'), template: this.unitPriceTpl(), align: 'right' },
      { key: 'amount', header: this.i18n.t('invoices.lines.headers.amount'), template: this.amountTpl(), align: 'right' }
    ];
  }

  productLabel(id?: string | null): string | null {
    const item = this.productItems().find(p => p.value === id);
    return item?.label ?? null;
  }
}
