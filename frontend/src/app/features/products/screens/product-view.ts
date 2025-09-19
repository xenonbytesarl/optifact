import {ChangeDetectionStrategy, Component, computed, effect, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { ProductDocumentTypesTabComponent } from '../components/product-document-types-tab';
import { AmountCurrencyPipe } from '../../../shared/pipes/amount-currency.pipe';
import { RatePipe } from '../../../shared/pipes/rate.pipe';
import { TabsComponent, TabItem } from '../../../shared/ui/tabs';
import { productStore} from '../products.store';
import { productCategoryStore } from '../../product-categories/product-category.store';
import {TranslateService} from '../../../core/i18n/translate.service';
import {useProductScreen} from './product-screen.util';
import {attachmentTypeStore} from '../../attachment-type/attachment-type.store';
import {sequencesStore} from '../../sequences/sequences.store';

@Component({
  selector: 'app-product-view-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, CardComponent, ProductDocumentTypesTabComponent, TabsComponent, AmountCurrencyPipe, RatePipe],
  providers: [],
  template: `
    <app-action-bar [showCancel]="false" [showSave]="false" (newClicked)="goNew()" (editClicked)="goEdit()" />

    <div class="p-4 space-y-4">
      <app-card>
        <app-tabs [items]="tabItems()" [(active)]="activeTab">
          @if (activeTab === 'info') {
            <div class="flex items-start gap-4 md:gap-6">
              <div class="hidden md:flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                <span class="material-symbols-outlined text-neutral-600 dark:text-neutral-300 text-3xl">inventory_2</span>
              </div>
              <div class="flex-1 space-y-6">
                <!-- Header -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div class="text-2xl font-semibold leading-tight">{{ name() || '-' }}</div>
                    <div class="text-sm text-muted">{{ code() }}</div>
                  </div>
                  <div class="flex items-center gap-2"></div>
                </div>

                <!-- Identification -->
                <section class="flex flex-col gap-3">
                  <h3 class="text-sm font-semibold text-muted uppercase">{{ i18n.t('products.sections.identification') }}</h3>
                  <div class="grid gap-3 md:grid-cols-2">
                    <div class="rounded border border-token p-4 bg-surface/50">
                      <div class="text-xs text-muted mb-1">{{ i18n.t('products.fields.code') }}</div>
                      <div class="text-base">{{ code() || '—' }}</div>
                    </div>
                    <div class="rounded border border-token p-4 bg-surface/50">
                      <div class="text-xs text-muted mb-1">{{ i18n.t('products.fields.claimName') }}</div>
                      <div class="text-base">{{ claimName() || '—' }}</div>
                    </div>
                    <div class="rounded border border-token p-4 bg-surface/50">
                      <div class="text-xs text-muted mb-1">{{ i18n.t('products.view.extraProductName') }}</div>
                      <div class="text-base">{{ extraProductName() || '—' }}</div>
                    </div>
                  </div>
                </section>

                <hr class="border-token" />

                <!-- Classification -->
                <section class="flex flex-col gap-3">
                  <h3 class="text-sm font-semibold text-muted uppercase">{{ i18n.t('products.sections.classification') }}</h3>
                  <div class="grid gap-3 md:grid-cols-2">
                    <div class="rounded border border-token p-4 bg-surface/50">
                      <div class="text-xs text-muted mb-1">{{ i18n.t('products.view.category') }}</div>
                      <div class="text-base">{{ categoryName() || '—' }}</div>
                    </div>
                    <div class="rounded border border-token p-4 bg-surface/50">
                      <div class="text-xs text-muted mb-1">{{ i18n.t('products.view.sequence') }}</div>
                      <div class="text-base">{{ sequenceName() || '—' }}</div>
                    </div>
                  </div>
                </section>

                <hr class="border-token" />

                <!-- Pricing -->
                <section class="flex flex-col gap-3">
                  <h3 class="text-sm font-semibold text-muted uppercase">{{ i18n.t('products.sections.pricing') }}</h3>
                  <div class="grid gap-3 md:grid-cols-2">
                    <div class="rounded border border-token p-4 bg-surface/50">
                      <div class="text-xs text-muted mb-1">{{ i18n.t('products.view.type') }}</div>
                      <div class="text-base">{{ type() }}</div>
                    </div>
                    <div class="rounded border border-token p-4 bg-surface/50">

                      @if (rawType() === 'FLAT_AMOUNT') {
                        <div>
                          <div class="text-xs text-muted mb-1">{{ i18n.t('products.view.amountFlat') }}</div>
                          <div class="text-base font-medium">{{ amount() | amountCurrency: currency():0:0 }}</div>
                        </div>
                      } @else {
                        <div>
                          <div class="text-xs text-muted mb-1">{{ i18n.t('products.view.rate') }}</div>
                          <div class="text-base font-medium">{{ rate() | rate:0 }}</div>
                        </div>
                      }
                    </div>
                  </div>
                </section>

                <hr class="border-token" />

                <!-- Description -->
                <section class="flex flex-col gap-3">
                  <h3 class="text-sm font-semibold text-muted uppercase">{{ i18n.t('products.sections.description') }}</h3>
                  @if (description()) {
                    <div>
                      <div class="text-sm text-muted mb-1">{{ i18n.t('products.view.description') }}</div>
                      <div class="text-base whitespace-pre-wrap">{{ description() }}</div>
                    </div>
                  } @else {
                    <div class="text-sm text-muted">{{ i18n.t('products.view.noDescription') }}</div>
                  }
                </section>
              </div>
            </div>
          }
          @if (activeTab === 'docTypes') {
            <app-product-document-types-tab
              [modelIds]="modelIds()"
              [loading]="loading()"
              [attachmentTypes]="attachmentTypes()"
              [currentAttachmentTypes]="currentAttachmentTypes()"
              [readonly]="true"
            />
          }

        </app-tabs>
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductViewPage {

  tabItems = computed<TabItem[]>(() => {
    this.i18n.lang();
    return [
      { id: 'info', label: this.i18n.t('products.tabs.info') },
      { id: 'docTypes', label: this.i18n.t('products.tabs.docTypes') }
    ];
  });
  activeTab: 'info' | 'docTypes' = 'info';
  readonly store = inject(productStore);
  readonly categoryStore = inject(productCategoryStore);
  readonly docTypeStore = inject(attachmentTypeStore);
  readonly seqStore = inject(sequencesStore);
  readonly prodStore = inject(productStore);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly i18n = inject(TranslateService);

  loading = computed(() => this.store.loading());
  id = computed(() => this.store.current()?.id ?? '');
  code = computed(() => this.store.current()?.code ?? '');
  name = computed(() => this.store.current()?.name ?? '');
  claimName = computed(() => this.store.current()?.claimName ?? '');
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
  currency = computed(() => (this.store.current()?.currency as string | undefined) ?? 'EUR');
  description = computed(() => this.store.current()?.description ?? '');
  categoryName = computed(() => {
    const cid = this.store.current()?.categoryId ?? null;
    if (!cid) return '';
    const c = this.categoryStore.categoryPage().elements.find(x => x.id === cid);
    return c?.name ?? '';
  });
  sequenceName = computed(() => {
    const cid = this.store.current()?.sequenceId ?? null;
    if (!cid) return '';
    const c = this.seqStore.sequencePage().elements.find(x => x.id === cid);
    return c?.name ?? '';
  });
  extraProductName = computed(() => {
    const cid = this.store.current()?.extraProductId ?? null;
    if (!cid) return '';
    const c = this.prodStore.productPage().elements.find(x => x.id === cid);
    return c?.name ?? '';
  });
  attachmentTypes = computed(() => this.docTypeStore.attachmentTypePage().elements);
  currentAttachmentTypes = computed(() => this.docTypeStore.currentAttachmentTypes() ?? []);
  modelIds = computed(() => this.store.current()?.attachmentTypeIds ?? []);

  constructor() {
    effect(() => {
      if(this.store.current()) {
        const attachmentIds = this.store.current()?.attachmentTypeIds ?? [];
        if(attachmentIds.length > 0) {
          this.docTypeStore.findByIds(attachmentIds);
        }
      }
    });
  }

  goNew() {
    this.router.navigate(['/products', 'new']);
  }

  goEdit() {
    this.router.navigate(['/products', this.id(), 'edit']);
  }
}
