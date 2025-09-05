import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategory } from '../../../core/api/product-categories.api';
import { ButtonComponent } from '../../../shared/ui/button';
import { IconComponent } from '../../../shared/ui/icon';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, TranslatePipe],
  template: `
    <div class="border overflow-hidden">
      <div class="grid grid-cols-[1fr_auto] gap-2 bg-gray-50 px-3 py-2 text-sm font-medium">
        <div>{{ 'productCategories.fields.name' | t }}</div>
        <div class="text-right">{{ 'productCategories.fields.actions' | t }}</div>
      </div>
      <div>
        @if (items().length > 0) {
          @for (c of items(); track c.id) {
            <div class="grid grid-cols-[1fr_auto] items-center gap-2 px-3 py-2 border-t">
              <div class="truncate">{{ c.name }}</div>
              <div class="flex gap-2 justify-end">
                <app-button size="sm" variant="ghost" (click)="edit.emit(c)">
                  <app-icon name="edit" class="mr-1"></app-icon>{{ 'actions.edit' | t }}
                </app-button>
                <app-button size="sm" variant="ghost" (click)="remove.emit(c)">
                  <app-icon name="delete" class="mr-1"></app-icon>
                </app-button>
              </div>
            </div>
          }
        } @else {
          <div class="px-3 py-6 text-center text-gray-500">{{ 'productCategories.empty' | t }}</div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CategoryListComponent {
  items = input.required<ProductCategory[]>();
  edit = output<ProductCategory>();
  remove = output<ProductCategory>();
}
