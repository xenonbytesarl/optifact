import { ChangeDetectionStrategy, Component, input, model, TemplateRef, viewChild, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable TableComponent
 * - Config-only: when [rows] and [columns] are provided, renders a table with:
 *   - First column: checkboxes per row and a header checkbox with tri-state
 *   - Last column: actions (projected via ng-template [appTableActions])
 *   - Middle columns defined by columns input (key + header + optional cell template)
 * Selection model: two-way via selectedIds model().
 */
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto">
      <table class="w-full text-sm border-collapse border border-gray-200 rounded-md">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50">
              <th class="p-2 w-10">
                <input type="checkbox"
                  [checked]="allSelected()"
                  (change)="toggleAll($any($event.target).checked)"
                  [attr.aria-checked]="someSelected() && !allSelected() ? 'mixed' : null"
                  #master>
              </th>
              @for (col of columns(); track col.key) {
                <th class="text-left p-2">{{ col.header }}</th>
              }
              <th class="text-right p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            @if (rows().length === 0) {
              <tr><td class="p-2 py-6 text-sm text-gray-500 text-center" [attr.colspan]="columns().length + 2">Aucune donnée</td></tr>
            } @else {
              @for (row of rows(); track $index) {
                <tr class="border-b border-gray-200">
                  <td class="p-2 w-10 text-center">
                    <input type="checkbox"
                      [checked]="isSelected(row)"
                      (change)="toggleRow(row, $any($event.target).checked)">
                  </td>
                  @for (col of columns(); track col.key) {
                    <td class="p-2">
                      @if (col.template) {
                        <ng-container *ngTemplateOutlet="col.template; context: {$implicit: row}"></ng-container>
                      } @else {
                        {{ row[col.key] }}
                      }
                    </td>
                  }
                  <td class="p-2 text-right">
                    <ng-container *ngTemplateOutlet="actionsTpl(); context: {$implicit: row}"></ng-container>
                  </td>
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
      return key ?? index;
    } catch {
      return index;
    }
  };
  // Config mode API
  rows = input<any[]>([]);
  columns = input<{ key: string; header: string; template?: TemplateRef<any> }[]>([]);
  rowId = input<(row: any) => string | number>((row) => row?.id);
  selectedIds = model<Set<string | number>>(new Set());

  // Actions template from content (optional) identified by template reference variable "actions"
  // Usage: <ng-template #actions let-row> ... </ng-template>
  actionsTemplateRef = viewChild<TemplateRef<any>>('actions');

  actionsTpl = computed(() => this.actionsTemplateRef() ?? this._emptyTpl);

  // selection derived
  allSelected = computed(() => this.rows().length > 0 && this.selectedIds().size === this.rows().length);
  someSelected = computed(() => this.selectedIds().size > 0 && this.selectedIds().size < this.rows().length);

  isSelected(row: any) {
    return this.selectedIds().has(this.rowId()(row));
  }

  toggleRow(row: any, checked: boolean) {
    const id = this.rowId()(row);
    const set = new Set(this.selectedIds());
    if (checked) set.add(id); else set.delete(id);
    this.selectedIds.set(set);
  }

  toggleAll(checked: boolean) {
    if (checked) {
      const set = new Set<string | number>();
      for (const r of this.rows()) set.add(this.rowId()(r));
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

  // Fallback empty template
  private _emptyTpl = null as unknown as TemplateRef<any>;
}
