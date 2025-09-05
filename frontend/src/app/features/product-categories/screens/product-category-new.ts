import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductCategoriesStore, provideCategoriesStore } from '../product-categories.store';
import { ProductCategoryFormComponent, CategoryFormValue } from '../components/product-category-form';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';

@Component({
  selector: 'app-product-category-new-page',
  standalone: true,
  imports: [CommonModule, ProductCategoryFormComponent, ActionBarComponent, CardComponent],
  providers: [provideCategoriesStore()],
  template: `
    <app-action-bar
      [disableNew]="false"
      [disableEdit]="false"
      [disableCancel]="false"
      [disableSave]="false"
      (cancelClicked)="goBack()"
      (saveClicked)="save()"
    />

    <div class="p-4 flex flex-col gap-4">
      <app-card>
        <app-product-category-form [value]="formValue()" (valueChange)="formValue.set($event)" (submit)="save($event)" (cancel)="goBack()" />
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductCategoryNewPage {
  readonly store = inject(ProductCategoriesStore);
  private router = inject(Router);
  formValue = signal<CategoryFormValue>({ name: '' });

  async save(v?: CategoryFormValue) {
    const val = v ?? this.formValue();
    await this.store.create({ name: val.name });
    this.goBack();
  }

  goBack() {
    // navigate deterministically to the list under the same feature shell
    this.router.navigate(['../list']);
  }
}
