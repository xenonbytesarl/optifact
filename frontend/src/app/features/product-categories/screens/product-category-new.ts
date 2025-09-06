import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { productCategoryStore } from '../product-category.store';
import { ProductCategoryFormComponent, CategoryFormValue } from '../components/product-category-form';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { SpinnerComponent } from '../../../shared/ui/spinner';
import {ToastService} from '../../../shared/ui/toast';

@Component({
  selector: 'app-product-category-new-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductCategoryFormComponent, ActionBarComponent, CardComponent, SpinnerComponent],
  template: `
    <app-action-bar
      [showNew]="false"
      [showEdit]="false"
      [disableSave]="form.invalid || loading()"
      (saveClicked)="save()"
      (cancelClicked)="goBack()"
    />

    <div class="p-4 flex flex-col gap-4 relative">
      @if (loading()) {
        <app-spinner [overlay]="true" />
      }
      <app-card>
        <app-product-category-form
          [disabled]="loading()"
          [value]="formValue()"
          (valueChange)="onValueChange($event)"
        />
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductCategoryNewPage {
  readonly store = inject(productCategoryStore);
  readonly router = inject(Router);
  readonly fb = inject(FormBuilder);

  form: FormGroup;

  formValue = signal<CategoryFormValue>({ name: '' });
  loading = computed(() => this.store.loading());
  toast = inject(ToastService);

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  onValueChange(categoryFormValue: CategoryFormValue) {
    this.formValue.set(categoryFormValue);
    this.form.patchValue({
      name: categoryFormValue.name
    });
  }

  async save() {
    if (this.form.invalid || this.loading()) return;
    const response = await this.store.create({ ...this.formValue() });
    if (response) {
      const msg = this.store.message() as string;
      this.toast.success(msg);
      this.router.navigate(['/product-categories', this.store.current()?.id]);
    } else {
      const msg = this.store.error() as string;
      this.toast.error(msg);
    }
  }

  resetForm() {
    this.store.resetForm();
    this.formValue.set({ name: '' });
    this.form.patchValue({
      name: ''
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  goBack() {
    this.resetForm()
    this.router.navigate(['/product-categories', 'list']);
  }
}
