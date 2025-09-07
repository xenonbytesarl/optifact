import { inject, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/ui/toast';
import {productStore} from '../products.store';
import {ProductFormValue} from '../components/product-form';

export type ScreenMode = 'new' | 'edit' | 'view';

export function useProductScreen() {
  const store = inject(productStore);
  const fb = inject(FormBuilder);
  const router = inject(Router);
  const toast = inject(ToastService);

  const form: FormGroup = fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    type: ['FLAT_AMOUNT', [Validators.required]],
    amount: [0, [Validators.required]],
    rate: [null, [Validators.required]],
    categoryId: [null, [Validators.required]],
    description: ['', [Validators.required]]
  });

  const initialProductFormValue: ProductFormValue = {
    code: '',
    name: '',
    type: 'FLAT_AMOUNT',
    amount: 0,
    rate: null,
    categoryId: null,
    description: ''
  };
  const formValue = signal<ProductFormValue>(initialProductFormValue);
  const loading = computed(() => store.loading());

  function syncFromCurrentIfPristine() {
    const current = store.current();
    if (current && form.pristine) {
      const code = current.code ?? '';
      const name = current.name ?? '';
      const type = current.type ?? 'FLAT_AMOUNT';
      const amount = current.amount ?? 0;
      const rate = current.rate ?? null;
      const categoryId = current.categoryId ?? null;
      const description = current.description ?? '';
      formValue.set({ code, name, type, amount, rate, categoryId, description });
      form.patchValue({ code, name, type, amount, rate, categoryId, description });
      form.markAsPristine();
      form.markAsUntouched();
    }
  }

  function nameHasError(): boolean {
    const c = form.get('name');
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  function codeHasError(): boolean {
    const c = form.get('code');
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  function typeHasError(): boolean {
    const c = form.get('type');
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  function categoryIdHasError(): boolean {
    const c = form.get('categoryId');
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  function onValueChange(v: ProductFormValue) {
    formValue.set(v);
    form.patchValue({
      code: v.code,
      name: v.name,
      type: v.type,
      amount: v.amount,
      rate: v.rate,
      categoryId: v.categoryId,
      description: v.description
    });
  }

  function onNameBlur() {
    form.get('name')?.markAsTouched();
  }

  function onCodeBlur() {
    form.get('code')?.markAsTouched();
  }

  function onTypeBlur() {
    form.get('type')?.markAsTouched();
  }

  function onCategoryIdBlur() {
    form.get('categoryId')?.markAsTouched();
  }

  function resetForm() {
    store.resetForm();
    formValue.set(initialProductFormValue);
    form.patchValue(initialProductFormValue);
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
      router.navigate(['/products', store.current()?.id]);
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
    const response = await store.update(id, { ...payload });
    if (response) {
      toast.info(store.message() as string);
      router.navigate(['/products', store.current()?.id]);
      return true;
    } else {
      toast.error(store.error() as string);
      return false;
    }
  }

  function goBack() {
    resetForm();
    router.navigate(['/products', 'list']);
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
