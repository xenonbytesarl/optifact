import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategory } from '../../../core/api/product-categories.api';
import { ButtonComponent } from '../../../shared/ui/button';
import { IconComponent } from '../../../shared/ui/icon';
import { TranslateService } from '../../../core/i18n/translate.service';
import { TableComponent } from '../../../shared/ui/table';
import {DirectionType} from '../../../core/model/direction.enum';

@Component({
  selector: 'app-product-category-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, TableComponent, IconComponent],
  template: `
    <app-table
      [rows]="items()"
      [columns]="columns"
      [sortKey]="sortKey()"
      [sortDir]="sortDir()"
      (sortChange)="onSortChange($event)">
      <ng-template #actions let-row>
        <app-button size="sm" shadow="none" variant="ghost" (clicked)="view.emit(row.id)">
          <app-icon name="visibility" class="mr-1"></app-icon>
        </app-button>
        <app-button size="sm" shadow="none" variant="ghost" (clicked)="edit.emit(row.id)">
          <app-icon name="edit" class="mr-1"></app-icon>
        </app-button>
        <app-button size="sm"  shadow="none" variant="ghost" (clicked)="remove.emit(row.id)">
          <app-icon name="delete"  class="mr-1 text-red-600"></app-icon>
        </app-button>
      </ng-template>
    </app-table>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductCategoryListComponent {
  items = input.required<ProductCategory[]>();
  view = output<string>();
  edit = output<string>();
  remove = output<string>();

  // sort state comes from parent via inputs or internal defaults; as minimal change, keep local signals and emit
  sortKey = signal<string | null>('name');
  sortDir = signal<DirectionType>('ASC');
  sort = output<{ key: string; direction: DirectionType }>();

  constructor(private i18n: TranslateService) {}

  get columns() {
    this.i18n.lang();
    return [
      { key: 'name', header: this.i18n.t('productCategories.fields.name'), sortable: true },
    ];
  }

  onSortChange(e: { key: string; direction: DirectionType }) {
    this.sortKey.set(e.key);
    this.sortDir.set(e.direction);
    this.sort.emit(e);
  }
}
