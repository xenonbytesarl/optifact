import { ChangeDetectionStrategy, Component, input, model, TemplateRef, viewChild, contentChild, effect, computed, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable TableComponent
 * - Config-only: when [rows] and [columns] are provided, renders a table with:
 *   - Optional first column: selection checkboxes (toggle via [selectable]) with tri-state header
 *   - Optional last column: actions (projected via <ng-template #actions let-row>)
 *   - Middle columns defined by columns input (key + header + optional cell template)
 * Selection model: two-way via selectedIds model().
 */
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto">
      <table class="w-full text-sm border-collapse border border-gray-200 dark:border-neutral-700 rounded-md">
          <thead>
            <tr class="border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-neutral-100">
              @if (selectable()) {
                <th class="p-2 w-10">
                  <input type="checkbox"
                    [checked]="allSelected()"
                    [indeterminate]="someSelected()"
                    (change)="toggleAll($any($event.target).checked)"
                    [attr.aria-checked]="someSelected() && !allSelected() ? 'mixed' : null"
                    class="size-4 accent-primary border-gray-300 focus:outline-none  focus:ring-primary"
                    #master>
                </th>
              }
              @for (col of columns(); track col.key) {
                <th [class]="'p-2 select-none ' + headerAlignClass(col.align) + (col.headerClass ? ' ' + col.headerClass : '')">
                  <button
                    class="inline-flex items-center gap-1 disabled:opacity-60"
                    [disabled]="!col.sortable"
                    (click)="onHeaderClick(col)">
                    <span>{{ col.header }}</span>
                    @if (isActiveSort(col.key)) {
                      <span class="material-symbols-outlined text-xs text-neutral-400 align-middle">
                        {{ sortDir() === 'ASC' ? 'arrow_upward' : 'arrow_downward' }}
                      </span>
                    }
                  </button>
                </th>
              }
              @if (hasActions()) {
                <th class="text-right p-2"></th>
              }
            </tr>
          </thead>
          <tbody>
            @if (rows().length === 0) {
              <tr>
                <td class="p-2 py-6 text-sm text-gray-500 dark:text-neutral-400 text-center" [attr.colspan]="colCount()">Aucune donnée</td>
              </tr>
            } @else {
              @for (row of rows(); track trackBy($index, row)) {
                <tr class="border-b border-gray-200 dark:border-neutral-800">
                  @if (selectable()) {
                    <td class="p-2 w-10 text-center">
                      <input type="checkbox"
                        [checked]="isSelected(row)"
                        (change)="toggleRow(row, $any($event.target).checked)"
                        class=" size-4 accent-primary border-gray-300 focus:outline-none  focus:ring-primary"
                      >
                    </td>
                  }
                  @for (col of columns(); track col.key) {
                    <td [class]="'p-2 ' + cellAlignClass(col.align) + (col.class ? ' ' + col.class : '')">
                      @if (col.template) {
                        <ng-container *ngTemplateOutlet="col.template; context: {$implicit: row}"></ng-container>
                      } @else {
                        {{ row[col.key] }}
                      }
                    </td>
                  }
                  @if (hasActions()) {
                    <td class="p-2 text-right">
                      <ng-container *ngTemplateOutlet="actionsTpl(); context: {$implicit: row}"></ng-container>
                    </td>
                  }
                </tr>
              }
            }
          </tbody>
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
  host: { class: 'block' }
})
export class TableComponent {
  // TrackBy function to ensure unique primitive keys and avoid NG0955
  trackBy = (index: number, row: any) => {
    try {
      const idFn = this.rowId();
      const key = idFn ? idFn(row) : undefined;
      // If no stable key provided, fallback to JSON signature to reduce DOM reuse issues,
      // finally fallback to index.
      if (key !== undefined && key !== null && key !== '') return key as any;
      const signature = safeSignature(row);
      return signature ?? index;
    } catch {
      return index;
    }
  };
  // Config mode API
  rows = input<any[]>([]);
  columns = input<{ key: string; header: string; template?: TemplateRef<any>; class?: string; headerClass?: string; align?: 'left' | 'center' | 'right'; sortable?: boolean }[]>([]);
  rowId = input<(row: any) => string | number | null | undefined>((row) => row?.id ?? row?.tempId ?? null);
  selectedIds = model<Set<string | number>>(new Set());
  selectable = input<boolean>(true);

  // Actions template from content (optional) identified by template reference variable "actions"
  // Usage: <ng-template #actions let-row> ... </ng-template>
  actionsTemplateRef = contentChild<TemplateRef<any>>('actions');

  hasActions = computed(() => !!this.actionsTemplateRef() || this.columns().some(c => c.key === 'actions'));

  // Sorting API
  sortKey = input<string | null>(null);
  sortDir = input<'ASC' | 'DESC'>('ASC');
  sortChange = output<{ key: string; direction: 'ASC' | 'DESC' }>();

  isActiveSort = (key: string) => this.sortKey() === key;

  onHeaderClick(col: { key: string; sortable?: boolean }) {
    if (!col.sortable) return;
    const active = this.isActiveSort(col.key);
    const nextDir: 'ASC' | 'DESC' = active ? (this.sortDir() === 'ASC' ? 'DESC' : 'ASC') : 'ASC';
    this.sortChange.emit({ key: col.key, direction: nextDir });
  }
  actionsTpl = computed(() => this.actionsTemplateRef() ?? this._emptyTpl);

  colCount = computed(() => this.columns().length + (this.selectable() ? 1 : 0) + (this.hasActions() ? 1 : 0));

  // selection derived
  allSelected = computed(() => this.selectable() && this.rows().length > 0 && this.selectedIds().size === this.rows().length);
  someSelected = computed(() => this.selectable() && this.selectedIds().size > 0 && this.selectedIds().size < this.rows().length);

  isSelected(row: any) {
    if (!this.selectable()) return false;
    const id = this.rowId()(row);
    if (id === null || id === undefined) return false;
    return this.selectedIds().has(id);
  }

  toggleRow(row: any, checked: boolean) {
    if (!this.selectable()) return;
    const id = this.rowId()(row);
    if (id === null || id === undefined) return; // ignore rows without stable id
    const set = new Set(this.selectedIds());
    if (checked) set.add(id); else set.delete(id);
    this.selectedIds.set(set);
  }

  toggleAll(checked: boolean) {
    if (!this.selectable()) return;
    if (checked) {
      const set = new Set<string | number>();
      for (const r of this.rows()) {
        const id = this.rowId()(r);
        if (id !== null && id !== undefined) set.add(id);
      }
      this.selectedIds.set(set);
    } else {
      this.selectedIds.set(new Set());
    }
  }

  // Handle header checkbox indeterminate via effect since Angular binding doesn't expose it directly
  masterCb = viewChild<HTMLInputElement>('master');
  _ = effect(() => {
    const el = this.masterCb();
    if (el) el.indeterminate = this.someSelected() && !this.allSelected();
  });

  headerAlignClass(align?: 'left' | 'center' | 'right'): string {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  }
  cellAlignClass(align?: 'left' | 'center' | 'right'): string {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  }

  // Fallback empty template
  private _emptyTpl = null as unknown as TemplateRef<any>;
}

// Generate a weak signature for non-keyed rows to help Angular track DOM nodes more reliably
function safeSignature(row: any): string | null {
  try {
    if (!row || typeof row !== 'object') return String(row ?? '');
    // Prefer common fields
    const idLike = (row.id ?? row.tempId ?? row.key ?? row.code ?? row.email ?? row.phone) as any;
    if (idLike != null && idLike !== '') return String(idLike);
    // Fallback to a shallow JSON of first-level keys sorted to keep order stable
    const entries = Object.keys(row).sort().slice(0, 5).map(k => `${k}:${stringifyValue((row as any)[k])}`);
    return entries.join('|');
  } catch {
    return null;
  }
}
function stringifyValue(v: any): string {
  if (v == null) return '';
  if (typeof v === 'object') return JSON.stringify(v, Object.keys(v).sort()).slice(0, 100);
  return String(v);
}
