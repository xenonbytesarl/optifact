import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { productCategoryStore } from '../product-category.store';
import { ProductCategoryFormComponent, CategoryFormValue } from '../components/product-category-form';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { SpinnerComponent } from '../../../shared/ui/spinner';

@Component({
  selector: 'app-product-category-edit-page',
  standalone: true,
  imports: [CommonModule, ProductCategoryFormComponent, ActionBarComponent, CardComponent, SpinnerComponent],
  template: `
    <app-action-bar
      [disableNew]="true"
      [disableEdit]="true"
      [disableCancel]="false"
      [disableSave]="false"
      (cancelClicked)="goBack()"
      (saveClicked)="save()"
    />

    <div class="p-4 flex flex-col gap-4 relative">
      @if (store.loading()) {
        <app-spinner [overlay]="true" />
      }
      <app-card>
        <app-product-category-form [value]="formValue()" (valueChange)="formValue.set($event)" (submit)="save($event)" (cancel)="goBack()" />
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductCategoryEditPage {
  readonly store = inject(productCategoryStore);
  readonly route = inject(ActivatedRoute);
  private router = inject(Router);

  editedId = signal<string>('');
  formValue = signal<CategoryFormValue>({ name: '' });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.editedId.set(id);
  }

  async save(v?: CategoryFormValue) {
    const id = this.editedId();
    if (id) {
      await this.store.update(id, { name: v?.name });
    }
    this.goBack();
  }

  goBack() {
    // navigate deterministically to the list under the same feature shell
    this.router.navigate(['/product-categories/list']);
  }
}
