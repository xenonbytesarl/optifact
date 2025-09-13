import { computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/ui/toast';
import { claimStore } from '../claim.store';
import { Claim, ClaimLine } from '../../../core/api/claim.api';

export type ClaimFormValue = {
  reference: string | null;
  state: Claim['state'];
  actorId: string | null;
  productId: string | null;
  createdAt: Date | null;
  doneAt: Date | null;
  lines: ClaimLine[];
};

export function useClaimScreen() {
  const store = inject(claimStore);
  const fb = inject(FormBuilder);
  const router = inject(Router);
  const toast = inject(ToastService);

  const form: FormGroup = fb.group({
    reference: ['new'],
    state: ['DRAFT', [Validators.required]],
    actorId: [null as string | null],
    productId: [null as string | null],
    doneAt: [null as Date | null],
    lines: [[] as ClaimLine[]]
  });

  const initialValue: ClaimFormValue = {
    reference: 'New',
    state: 'DRAFT',
    actorId: null,
    productId: null,
    createdAt: new Date(),
    doneAt: null,
    lines: []
  };

  const formValue = signal<ClaimFormValue>(initialValue);
  const loading = computed(() => store.loading());
  // Local saving guard to avoid double submissions on fast double-clicks
  const saving = signal(false);

  function stateHasError(): boolean {
    const c = form.get('state');
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  function onValueChange(v: ClaimFormValue) {
    formValue.set(v);
    form.patchValue({
      reference: v.reference,
      state: v.state,
      actorId: v.actorId,
      productId: v.productId,
      doneAt: v.doneAt,
      lines: v.lines ?? []
    });
  }

  function onStateBlur() { form.get('state')?.markAsTouched(); }

  function resetForm() {
    form.reset(initialValue);
    formValue.set(initialValue);
  }

  async function saveNew() {
    // prevent multiple rapid submissions
    if (form.invalid || store.loading() || saving()) return;
    try {
      saving.set(true);
      const created = await store.create(form.value as Partial<Claim>);
      if (created) {
        toast.success(store.message() || 'claims.messages.created.success');
        router.navigate(['/claims']);
      } else {
        toast.error(store.error() || 'common.error');
      }
    } finally {
      saving.set(false);
    }
  }

  async function saveEdit(id: string) {
    if (!id || form.invalid || store.loading() || saving()) return;
    try {
      saving.set(true);
      const updated = await store.update(id, form.value as Partial<Claim>);
      if (updated) {
        toast.success(store.message() || 'claims.messages.update.success');
        router.navigate(['/claims']);
      } else {
        toast.error(store.error() || 'common.error');
      }
    } finally {
      saving.set(false);
    }
  }

  function goBack() { router.navigate(['/claims']); }

  function syncFromCurrentIfPristine() {
    const current = store.current();
    if (current && form.pristine) {
      const v: ClaimFormValue = {
        reference: current.reference ?? null,
        state: current.state ?? 'DRAFT',
        actorId: current.actorId ?? null,
        productId: current.productId ?? null,
        createdAt: current.createdAt ?? new Date(),
        doneAt: current.doneAt ?? null,
        lines: current.lines ?? []
      };
      formValue.set(v);
      form.patchValue(v);
      form.markAsPristine();
      form.markAsUntouched();
    }
  }

  return {
    store,
    form,
    formValue,
    loading,
    stateHasError,
    onValueChange,
    onStateBlur,
    resetForm,
    saveNew,
    saveEdit,
    goBack,
    syncFromCurrentIfPristine,
  };
}
