import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/ui/button';
import { IconComponent } from '../../../shared/ui/icon';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { ProductsStore, provideProductsStore } from '../products.store';
import { ProductCategoriesStore, provideCategoriesStore } from '../../product-categories/product-categories.store';
import { ProductListComponent } from '../components/product-list';

@Component({
  selector: 'app-products-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, IconComponent, TranslatePipe, ProductListComponent],
  providers: [provideProductsStore(), provideCategoriesStore()],
  template: `
    <div class="p-4 flex flex-col gap-4">
      <div class="flex justify-end">
        <a routerLink="../new">
          <app-button>
            <app-icon name="add" class="mr-1"></app-icon>
            {{ 'products.new' | t }}
          </app-button>
        </a>
      </div>

      <app-product-list [items]="items()" (edit)="goEdit($event.id)" (remove)="remove($event.id)" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductsListPage {
  readonly store = inject(ProductsStore);
  readonly cats = inject(ProductCategoriesStore);
  private router = inject(Router);

  items = computed(() => {
    const categories = this.cats.categories();
    return this.store.filtered().map(p => ({
      ...p,
      categoryName: categories.find(c => c.id === p.categoryId)?.name
    }));
  });

  constructor() {
    this.cats.loadAll();
    this.store.loadAll();
  }

  goEdit(id: string) { this.router.navigate(['../', id, 'edit']); }

  async remove(id: string) {
    await this.store.remove(id);
  }
}
