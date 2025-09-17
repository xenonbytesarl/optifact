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
  submitAt: Date | null;
  inInstructionAt: Date | null;
  instructionDoneAt: Date | null;
  instructionRejectedAt: Date | null;
  compliantAt: Date | null;
  agreementGrantedAt?: Date | null;
  agreementRefusedAt?: Date | null;
  agreementAdjournedAt?: Date | null;
  uploadStarted: boolean | null;
  uploadEnded: boolean | null;
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
    instructionDoneAt: [null as Date | null],
    instructionRejectedAt: [null as Date | null],
    compliantAt: [null as Date | null],
    agreementGrantedAt: [null as Date | null],
    agreementRefusedAt: [null as Date | null],
    agreementAdjournedAt: [null as Date | null],
    submitAt: [null as Date | null],
    inInstructionAt: [null as Date | null],
    uploadStarted: [false as boolean | null],
    uploadEnded: [false as boolean | null],
    createdAt: [new Date() as Date],
    lines: [[] as ClaimLine[]]
  });

  const initialValue: ClaimFormValue = {
    reference: 'New',
    state: 'DRAFT',
    actorId: null,
    productId: null,
    createdAt: new Date(),
    submitAt: null,
    inInstructionAt: null,
    instructionDoneAt: null,
    instructionRejectedAt: null,
    compliantAt: null,
    agreementGrantedAt: null,
    agreementRefusedAt: null,
    agreementAdjournedAt: null,
    uploadStarted: false,
    uploadEnded: false,
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
      createdAt: v.createdAt,
      inInstructionAt: v.inInstructionAt,
      instructionDoneAt: v.instructionDoneAt,
      instructionRejectedAt: v.instructionRejectedAt,
      compliantAt: v.compliantAt,
      agreementGrantedAt: v.agreementGrantedAt,
      agreementRefusedAt: v.agreementRefusedAt,
      agreementAdjournedAt: v.agreementAdjournedAt,
      submitAt: v.submitAt,
      uploadStarted: v.uploadStarted,
      uploadEnded: v.uploadEnded,
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
        router.navigate(['/claims', created.id, 'edit']);
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
        router.navigate(['/claims', id, 'edit']);
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
    if (current && (!form.dirty || !form.touched)) {
      const v: ClaimFormValue = {
        reference: current.reference ?? null,
        state: current.state ?? 'DRAFT',
        actorId: current.actorId ?? null,
        productId: current.productId ?? null,
        createdAt: current.createdAt ?? new Date(),
        submitAt: current.submitAt ?? null,
        inInstructionAt: current.inInstructionAt ?? null,
        instructionDoneAt: current.instructionDoneAt ?? null,
        instructionRejectedAt: current.instructionRejectedAt ?? null,
        compliantAt: current.compliantAt ?? null,
        agreementGrantedAt: current.agreementGrantedAt ?? null,
        agreementRefusedAt: current.agreementRefusedAt ?? null,
        agreementAdjournedAt: current.agreementAdjournedAt ?? null,
        uploadStarted: current.uploadStarted ?? null,
        uploadEnded: current.uploadEnded ?? null,
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
