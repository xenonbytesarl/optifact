import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { productStore} from '../products.store';
import { productCategoryStore } from '../../product-categories/product-category.store';
import {TranslateService} from '../../../core/i18n/translate.service';

@Component({
  selector: 'app-product-view-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, CardComponent],
  providers: [],
  template: `
    <app-action-bar [showCancel]="false" [showSave]="false" (newClicked)="goNew()" (editClicked)="goEdit()" />

    <div class="p-4 space-y-4">
      <app-card>
        <div class="flex items-start gap-4 md:gap-6">
          <div class="hidden md:flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
            <span class="material-symbols-outlined text-neutral-600 dark:text-neutral-300 text-3xl">inventory_2</span>
          </div>
          <div class="flex-1 space-y-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div class="text-2xl font-semibold leading-tight">{{ name() || '-' }}</div>
                <div class="text-sm text-muted">{{ code() }}</div>
              </div>
              <div class="flex items-center gap-2">

              </div>
            </div>

            <div class="grid gap-6 md:grid-cols-3">
              <div class="rounded border border-token p-4 bg-surface/50">
                <div class="text-xs text-muted mb-1">Type</div>
                <div class="text-base">{{ type() }}</div>
              </div>
              <div class="rounded border border-token p-4 bg-surface/50">
                @if (rawType() === 'FLAT_AMOUNT') {
                  <div>
                    <div class="text-xs text-muted mb-1">Montant (forfait)</div>
                    <div class="text-base font-medium">{{ amount() }}</div>
                  </div>
                } @else {
                  <div>
                    <div class="text-xs text-muted mb-1">Taux (%)</div>
                    <div class="text-base font-medium">{{ rate() }}</div>
                  </div>
                }
              </div>
              <div class="rounded border border-token p-4 bg-surface/50">
                <div class="text-xs text-muted mb-1">Catégorie</div>
                <div class="text-base">{{ categoryName() || '—' }}</div>
              </div>
            </div>

            @if (description()) {
              <div>
                <div class="text-sm text-muted mb-1">Description</div>
                <div class="text-base whitespace-pre-wrap">{{ description() }}</div>
              </div>
            } @else {
              <div class="text-sm text-muted">Aucune description fournie.</div>
            }
          </div>
        </div>
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductViewPage {
  readonly store = inject(productStore);
  readonly categoryStore = inject(productCategoryStore);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  protected i18n = inject(TranslateService);

  loading = computed(() => this.store.loading());
  id = computed(() => this.store.current()?.id ?? '');
  code = computed(() => this.store.current()?.code ?? '');
  name = computed(() => this.store.current()?.name ?? '');
  rawType = computed(() => this.store.current()?.type ?? '');
  type = computed(() => {
    const t = this.rawType();
    switch (t) {
      case 'FLAT_AMOUNT':
        return this.i18n.t('products.types.forfait');
      case 'PERCENTAGE':
        return this.i18n.t('products.types.pourcentage');
      default:
        return '';
    }
  });
  amount = computed(() => this.store.current()?.amount ?? '');
  rate = computed(() => this.store.current()?.rate ?? '');
  description = computed(() => this.store.current()?.description ?? '');
  categoryName = computed(() => {
    const cid = this.store.current()?.categoryId ?? null;
    if (!cid) return '';
    const c = this.categoryStore.categoryPage().elements.find(x => x.id === cid);
    return c?.name ?? '';
  });
  constructor() {}

  goNew() {
    this.router.navigate(['/products', 'new']);
  }

  goEdit() {
    this.router.navigate(['/products', this.id(), 'edit']);
  }
}
