import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/ui/button';
import { IconComponent } from '../../../shared/ui/icon';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { ProductsStore, provideProductsStore } from '../products.store';
import { productCategoryStore, provideCategoriesStore } from '../../product-categories/product-category.store';
import { ProductListComponent } from '../components/product-list';
import { CardComponent } from '../../../shared/ui/card';
import { PaginatorComponent } from '../../../shared/ui/paginator';
import { ConfirmDialogService } from '../../../shared/ui/confirm-dialog';
import { TranslateService } from '../../../core/i18n/translate.service';

@Component({
  selector: 'app-products-list-page',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, TranslatePipe, ProductListComponent, CardComponent, PaginatorComponent],
  providers: [provideProductsStore(), provideCategoriesStore()],
  template: `
    <div class="p-4">
      <app-card>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">{{ 'products.title' | t }}</h2>
          <app-button (click)="goNew()">
            <app-icon name="add" class="mr-1"></app-icon>
            {{ 'products.new' | t }}
          </app-button>
        </div>

        <app-product-list [items]="pagedItems()" (edit)="goEdit($event.id)" (remove)="remove($event.id)" />
        <app-paginator [total]="items().length" [(page)]="page" [(pageSize)]="pageSize" />
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductsListPage {
  readonly store = inject(ProductsStore);
  readonly categoryStore = inject(productCategoryStore);
  private router = inject(Router);

  items = computed(() => {
    const categories = this.categoryStore.categoryPage().elements ?? [];
    return this.store.filtered().map(p => ({
      ...p,
      categoryName: categories.find(c => c.id === p.categoryId)?.name
    }));
  });

  page = signal(1);
  pageSize = signal(10);
  pagedItems = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.items().slice(start, start + this.pageSize());
  });

  svc = inject(ConfirmDialogService);
  i18n = inject(TranslateService);

  constructor() {
    //TODO replace with product category search resolver
    // this.categoryStore.loadAll();
    this.store.loadAll();
  }

  goEdit(id: string) { this.router.navigate(['/products', id, 'edit']); }

  goNew() { this.router.navigate(['../new']); }

  async remove(id: string) {
    const ok = await this.svc.open({ message: this.i18n.t('confirm.delete.product') });
    if (!ok) return;
    await this.store.remove(id);
  }
}
