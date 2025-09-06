import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { ProductCategoriesStore, provideCategoriesStore } from '../product-categories.store';
import {ProductCategoriesApi, ProductCategory} from '../../../core/api/product-categories.api';
import { SpinnerComponent } from '../../../shared/ui/spinner';
import {SuccessApiResponse} from '../../../core/model/response.model';

@Component({
  selector: 'app-product-category-view-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, CardComponent, RouterLink, SpinnerComponent],
  providers: [provideCategoriesStore()],
  template: `
    <app-action-bar [disableNew]="false" [disableEdit]="false" [disableCancel]="true" [disableSave]="true" />

    <div class="p-4 space-y-4 relative">
      @if (store.loading()) {
        <app-spinner [overlay]="true" />
      }
      <app-card>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <div class="text-sm text-muted">Nom</div>
            <div class="text-base">{{ name() }}</div>
          </div>
          <div>
            <div class="text-sm text-muted">Identifiant</div>
            <div class="text-base font-mono">{{ id() }}</div>
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
export class ProductCategoryViewPage {
  readonly store = inject(ProductCategoriesStore);
  readonly api = inject(ProductCategoriesApi);
  readonly route = inject(ActivatedRoute);

  name = computed(() => this.store.current()?.name ?? '');
  id = computed(() => this.store.current()?.id ?? '');

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // try to load single item for accuracy
      this.api.get(id).then((c) => {
        if(c.success) {
          const payload = c as SuccessApiResponse<ProductCategory>;
          return this.store.setCurrent(payload.data.content);
        }
      }).catch(() => {
        // fallback: ensure a list exists and try to find in list (optional)
        this.store.loadAll();
      });
    }
  }
}
