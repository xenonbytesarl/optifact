import { ChangeDetectionStrategy, Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button';
import { IconComponent } from '../../../shared/ui/icon';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { Product } from '../../../core/api/products.api';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, TranslatePipe],
  template: `
    <div class="border overflow-hidden">
      <div class="grid grid-cols-[140px_1fr_120px_1fr_auto] gap-2 bg-gray-50 px-3 py-2 text-sm font-medium">
        <div>{{ 'products.fields.code' | t }}</div>
        <div>{{ 'products.fields.name' | t }}</div>
        <div>{{ 'products.fields.type' | t }}</div>
        <div class="hidden md:block">{{ 'products.fields.category' | t }}</div>
        <div class="text-right">{{ 'products.fields.actions' | t }}</div>
      </div>
      <div>
        @if (items().length > 0) {
          @for (p of items(); track p.id) {
            <div class="grid grid-cols-[140px_1fr_120px_1fr_auto] items-center gap-2 px-3 py-2 border-t">
              <div class="truncate font-mono">{{ p.code }}</div>
              <div class="truncate">{{ p.name }}</div>
              <div class="capitalize">{{ p.type }}</div>
              <div class="hidden md:block truncate">{{ p.categoryName || '' }}</div>
              <div class="flex gap-2 justify-end">
                <app-button size="sm" variant="ghost" (click)="edit.emit(p)">
                  <app-icon name="edit" class="mr-1"></app-icon>{{ 'actions.edit' | t }}
                </app-button>
                <app-button size="sm" variant="ghost" (click)="remove.emit(p)">
                  <app-icon name="delete" class="mr-1"></app-icon>
                </app-button>
              </div>
            </div>
          }
        } @else {
          <div class="px-3 py-6 text-center text-gray-500">{{ 'products.empty' | t }}</div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductListComponent {
  // categoryName optional for display convenience
  items = input.required<(Product & { categoryName?: string })[]>();
  edit = output<Product>();
  remove = output<Product>();
}
