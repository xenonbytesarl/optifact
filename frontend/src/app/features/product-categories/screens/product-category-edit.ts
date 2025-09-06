import {ChangeDetectionStrategy, Component, computed, effect, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { productCategoryStore } from '../product-category.store';
import { ProductCategoryFormComponent, CategoryFormValue } from '../components/product-category-form';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CardComponent } from '../../../shared/ui/card';
import { SpinnerComponent } from '../../../shared/ui/spinner';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../../../shared/ui/toast';

@Component({
  selector: 'app-product-category-edit-page',
  standalone: true,
  imports: [CommonModule, ProductCategoryFormComponent, ActionBarComponent, CardComponent, SpinnerComponent],
  template: `
    <app-action-bar
      [showEdit]="false"
      [showNew]="false"
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
          [nameRequiredError]="nameHasError()"
          (valueChange)="onValueChange($event)"
          (blur)="onNameBlur()"
        />
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductCategoryEditPage {
  readonly store = inject(productCategoryStore);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly fb = inject(FormBuilder);
  readonly toast = inject(ToastService);

  form: FormGroup;

  editedId = signal<string>('');
  formValue = signal<CategoryFormValue>({ name: '' });
  loading = computed(() => this.store.loading());

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required]]
    });
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.editedId.set(id);

    // Sync initial data when resolver/store loads the current category
    effect(() => {
      const current = this.store.current();
      if (current && this.editedId() === (current.id ?? this.editedId())) {
        // Only patch when form is pristine to avoid overwriting user edits
        if (this.form.pristine) {
          const name = current.name ?? '';
          this.formValue.set({ name });
          this.form.patchValue({ name });
          this.form.markAsPristine();
          this.form.markAsUntouched();
        }
      }
    });
  }

  nameHasError() {
    const c = this.form.get('name');
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  onValueChange(categoryFormValue: CategoryFormValue) {
    this.formValue.set(categoryFormValue);
    this.form.patchValue({
      name: categoryFormValue.name
    });
  }

  onNameBlur() {
    const c = this.form.get('name');
    c?.markAsTouched();
  }

  async save() {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = { ...this.formValue() };
    const name = (payload.name ?? '').trim();
    if (!name) {
      this.form.get('name')?.setValue(name);
      this.form.markAllAsTouched();
      return;
    }
    const response = await this.store.update(this.editedId(), { name });
    if (response) {
      const msg = this.store.message() as string;
      this.toast.info(msg);
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
