import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { ProductCategoriesStore, provideCategoriesStore } from '../product-categories.store';
import { ProductCategoriesApi } from '../../../core/api/product-categories.api';

@Component({
  selector: 'app-product-category-view-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, CardComponent, RouterLink],
  providers: [provideCategoriesStore()],
  template: `
    <app-action-bar [disableNew]="false" [disableEdit]="false" [disableCancel]="true" [disableSave]="true" />

    <div class="p-4 space-y-4">
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
      // try load single item for accuracy
      this.api.get(id).then((c) => this.store.setCurrent(c)).catch(() => {
        // fallback: ensure list exists and try find in list (optional)
        this.store.loadAll();
      });
    }
  }
}
