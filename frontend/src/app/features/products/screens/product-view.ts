import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { ProductsStore, provideProductsStore } from '../products.store';
import { ProductsApi } from '../../../core/api/products.api';
import { ProductCategoriesStore, provideCategoriesStore } from '../../product-categories/product-categories.store';

@Component({
  selector: 'app-product-view-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, CardComponent, RouterLink],
  providers: [provideProductsStore(), provideCategoriesStore()],
  template: `
    <app-action-bar [disableNew]="false" [disableEdit]="false" [disableCancel]="true" [disableSave]="true" />

    <div class="p-4 space-y-4">
      <app-card>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <div class="text-sm text-muted">Code</div>
            <div class="text-base font-mono">{{ code() }}</div>
          </div>
          <div>
            <div class="text-sm text-muted">Nom</div>
            <div class="text-base">{{ name() }}</div>
          </div>
          <div>
            <div class="text-sm text-muted">Type</div>
            <div class="text-base capitalize">{{ type() }}</div>
          </div>
          <div>
            <div class="text-sm text-muted">Catégorie</div>
            <div class="text-base">{{ categoryName() }}</div>
          </div>
          <div>
            <div class="text-sm text-muted">Montant (forfait)</div>
            <div class="text-base">{{ amount() }}</div>
          </div>
          <div>
            <div class="text-sm text-muted">Taux (%)</div>
            <div class="text-base">{{ rate() }}</div>
          </div>
          <div class="md:col-span-2">
            <div class="text-sm text-muted">Description</div>
            <div class="text-base whitespace-pre-wrap">{{ description() }}</div>
          </div>
        </div>
        <div class="mt-4">
          <a class="inline-flex items-center text-primary hover:underline" [routerLink]="['edit']">
            <span class="material-symbols-outlined text-base mr-1">edit</span>Modifier
          </a>
        </div>
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductViewPage {
  readonly store = inject(ProductsStore);
  readonly cats = inject(ProductCategoriesStore);
  readonly api = inject(ProductsApi);
  readonly route = inject(ActivatedRoute);

  code = computed(() => this.store.current()?.code ?? '');
  name = computed(() => this.store.current()?.name ?? '');
  type = computed(() => this.store.current()?.type ?? '');
  amount = computed(() => this.store.current()?.amount ?? '');
  rate = computed(() => this.store.current()?.rate ?? '');
  description = computed(() => this.store.current()?.description ?? '');
  categoryName = computed(() => {
    const cid = this.store.current()?.categoryId ?? null;
    if (!cid) return '';
    const c = this.cats.categories().find(x => x.id === cid);
    return c?.name ?? '';
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Load supporting categories for name resolution
      this.cats.loadAll();
      // Load the product itself
      this.api.get(id).then((p) => this.store.setCurrent(p)).catch(() => {
        // fallback: ensure list exists (optional)
        this.store.loadAll();
      });
    }
  }
}
