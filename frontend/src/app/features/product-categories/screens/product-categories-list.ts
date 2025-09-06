import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/ui/button';
import { IconComponent } from '../../../shared/ui/icon';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { ProductCategoriesStore, provideCategoriesStore } from '../product-categories.store';
import { ProductCategoryListComponent } from '../components/product-category-list';
import { CardComponent } from '../../../shared/ui/card';
import { PaginatorComponent } from '../../../shared/ui/paginator';
import { SpinnerComponent } from '../../../shared/ui/spinner';
import {ConfirmDialogService} from '../../../shared/ui/confirm-dialog';
import {TranslateService} from '../../../core/i18n/translate.service';

@Component({
  selector: 'app-product-categories-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, IconComponent, TranslatePipe, ProductCategoryListComponent, CardComponent, PaginatorComponent, SpinnerComponent],
  providers: [provideCategoriesStore()],
  template: `
    <div class="p-4 relative">
      @if (store.loading()) {
        <app-spinner [overlay]="true" />
      }
      <app-card>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">{{ 'productCategories.title' | t }}</h2>
          <button routerLink="../new" class="inline-flex">
            <app-button>
              <app-icon name="add" class="mr-1"></app-icon>
              {{ 'productCategories.new' | t }}
            </app-button>
          </button>
        </div>

        <app-product-category-list [items]="paged()" (edit)="goEdit($event)" (remove)="remove($event)" />
        <app-paginator [total]="store.filtered().length" [(page)]="page" [(pageSize)]="pageSize" />
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductCategoriesListPage {
  readonly store = inject(ProductCategoriesStore);
  private router = inject(Router);

  page = signal(1);
  pageSize = signal(10);
  paged = computed(() => {
    console.log('paged', this.store.filtered().length);
    const list = this.store.filtered();
    const start = (this.page() - 1) * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  svc = inject(ConfirmDialogService);
  i18n = inject(TranslateService);

  constructor() {
    // load all when the list screen mounts
    console.log('load all');
    this.store.loadAll();
  }

  goEdit(id: string) {
    this.router.navigate(['../', id, 'edit']);
  }

  async remove(id: string) {
    const ok = await this.svc.open({ message: this.i18n.t('confirm.delete.productCategory') });
    if (!ok) return;
    await this.store.remove(id);
  }
}
