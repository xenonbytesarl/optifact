import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from '../components/product-form';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import {SpinnerComponent} from '../../../shared/ui/spinner';
import {useProductScreen} from './product-screen.util';
import { ProductDocumentTypesTabComponent } from '../components/product-document-types-tab';
import { TranslateService } from '../../../core/i18n/translate.service';
import { TabsComponent, TabItem } from '../../../shared/ui/tabs';

@Component({
  selector: 'app-product-new-page',
  standalone: true,
  imports: [CommonModule, ProductFormComponent, ActionBarComponent, CardComponent, SpinnerComponent, ProductDocumentTypesTabComponent, TabsComponent],
  providers: [],
  template: `
    <app-action-bar
      [showNew]="false"
      [showEdit]="false"
      [disableSave]="form.invalid || loading()"
      (saveClicked)="save()"
      (cancelClicked)="goBack()"
    />

    <div class="p-4 flex flex-col gap-4">
      @if (loading()) {
        <app-spinner [overlay]="true"/>
      }
      <app-card>
        <app-tabs [items]="tabItems()" [(active)]="activeTab">
          @if (activeTab === 'info') {
            <app-product-form
              [disabled]="loading()"
              [value]="formValue()"
              [codeRequiredError]="codeHasError()"
              [nameRequiredError]="nameHasError()"
              [typeRequiredError]="typeHasError()"
              [categoryIdRequiredError]="categoryIdHasError()"
              [rateRequiredError]="rateHasError()"
              [amountRequiredError]="amountHasError()"
              [productCategories]="productCategories()"
              [sequences]="sequences()"
              (blurCode)="onCodeBlur()"
              (blurName)="onNameBlur()"
              (blurType)="onTypeBlur()"
              (blurCategory)="onCategoryIdBlur()"
              (blurAmount)="onAmountBlur()"
              (blurRate)="onRateBlur()"
              (blurSequence)="onSequenceIdBlur()"
              (valueChange)="onValueChange($event)"
            />
          }
          @if (activeTab === 'docTypes') {
            <app-product-document-types-tab
              [loading]="loading()"
              [modelIds]="formValue().attachmentTypeIds ?? []"
              [attachmentTypes]="attachmentTypes()"
              (modelIdsChange)="onAttachmentTypeIds($event)"/>
          }
        </app-tabs>
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductNewPage {
  ui = useProductScreen();

  private i18n = inject(TranslateService);
  productCategories = computed(() => this.ui.categoryStore.categoryPage().elements);
  sequences = computed(() => this.ui.sequenceStore.sequencePage().elements);
  attachmentTypes = computed(() => this.ui.docTypeStore.attachmentTypePage().elements);
  tabItems = computed<TabItem[]>(() => {
    this.i18n.lang();
    return [
      { id: 'info', label: this.i18n.t('products.tabs.info') },
      { id: 'docTypes', label: this.i18n.t('products.tabs.docTypes') }
    ];
  });
  activeTab: 'info' | 'docTypes' = 'info';

  get form() { return this.ui.form; }
  get formValue() { return this.ui.formValue; }
  get loading() { return this.ui.loading; }

  codeHasError() { return this.ui.codeHasError(); }
  nameHasError() { return this.ui.nameHasError(); }
  typeHasError() { return this.ui.typeHasError(); }
  rateHasError() { return this.ui.rateHasError(); }
  amountHasError() { return this.ui.amountHasError(); }
  categoryIdHasError() { return this.ui.categoryIdHasError(); }
  onValueChange(v: any) { return this.ui.onValueChange(v); }
  onCodeBlur() { return this.ui.onCodeBlur(); }
  onNameBlur() { return this.ui.onNameBlur(); }
  onTypeBlur() { return this.ui.onTypeBlur(); }
  onCategoryIdBlur() { return this.ui.onCategoryIdBlur(); }
  onRateBlur() { return this.ui.onRateBlur(); }
  onAmountBlur() { return this.ui.onAmountBlur(); }
  onSequenceIdBlur() { return this.ui.onSequenceIdBlur(); }

  save() { return this.ui.saveNew(); }
  goBack() { return this.ui.goBack(); }
  onAttachmentTypeIds(ids: string[] | null) {
    const v = { ...this.formValue(), attachmentTypeIds: ids } as any;
    this.ui.onValueChange(v);
  }
}
