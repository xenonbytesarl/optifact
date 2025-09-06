import {ChangeDetectionStrategy, Component, computed, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { ButtonComponent } from '../../../shared/ui/button';
import { IconComponent } from '../../../shared/ui/icon';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { productCategoryStore } from '../product-category.store';
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
  template: `
    <div class="p-4 relative">
      @if (loading()) {
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

        <app-product-category-list [items]="store.categoryPage().elements" (edit)="goEdit($event)" (remove)="remove($event)" />
        <app-paginator [total]="store.categoryPage().totalElements" [(page)]="store.categoryPage().page" [(pageSize)]="store.categoryPage().size" />
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductCategoriesListPage {
  readonly store = inject(productCategoryStore);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  svc = inject(ConfirmDialogService);
  i18n = inject(TranslateService);

  loading = computed(() => this.store.loading());

  constructor() {
    this.route.data.subscribe(data => {});
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
