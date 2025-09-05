import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategory } from '../../../core/api/product-categories.api';
import { ButtonComponent } from '../../../shared/ui/button';
import { IconComponent } from '../../../shared/ui/icon';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { TableComponent } from '../../../shared/ui/table';

@Component({
  selector: 'app-product-category-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, TranslatePipe, TableComponent],
  template: `
    <app-table [rows]="items()" [columns]="columns">
      <ng-template #actions let-row>
        <app-button size="sm" variant="ghost" (click)="edit.emit(row)">
          <app-icon name="edit" class="mr-1"></app-icon>{{ 'actions.edit' | t }}
        </app-button>
        <app-button size="sm" variant="ghost" (click)="remove.emit(row)">
          <app-icon name="delete" class="mr-1"></app-icon>
        </app-button>
      </ng-template>
    </app-table>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductCategoryListComponent {
  items = input.required<ProductCategory[]>();
  edit = output<ProductCategory>();
  remove = output<ProductCategory>();

  columns = [
    { key: 'name', header: 'Nom' },
  ];
}
