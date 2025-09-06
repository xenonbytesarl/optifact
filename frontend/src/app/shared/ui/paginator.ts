import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from '../../core/constant/constant';

/**
 * Simple reusable paginator component (standalone, signals-first)
 * - Inputs: total (items), page (1-based), pageSize
 * - Outputs: pageChange, pageSizeChange
 * - Optional: pageSizes list
 */
@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-6">
      <!-- Left: page size selector (list déroulante) -->
      <div class="flex items-center gap-2 order-2 sm:order-1">
        <label class="text-sm text-gray-600">{{ 'paginator.perPage' | t }}</label>
        <select class="border-1 border-neutral-100 px-2 py-1 text-sm"
                [value]="pageSize()"
                (change)="onPageSizeChange($any($event.target).value)">
          @for (s of pageSizes(); track s) {
            <option [value]="s">{{ s }}</option>
          }
        </select>
        <span class="text-sm text-gray-600">
          @if (total() === 0) { {{ 'paginator.noItems' | t }} }
          @else { {{ startIndex() + 1 }} – {{ endIndex() }} {{ 'paginator.of' | t }} {{ total() }} }
        </span>
      </div>

      <!-- Right: range text + controls -->
      <div class="flex items-center justify-between sm:justify-end gap-2 order-1 sm:order-2">
        <div class="flex items-center gap-1">
          <button class="px-2 py-1 border-1 border-neutral-100  disabled:opacity-50" [disabled]="page() === 1" (click)="goFirst()" [attr.aria-label]="'paginator.first' | t">
            «
          </button>
          <button class="px-2 py-1 border-1 border-neutral-100  disabled:opacity-50" [disabled]="page() === 1" (click)="prev()" [attr.aria-label]="'paginator.prev' | t">
            ‹
          </button>
          <span class="px-2 text-sm">{{ 'paginator.pageXofY' | t: { page: page(), total: totalPages() } }}</span>
          <button class="px-2 py-1 border-1 border-neutral-100  disabled:opacity-50" [disabled]="page() >= totalPages()" (click)="next()" [attr.aria-label]="'paginator.next' | t">
            ›
          </button>
          <button class="px-2 py-1 border-1 border-neutral-100  disabled:opacity-50" [disabled]="page() >= totalPages()" (click)="goLast()" [attr.aria-label]="'paginator.last' | t">
            »
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PaginatorComponent {
  total = input<number>(0);
  page = model<number>(DEFAULT_PAGE_NUMBER);
  pageSize = model<number>(DEFAULT_PAGE_SIZE);
  pageSizes = input<number[]>([DEFAULT_PAGE_SIZE, 50, 100, 200]);

  pageChange = output<number>();
  pageSizeChange = output<number>();

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  startIndex = computed(() => (this.page()) * this.pageSize());
  endIndex = computed(() => Math.min(this.startIndex() + this.pageSize(), this.total()));

  emit() { this.pageChange.emit(this.page()); }
  emitSize() { this.pageSizeChange.emit(this.pageSize()); }

  goFirst() { if (this.page() !== 1) { this.page.set(1); this.emit(); } }
  prev() { if (this.page() > 1) { this.page.set(this.page() - 1); this.emit(); } }
  next() { if (this.page() < this.totalPages()) { this.page.set(this.page() + 1); this.emit(); } }
  goLast() { const last = this.totalPages(); if (this.page() !== last) { this.page.set(last); this.emit(); } }

  onPageSizeChange(v: string) {
    const size = Number(v) || this.pageSize();
    if (size !== this.pageSize()) {
      this.pageSize.set(size);
      // Reposition page to 1 to avoid empty
      this.page.set(1);
      this.emitSize();
      this.emit();
    }
  }
}
