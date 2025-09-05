import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button';
import { IconComponent } from '../../../shared/ui/icon';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { TranslateService } from '../../../core/i18n/translate.service';
import { TableComponent } from '../../../shared/ui/table';
import { Product } from '../../../core/api/products.api';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, TranslatePipe, TableComponent],
  template: `
    <app-table [rows]="items()" [columns]="columns">
      <ng-template #actions let-row>
        <app-button size="sm" shadow="none" variant="ghost" (click)="edit.emit(row)">
          <app-icon name="edit" class="mr-1"></app-icon>{{ 'actions.edit' | t }}
        </app-button>
        <app-button size="sm" shadow="none" variant="ghost" (click)="remove.emit(row)">
          <app-icon name="delete" class="mr-1"></app-icon>
        </app-button>
      </ng-template>
    </app-table>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductListComponent {
  // categoryName optional for display convenience
  items = input.required<(Product & { categoryName?: string })[]>();
  edit = output<Product>();
  remove = output<Product>();

  constructor(private i18n: TranslateService) {}

  get columns() {
    // Depend on lang() so headers update when language changes
    this.i18n.lang();
    return [
      { key: 'code', header: this.i18n.t('products.fields.code') },
      { key: 'name', header: this.i18n.t('products.fields.name') },
      { key: 'type', header: this.i18n.t('products.fields.type') },
      { key: 'categoryName', header: this.i18n.t('products.fields.category') },
    ];
  }
}
