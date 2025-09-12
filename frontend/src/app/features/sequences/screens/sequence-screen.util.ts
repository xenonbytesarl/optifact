import {inject, computed, signal} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastService} from '../../../shared/ui/toast';
import {sequencesStore} from '../sequences.store';
import {Sequence} from '../../../core/api/sequences.api';

export interface SequenceFormValue {
  code: string;
  name: string;
  step: number | null;
  size: number | null;
  next: number | null;
  prefix?: string | null;
  suffix?: string | null;
  active: boolean;
}

export function useSequenceScreen() {
  const store = inject(sequencesStore);
  const fb = inject(FormBuilder);
  const router = inject(Router);
  const toast = inject(ToastService);

  const form: FormGroup = fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    step: [1, [Validators.required, Validators.min(1)]],
    size: [5, [Validators.required, Validators.min(1)]],
    next: [1, [Validators.required, Validators.min(1)]],
    prefix: [null],
    suffix: [null],
    active: [true]
  });

  const initialValue: SequenceFormValue = {
    code: '',
    name: '',
    step: 1,
    size: 5,
    next: 1,
    prefix: null,
    suffix: null,
    active: true
  };

  const formValue = signal<SequenceFormValue>(initialValue);
  const loading = computed(() => store.loading());

  function syncFromCurrentIfPristine() {
    const current = store.current();
    if (current && form.pristine) {
      const v: SequenceFormValue = {
        code: current.code ?? '',
        name: current.name ?? '',
        step: current.step ?? 1,
        size: current.size ?? 5,
        next: (current.next as any) ?? 1,
        prefix: current.prefix ?? null,
        suffix: current.suffix ?? null,
        active: current.active ?? true,
      };
      formValue.set(v);
      form.patchValue(v);
      form.markAsPristine();
      form.markAsUntouched();
    }
  }

  function onValueChange(v: SequenceFormValue) {
    formValue.set(v);
    form.patchValue(v);
  }

  function codeHasError(): boolean {
    const c = form.get('code');
    return !!c && c.invalid && (c.dirty || c.touched);
  }
  function nameHasError(): boolean {
    const c = form.get('name');
    return !!c && c.invalid && (c.dirty || c.touched);
  }
  function stepHasError(): boolean {
    const c = form.get('step');
    return !!c && c.invalid && (c.dirty || c.touched);
  }
  function sizeHasError(): boolean {
    const c = form.get('size');
    return !!c && c.invalid && (c.dirty || c.touched);
  }
  function nextHasError(): boolean {
    const c = form.get('next');
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  function onCodeBlur() { form.get('code')?.markAsTouched(); }
  function onNameBlur() { form.get('name')?.markAsTouched(); }
  function onStepBlur() { form.get('step')?.markAsTouched(); }
  function onSizeBlur() { form.get('size')?.markAsTouched(); }
  function onNextBlur() { form.get('next')?.markAsTouched(); }

  function resetForm() {
    store.resetForm();
    formValue.set(initialValue);
    form.patchValue(initialValue);
    form.markAsPristine();
    form.markAsUntouched();
  }

  async function saveNew() {
    if (form.invalid || loading()) {
      form.markAllAsTouched();
      return false;
    }
    const response = await store.create({ ...formValue() } as Partial<Sequence>);
    if (response) {
      toast.success(store.message() as string);
      router.navigate(['/sequences', store.current()?.id]);
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
    const payload = { ...formValue() } as Partial<Sequence>;
    const response = await store.update(id, payload);
    if (response) {
      toast.info(store.message() as string);
      router.navigate(['/sequences', store.current()?.id]);
      return true;
    } else {
      toast.error(store.error() as string);
      return false;
    }
  }

  function goBack() {
    resetForm();
    router.navigate(['/sequences', 'list']);
  }

  return {
    store,
    form,
    formValue,
    loading,
    onValueChange,
    codeHasError,
    nameHasError,
    stepHasError,
    sizeHasError,
    nextHasError,
    onCodeBlur,
    onNameBlur,
    onStepBlur,
    onSizeBlur,
    onNextBlur,
    resetForm,
    saveNew,
    saveEdit,
    goBack,
    syncFromCurrentIfPristine
  };
}
