import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/ui/button';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { CardComponent } from '../../../shared/ui/card';
import { PaginatorComponent } from '../../../shared/ui/paginator';
import { ConfirmDialogService } from '../../../shared/ui/confirm-dialog';
import { TranslateService } from '../../../core/i18n/translate.service';
import { ToastService } from '../../../shared/ui/toast';
import { Direction, DirectionType } from '../../../core/model/direction.enum';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../../core/constant/constant';
import { invoiceStore } from '../invoice.store';
import { InvoiceListComponent } from '../components/invoice-list';
import { InvoiceSortColumn } from '../../../core/api/invoice.api';

@Component({
  selector: 'app-invoices-list-screen',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TranslatePipe, CardComponent, PaginatorComponent, InvoiceListComponent],
  providers: [],
  template: `
    <div class="p-4">
      <app-card>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">{{ 'invoices.title' | t }}</h2>
          <app-button icon="add" [label]="'invoices.new' | t" (click)="goNew()" />
        </div>

        <app-invoice-list
          [items]="store.invoicePage().elements"
          (view)="goView($event)"
          (edit)="goEdit($event)"
          (remove)="remove($event)"
          (sort)="onSort($event)"
        />
        <app-paginator
          [total]="store.invoicePage().totalElements"
          [page]="uiPage()"
          [pageSize]="uiPageSize()"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        />
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class InvoicesListScreen {
  readonly store = inject(invoiceStore);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  svc = inject(ConfirmDialogService);
  i18n = inject(TranslateService);
  toast = inject(ToastService);

  loading = computed(() => this.store.loading());

  uiPage = computed(() => (this.store.invoicePage().page ?? 0) + 1);
  uiPageSize = computed(() => this.store.invoicePage().size ?? 10);

  sortColumn: InvoiceSortColumn = 'createdAt';
  sortDirection: Direction = Direction.DESC;

  constructor() {}

  async onPageChange(page1Based: number) {
    const size = this.uiPageSize();
    await this.store.search('', '', '', '', page1Based - 1, size, this.sortDirection, this.sortColumn);
  }

  async onPageSizeChange(size: number) {
    await this.store.search('', '', '', '', 0, size, this.sortDirection, this.sortColumn);
  }

  async onSort(e: { key: string; direction: DirectionType }) {
    this.sortColumn = e.key as InvoiceSortColumn;
    this.sortDirection = e.direction === 'ASC' ? Direction.ASC : Direction.DESC;
    const size = this.uiPageSize();
    await this.store.search('', '', '', '', 0, size, this.sortDirection, this.sortColumn);
  }

  goEdit(id: string) {
    this.router.navigate(['/invoices', id, 'edit']);
  }

  goView(id: string) {
    this.router.navigate(['/invoices', id]);
  }

  goNew() {
    this.router.navigate(['/invoices', 'new']);
  }

  async remove(id: string) {
    const ok = await this.svc.open({ message: this.i18n.t('confirm.delete.invoice') });
    if (!ok) return;
    const response = await this.store.remove(id);
    if (response) {
      const msg = this.store.message() as string;
      this.toast.success(msg);
      this.sortDirection = Direction.DESC;
      this.sortColumn = 'createdAt';
      await this.store.search('', '', '', '', DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, this.sortDirection, this.sortColumn);
    } else {
      this.toast.error(this.store.error() || this.i18n.t('common.error'));
    }
  }
}
