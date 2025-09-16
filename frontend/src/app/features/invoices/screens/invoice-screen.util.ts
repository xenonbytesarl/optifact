import { computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/ui/toast';
import { invoiceStore } from '../invoice.store';
import { Invoice, InvoiceLine } from '../../../core/api/invoice.api';

export type InvoiceFormValue = {
  reference: string | null;
  state: Invoice['state'];
  actorId: string | null;
  claimId: string | null;
  createdAt: Date | null;
  sendAt: Date | null;
  issueAt: Date | null;
  amount: string | null;
  amountCurrency: string | null;
  bankAccount?: Invoice['bankAccount'] | null;
  lines: InvoiceLine[];
};

export function useInvoiceScreen() {
  const store = inject(invoiceStore);
  const fb = inject(FormBuilder);
  const router = inject(Router);
  const toast = inject(ToastService);

  const form: FormGroup = fb.group({
    reference: ['new'],
    state: ['DRAFT'],
    createdAt: [new Date()],
    actorId: [null as string | null, [Validators.required]],
    claimId: [null as string | null],
    sendAt: [null as Date | null],
    issueAt: [null as Date | null],
    amount: [null as string | null],
    amountCurrency: [null as string | null],
    lines: []
  });

  const initialValue: InvoiceFormValue = {
    reference: 'New',
    state: 'DRAFT',
    actorId: null,
    claimId: null,
    createdAt: new Date(),
    sendAt: null,
    issueAt: null,
    amount: null,
    amountCurrency: 'XAF',
    bankAccount: null,
    lines: []
  };

  const formValue = signal<InvoiceFormValue>(initialValue);
  const loading = computed(() => store.loading());
  const saving = signal(false);
  const invalid = computed(() => {
    const fv = formValue();
    const noLines = !fv?.lines || fv.lines.length === 0;
    return form.invalid || noLines;
  });

  function stateHasError(): boolean {
    const c = form.get('state');
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  function onValueChange(v: InvoiceFormValue) {
    formValue.set(v);
    form.patchValue({
      reference: v.reference,
      state: v.state,
      actorId: v.actorId,
      claimId: v.claimId,
      sendAt: v.sendAt,
      issueAt: v.issueAt,
      amount: v.amount,
      amountCurrency: v.amountCurrency,
      lines: v.lines ?? []
    });
  }

  function onStateBlur() { form.get('state')?.markAsTouched(); }

  function resetForm() {
    form.reset(initialValue);
    formValue.set(initialValue);
  }

  async function saveNew() {
    if (invalid() || store.loading() || saving()) return;
    try {
      saving.set(true);
      const created = await store.create(form.value as Partial<Invoice>);
      if (created) {
        toast.success(store.message() || 'invoices.messages.created.success');
        router.navigate(['/invoices', created.id]);
      } else {
        toast.error(store.error() || 'common.error');
      }
    } finally {
      saving.set(false);
    }
  }

  async function saveEdit(id: string) {
    if (!id || invalid() || store.loading() || saving()) return;
    try {
      saving.set(true);
      const updated = await store.update(id, form.value as Partial<Invoice>);
      if (updated) {
        toast.success(store.message() || 'invoices.messages.update.success');
        router.navigate(['/invoices']);
      } else {
        toast.error(store.error() || 'common.error');
      }
    } finally {
      saving.set(false);
    }
  }

  function goBack() { router.navigate(['/invoices']); }

  function syncFromCurrentIfPristine() {
    const current = store.current();
    if (current && (!form.dirty || !form.touched)) {
      const v: InvoiceFormValue = {
        reference: current.reference ?? null,
        state: current.state ?? 'DRAFT',
        actorId: current.actorId ?? null,
        claimId: current.claimId ?? null,
        createdAt: current.createdAt ?? new Date(),
        sendAt: current.sendAt ?? null,
        issueAt: current.issueAt ?? null,
        amount: current.amount ?? null,
        amountCurrency: current.amountCurrency ?? null,
        bankAccount: current.bankAccount ?? null,
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
    invalid,
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
