import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsStore, provideProductsStore } from '../products.store';
import { ProductFormComponent, ProductFormValue } from '../components/product-form';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { provideCategoriesStore } from '../../product-categories/product-categories.store';

@Component({
  selector: 'app-product-edit-page',
  standalone: true,
  imports: [CommonModule, ProductFormComponent, ActionBarComponent, CardComponent],
  providers: [provideProductsStore(), provideCategoriesStore()],
  template: `
    <app-action-bar
      [disableNew]="true"
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
export class ProductEditPage implements OnInit {
  readonly store = inject(ProductsStore);
  readonly route = inject(ActivatedRoute);
  private router = inject(Router);

  editedId = signal<string>('');
  formValue = signal<ProductFormValue>({ code: '', name: '', type: 'forfait', amount: null, rate: null, categoryId: null, description: '' });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editedId.set(id);
      this.store.loadAll();
    }
  }

  async save(v?: ProductFormValue) {
    const id = this.editedId();
    if (id) {
      const val = v ?? this.formValue();
      await this.store.update(id, val);
    }
    this.goBack();
  }

  goBack() {
    this.router.navigate(['../list']);
  }
}
