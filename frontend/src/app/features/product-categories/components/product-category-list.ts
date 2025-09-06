import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategory } from '../../../core/api/product-categories.api';
import { ButtonComponent } from '../../../shared/ui/button';
import { IconComponent } from '../../../shared/ui/icon';
import { TranslateService } from '../../../core/i18n/translate.service';
import { TableComponent } from '../../../shared/ui/table';

@Component({
  selector: 'app-product-category-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, TableComponent, IconComponent],
  template: `
    <app-table [rows]="items()" [columns]="columns">
      <ng-template #actions let-row>
        <app-button size="sm" shadow="none" variant="ghost" (click)="edit.emit(row.id)">
          <app-icon name="edit" class="mr-1"></app-icon>
        </app-button>
        <app-button size="sm"  shadow="none" variant="ghost" (click)="remove.emit(row.id)">
          <app-icon name="delete"  class="mr-1 text-red-600"></app-icon>
        </app-button>
      </ng-template>
    </app-table>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductCategoryListComponent {
  items = input.required<ProductCategory[]>();
  edit = output<string>();
  remove = output<string>();

  constructor(private i18n: TranslateService) {}

  get columns() {
    this.i18n.lang();
    return [
      { key: 'name', header: this.i18n.t('productCategories.fields.name') },
    ];
  }
}
