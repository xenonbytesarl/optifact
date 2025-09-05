import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { ProductsStore, provideProductsStore } from '../products.store';
import { ProductFormComponent, ProductFormValue } from '../components/product-form';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { provideCategoriesStore } from '../../product-categories/categories.store';

@Component({
  selector: 'app-product-new-page',
  standalone: true,
  imports: [CommonModule, ProductFormComponent, ActionBarComponent, CardComponent],
  providers: [provideProductsStore(), provideCategoriesStore()],
  template: `
    <app-action-bar
      [disableNew]="false"
      [disableEdit]="true"
      [disableCancel]="false"
      [disableSave]="false"
      (cancelClicked)="goBack()"
      (saveClicked)="save()"
    />

    <div class="p-4 flex flex-col gap-4">
      <app-card>
        <app-product-form [value]="formValue()" (valueChange)="formValue.set($event)" (submit)="save($event)" (cancel)="goBack()" />
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductNewPage {
  readonly store = inject(ProductsStore);
  private router = inject(Router);
  formValue = signal<ProductFormValue>({ code: '', name: '', type: 'forfait', amount: null, rate: null, categoryId: null, description: '' });

  async save(v?: ProductFormValue) {
    const val = v ?? this.formValue();
    await this.store.create(val);
    this.goBack();
  }

  goBack() {
    this.router.navigate(['../list']);
  }
}
