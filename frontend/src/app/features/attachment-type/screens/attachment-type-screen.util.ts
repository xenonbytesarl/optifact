import { inject, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { attachmentTypeStore } from '../attachment-type.store';
import { ToastService } from '../../../shared/ui/toast';
import { AttachmentTypeFormValue } from '../components/attachment-type-form';

export function useAttachmentTypeScreen() {
  const store = inject(attachmentTypeStore);
  const fb = inject(FormBuilder);
  const router = inject(Router);
  const toast = inject(ToastService);

  const form: FormGroup = fb.group({
    name: ['', [Validators.required]]
  });

  const formValue = signal<AttachmentTypeFormValue>({ name: '' });
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

  function onValueChange(v: AttachmentTypeFormValue) {
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
      router.navigate(['/attachment-types', store.current()?.id]);
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
      router.navigate(['/attachment-types', store.current()?.id]);
      return true;
    } else {
      toast.error(store.error() as string);
      return false;
    }
  }

  function goBack() {
    resetForm();
    router.navigate(['/attachment-types', 'list']);
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
