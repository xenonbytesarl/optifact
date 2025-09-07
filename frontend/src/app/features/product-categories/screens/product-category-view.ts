import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { productCategoryStore } from '../product-category.store';
import {ProductCategoriesApi} from '../../../core/api/product-categories.api';
import { SpinnerComponent } from '../../../shared/ui/spinner';

@Component({
  selector: 'app-product-category-view-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, CardComponent, SpinnerComponent],
  template: `
    <app-action-bar [showCancel]="false" [showSave]="false" (newClicked)="goNew()" (editClicked)="goEdit()" />

    <div class="p-4 space-y-4 relative">
      @if (loading()) {
        <app-spinner [overlay]="true" />
      }
      <app-card>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <div class="text-sm text-muted">Nom</div>
            <div class="text-base">{{ name() }}</div>
          </div>
        </div>
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductCategoryViewPage {
  readonly store = inject(productCategoryStore);
  readonly api = inject(ProductCategoriesApi);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  loading = computed(() => this.store.loading());
  id = computed(() => this.store.current()?.id ?? '');
  name = computed(() => this.store.current()?.name ?? '');

  constructor() {}

  goNew() {
    this.router.navigate(['/product-categories', 'new']);
  }

  goEdit() {
    this.router.navigate(['/product-categories', this.id(), 'edit']);
  }
}
