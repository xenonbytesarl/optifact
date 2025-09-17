import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  input,
  output,
  signal,
  viewChild,
  inject,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button';
import { IconComponent } from '../../../shared/ui/icon';
import { TableComponent } from '../../../shared/ui/table';
import { BadgeComponent, BadgeTone } from '../../../shared/ui/badge';
import { Invoice } from '../../../core/api/invoice.api';
import { parseApiDate } from '../../../core/utils/date.util';
import { DirectionType } from '../../../core/model/direction.enum';
import { TranslateService } from '../../../core/i18n/translate.service';
import { actorStore } from '../../actors/actors.store';
import {AmountCurrencyPipe} from '../../../shared/pipes/amount-currency.pipe';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, TableComponent, BadgeComponent, AmountCurrencyPipe],
  template: `
    <app-table
      [rows]="items()"
      [columns]="columns"
      [sortKey]="sortKey()"
      [sortDir]="sortDir()"
      (sortChange)="onSortChange($event)">

      <ng-template #stateTpl let-row>
        <app-badge [tone]="stateTone(row.state)">
          {{ getStateLabel(row.state) }}
        </app-badge>
      </ng-template>

      <ng-template #dateTpl let-row>
        {{ formatDate(row.createdAt) }}
      </ng-template>

      <ng-template #actorTpl let-row>
        {{ row.actorName }}
      </ng-template>

      <ng-template #claimTpl let-row>
        {{ row.claimReference || '—' }}
      </ng-template>

      <ng-template #amountTpl let-row>
        {{ row?.amount | amountCurrency: currency(row) : 0 : 0  }}
      </ng-template>

      <ng-template #actions let-row>
        <app-button size="sm" shadow="none" variant="ghost" (clicked)="view.emit(row.id)">
          <app-icon name="visibility" class="mr-1"></app-icon>
        </app-button>
        <app-button size="sm" shadow="none" variant="ghost" (clicked)="edit.emit(row.id)">
          <app-icon name="edit" class="mr-1"></app-icon>
        </app-button>
        <app-button size="sm" shadow="none" variant="ghost" (clicked)="remove.emit(row.id)">
          <app-icon name="delete" class="mr-1 text-red-600"></app-icon>
        </app-button>
      </ng-template>
    </app-table>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class InvoiceListComponent {
  items = input.required<Invoice[]>();
  view = output<string>();
  edit = output<string>();
  remove = output<string>();

  sortKey = signal<string | null>('createdAt');
  sortDir = signal<DirectionType>('DESC');
  sort = output<{ key: string; direction: DirectionType }>();

  stateTpl = viewChild<TemplateRef<any>>('stateTpl');
  dateTpl = viewChild<TemplateRef<any>>('dateTpl');
  actorTpl = viewChild<TemplateRef<any>>('actorTpl');
  claimTpl = viewChild<TemplateRef<any>>('claimTpl');
  amountTpl = viewChild<TemplateRef<any>>('amountTpl');

  constructor(private i18n: TranslateService) {}

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

  get columns() {
    this.i18n.lang();
    return [
      { key: 'reference', header: this.i18n.t('invoices.fields.reference'), sortable: true },
      { key: 'createdAt', header: this.i18n.t('invoices.fields.createdAt'), template: this.dateTpl(), sortable: true },
      { key: 'actorId', header: this.i18n.t('invoices.fields.actor'), template: this.actorTpl() },
      { key: 'claimId', header: this.i18n.t('invoices.fields.claim'), template: this.claimTpl() },
      { key: 'amount', header: this.i18n.t('invoices.fields.total'), template: this.amountTpl() },
      { key: 'state', header: this.i18n.t('invoices.fields.state'), template: this.stateTpl(), sortable: true },
    ];
  }


  currency(row: Invoice): string {
    return row.amountCurrency || 'XAF';
  }

  onSortChange(e: { key: string; direction: DirectionType }) {
    this.sortKey.set(e.key);
    this.sortDir.set(e.direction);
    this.sort.emit(e);
  }

  stateTone(state?: string | null): BadgeTone {
    switch (state) {
      case 'DRAFT': return 'neutral';
      case 'VALIDATE': return 'info';
      case 'PAID': return 'success';
      case 'CANCEL': return 'neutral';
      default: return 'neutral';
    }
  }

  getStateLabel(state?: string | null) {
    switch (state) {
      case 'DRAFT': return this.i18n.t('invoices.states.draft');
      case 'VALIDATE': return this.i18n.t('invoices.states.validate');
      case 'PAID': return this.i18n.t('invoices.states.paid');
      case 'CANCEL': return this.i18n.t('invoices.states.cancel');
      default: return '';
    }
  }
}
