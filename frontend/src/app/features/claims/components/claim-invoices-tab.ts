import { ChangeDetectionStrategy, Component, TemplateRef, input, output, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { TranslateService } from '../../../core/i18n/translate.service';
import { InvoiceView } from '../../../core/api/claim.api';
import { ButtonComponent } from '../../../shared/ui/button';
import { TableComponent } from '../../../shared/ui/table';
import { AmountCurrencyPipe } from '../../../shared/pipes/amount-currency.pipe';
import {parseApiDate} from '../../../core/utils/date.util';

@Component({
  selector: 'app-claim-invoices-tab',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ButtonComponent, TableComponent, AmountCurrencyPipe],
  template: `
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold">{{ 'claims.tabs.invoices' | t }}</h3>
      </div>

      <app-table
        [rows]="invoices()"
        [columns]="columns"
        [selectable]="false"
        [rowId]="rowIdFn">

        <ng-template #dateTpl let-row>
          {{  formatDate(row?.createAt) }}
        </ng-template>

        <ng-template #amountTpl let-row>
          {{ row?.amount | amountCurrency: row?.currency : 0 : 0 }}
        </ng-template>

        <ng-template #statusTpl let-row>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" [class]="badgeClass(row?.status)">
            {{ ('invoices.states.' + (row?.status || '').toLowerCase()) | t }}
          </span>
        </ng-template>

        <ng-template #actions let-row>
          <app-button size="xs" variant="link" tone="primary" icon="open_in_new" [label]="('actions.open' | t)" (clicked)="openInvoice.emit(row?.id!)" />
        </ng-template>
      </app-table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimInvoicesTabComponent {
  invoices = input.required<InvoiceView[]>();
  openInvoice = output<string>();

  private i18n = inject(TranslateService);

  dateTpl = viewChild<TemplateRef<any>>('dateTpl');
  amountTpl = viewChild<TemplateRef<any>>('amountTpl');
  statusTpl = viewChild<TemplateRef<any>>('statusTpl');

  rowIdFn = (row: InvoiceView) => row?.id ?? '';

  get columns() {
    this.i18n.lang();
    return [
      { key: 'reference', header: this.i18n.t('invoices.fields.reference'), sortable: false },
      { key: 'createAt', header: this.i18n.t('invoices.fields.createdAt'), template: this.dateTpl() },
      { key: 'amount', header: this.i18n.t('invoices.fields.amount'), template: this.amountTpl(), align: 'right' as const },
      { key: 'status', header: this.i18n.t('invoices.fields.status'), template: this.statusTpl(), align: 'right' as const },
      { key: 'actions', header: '', align: 'right' as const }
    ];
  }

  badgeClass(status: string | null | undefined): string {
    const s = (status || '').toUpperCase();
    const base = 'px-2 py-0.5 rounded-full text-xs font-medium';
    switch (s) {
      case 'PAID':
        return base + ' bg-green-100 text-green-800';
      case 'VALIDATE':
      case 'VALIDATED':
        return base + ' bg-blue-100 text-blue-800';
      case 'CANCEL':
      case 'CANCELLED':
        return base + ' bg-red-100 text-red-800';
      case 'DRAFT':
      default:
        return base + ' bg-gray-100 text-gray-800';
    }
  }

  formatDate(val: any): string {
    const d = parseApiDate(val);
    if (!d) return '';
    try {
      const lang = this.i18n.lang?.() || undefined;
      return new Intl.DateTimeFormat(lang, { dateStyle: 'short', timeStyle: 'short' }).format(d);
    } catch {
      return d.toLocaleString();
    }
  }
}
