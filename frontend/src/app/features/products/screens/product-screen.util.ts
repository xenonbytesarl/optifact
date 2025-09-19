import { inject, computed, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/ui/toast';
import {productStore} from '../products.store';
import {ProductFormValue} from '../components/product-form';
import {productCategoryStore} from '../../product-categories/product-category.store';
import {attachmentTypeStore} from '../../attachment-type/attachment-type.store';
import {sequencesStore} from '../../sequences/sequences.store';

function productTypeAmountRateValidator(ctrl: AbstractControl): ValidationErrors | null {
  const type = ctrl.get('type')?.value as string | null | undefined;
  const amount = ctrl.get('amount')?.value as number | null | undefined;
  const rate = ctrl.get('rate')?.value as number | null | undefined;

  if (type === 'FLAT_AMOUNT') {
    // amount required
    const validAmount = amount !== null && amount !== undefined;
    return validAmount ? null : { amountRequired: true };
  }
  if (type === 'PERCENTAGE') {
    // rate required
    const validRate = rate !== null && rate !== undefined;
    return validRate ? null : { rateRequired: true };
  }
  return null;
}

export function useProductScreen() {
  const store = inject(productStore);
  const categoryStore = inject(productCategoryStore);
  const docTypeStore = inject(attachmentTypeStore);
  const sequenceStore = inject(sequencesStore);
  const fb = inject(FormBuilder);
  const router = inject(Router);
  const toast = inject(ToastService);

  const form: FormGroup = fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    claimName: [''],
    type: ['FLAT_AMOUNT', [Validators.required]],
    amount: [0],
    rate: [null],
    categoryId: [null, [Validators.required]],
    sequenceId: [null],
    extraProductId: [null],
    description: [''],
    currency: [null],
    attachmentTypeIds: [[]]
  }, { validators: productTypeAmountRateValidator });

  const initialProductFormValue: ProductFormValue = {
    code: '',
    name: '',
    claimName: '',
    type: 'FLAT_AMOUNT',
    amount: 0,
    rate: null,
    categoryId: null,
    sequenceId: null,
    extraProductId: null,
    description: '',
    currency: 'XAF',
    attachmentTypeIds: []
  };
  const formValue = signal<ProductFormValue>(initialProductFormValue);
  const loading = computed(() => store.loading());

  function synchAttachmentTypeOnEdit() {
    if(store.current()) {
      const attachmentIds = store.current()?.attachmentTypeIds ?? [];
      if(attachmentIds.length > 0) {
        docTypeStore.findByIds(attachmentIds);
      }
    }
  }

  function syncFromCurrentIfPristine() {
    const current = store.current();
    if (current && form.pristine) {
      const code = current.code ?? '';
      const name = current.name ?? '';
      const claimName = current.claimName ?? '';
      const type = current.type ?? 'FLAT_AMOUNT';
      const amount = current.amount ?? 0;
      const rate = current.rate ?? null;
      const categoryId = current.categoryId ?? null;
      const sequenceId = current.sequenceId ?? null;
      const extraProductId = current.extraProductId ?? null;
      const description = current.description ?? '';
      const currency = (current as any).currency ?? null;
      const attachmentTypeIds = current.attachmentTypeIds ?? [];
      formValue.set({ code, name, claimName, type, amount, rate, categoryId, sequenceId, extraProductId, description, currency, attachmentTypeIds });
      form.patchValue({ code, name, claimName, type, amount, rate, categoryId, sequenceId, extraProductId, description, currency, attachmentTypeIds });
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

  function rateHasError(): boolean {
    const c = form.get('rate');
    const groupError = !!form.errors?.['rateRequired'];
    return !!c && (c.invalid || groupError) && (c.dirty || c.touched);
  }

  function amountHasError(): boolean {
    const c = form.get('amount');
    const groupError = !!form.errors?.['amountRequired'];
    return !!c && (c.invalid || groupError) && (c.dirty || c.touched);
  }

  function onValueChange(v: ProductFormValue) {
    formValue.set(v);
    form.patchValue({
      code: v.code,
      name: v.name,
      claimName: v.claimName,
      type: v.type,
      amount: v.amount,
      rate: v.rate,
      categoryId: v.categoryId,
      sequenceId: v.sequenceId,
      extraProductId: v.extraProductId,
      description: v.description,
      currency: v.currency ?? null,
      attachmentTypeIds: v.attachmentTypeIds ?? []
    });
  }

  function onNameBlur() {
    form.get('name')?.markAsTouched();
  }

  function onClaimNameBlur() {
    form.get('claimName')?.markAsTouched();
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

  function onExtraProductIdBlur() {
    form.get('extraProductId')?.markAsTouched();
  }

  function onSequenceIdBlur() {
    form.get('sequenceId')?.markAsTouched();
  }

  function onRateBlur() {
    form.get('rate')?.markAsTouched();
  }

  function onAmountBlur() {
    form.get('amount')?.markAsTouched();
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
    categoryStore,
    docTypeStore,
    sequenceStore,
    form,
    formValue,
    loading,
    codeHasError,
    nameHasError,
    typeHasError,
    categoryIdHasError,
    rateHasError,
    amountHasError,
    onValueChange,
    onCodeBlur,
    onNameBlur,
    onClaimNameBlur,
    onTypeBlur,
    onCategoryIdBlur,
    onRateBlur,
    onAmountBlur,
    onSequenceIdBlur,
    onExtraProductIdBlur,
    resetForm,
    saveNew,
    saveEdit,
    goBack,
    syncFromCurrentIfPristine,
    synchAttachmentTypeOnEdit
  };
}
