import {ChangeDetectionStrategy, Component, input, output, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button';
import { IconComponent } from '../../../shared/ui/icon';
import { TranslateService } from '../../../core/i18n/translate.service';
import { TableComponent } from '../../../shared/ui/table';
import { Product } from '../../../core/api/products.api';
import {DirectionType} from '../../../core/model/direction.enum';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, TableComponent],
  template: `
    <app-table [rows]="items()"
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
export class ProductListComponent {
  items = input.required<Product[]>();
  view = output<string>();
  edit = output<string>();
  remove = output<string>();

  // sort state comes from parent via inputs or internal defaults; as a minimal change, keep local signals and emit
  sortKey = signal<string | null>('name');
  sortDir = signal<DirectionType>('ASC');
  sort = output<{ key: string; direction: DirectionType }>();

  constructor(private i18n: TranslateService) {}

  get columns() {
    // Depend on lang() so headers update when the language changes
    this.i18n.lang();
    return [
      { key: 'code', header: this.i18n.t('products.fields.code') },
      { key: 'name', header: this.i18n.t('products.fields.name') },
      { key: 'type', header: this.i18n.t('products.fields.type') },
      { key: 'categoryName', header: this.i18n.t('products.fields.category') },
    ];
  }

  onSortChange(e: { key: string; direction: DirectionType }) {
    this.sortKey.set(e.key);
    this.sortDir.set(e.direction);
    this.sort.emit(e);
  }
}
