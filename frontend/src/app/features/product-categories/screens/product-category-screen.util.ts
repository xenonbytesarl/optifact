import { inject, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { productCategoryStore } from '../product-category.store';
import { ToastService } from '../../../shared/ui/toast';
import { CategoryFormValue } from '../components/product-category-form';

export type ScreenMode = 'new' | 'edit' | 'view';

export function useProductCategoryScreen() {
  const store = inject(productCategoryStore);
  const fb = inject(FormBuilder);
  const router = inject(Router);
  const toast = inject(ToastService);

  const form: FormGroup = fb.group({
    name: ['', [Validators.required]]
  });

  const formValue = signal<CategoryFormValue>({ name: '' });
  const loading = computed(() => store.loading());

  function syncFromCurrentIfPristine() {
    const current = store.current();
    if (current && form.pristine) {
      const name = current.name ?? '';
      formValue.set({ name });
      form.patchValue({ name });
      form.markAsPristine();
      form.markAsUntouched();
    }
  }

  function nameHasError(): boolean {
    const c = form.get('name');
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  function onValueChange(v: CategoryFormValue) {
    formValue.set(v);
    form.patchValue({ name: v.name });
  }

  function onNameBlur() {
    form.get('name')?.markAsTouched();
  }

  function resetForm() {
    store.resetForm();
    formValue.set({ name: '' });
    form.patchValue({ name: '' });
    form.markAsPristine();
    form.markAsUntouched();
  }

  async function saveNew() {
    if (form.invalid || loading()) {
      form.markAllAsTouched();
      return false;
    }
    const response = await store.create({ ...formValue() });
    if (response) {
      toast.success(store.message() as string);
      router.navigate(['/product-categories', store.current()?.id]);
      return true;
    } else {
      toast.error(store.error() as string);
      return false;
    }
  }

  async function saveEdit(id: string) {
    if (form.invalid || loading()) {
      form.markAllAsTouched();
      return false;
    }
    const payload = { ...formValue() };
    const name = (payload.name ?? '').trim();
    if (!name) {
      form.get('name')?.setValue(name);
      form.markAllAsTouched();
      return false;
    }
    const response = await store.update(id, { name });
    if (response) {
      toast.info(store.message() as string);
      router.navigate(['/product-categories', store.current()?.id]);
      return true;
    } else {
      toast.error(store.error() as string);
      return false;
    }
  }

  function goBack() {
    resetForm();
    router.navigate(['/product-categories', 'list']);
  }

  return {
    store,
    form,
    formValue,
    loading,
    nameHasError,
    onValueChange,
    onNameBlur,
    resetForm,
    saveNew,
    saveEdit,
    goBack,
    syncFromCurrentIfPristine,
  };
}
