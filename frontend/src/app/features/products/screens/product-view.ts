import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { productStore} from '../products.store';
import { productCategoryStore } from '../../product-categories/product-category.store';
import {SelectOption} from '../../../shared/ui/select';
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
            @if (type() === 'FLAT_AMOUNT') {
              <div class="text-sm text-muted">Montant (forfait)</div>
              <div class="text-base">{{ amount() }}</div>
            }
            @if(type() === 'PERCENTAGE') {
              <div class="text-sm text-muted">Taux (%)</div>
              <div class="text-base">{{ rate() }}</div>
            }
          </div>
          <div>
            <div class="text-sm text-muted">Catégorie</div>
            <div class="text-base">{{ categoryName() }}</div>
          </div>
          <div class="md:col-span-2">
            <div class="text-sm text-muted">Description</div>
            <div class="text-base whitespace-pre-wrap">{{ description() }}</div>
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
  type = computed(() => {
    const t = this.store.current()?.type ?? '';
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

  typeOptions = computed<SelectOption[]>(() => {
    // depend on lang signal for recomputation
    this.i18n.lang();
    return [
      { value: 'FLAT_AMOUNT', label: this.i18n.t('products.types.forfait') },
      { value: 'PERCENTAGE', label: this.i18n.t('products.types.pourcentage') },
    ];
  });

  constructor() {}

  goNew() {
    this.router.navigate(['/products', 'new']);
  }

  goEdit() {
    this.router.navigate(['/products', this.id(), 'edit']);
  }
}
