import { inject, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/ui/toast';
import {actorStore} from '../actors.store';
import {ActorFormValue, AddressFormValue, ContactFormValue} from '../components/actor.form.value';
import {Address, Contact} from '../../../core/api/actor/models';

export function useActorScreen() {
  const store = inject(actorStore);
  const fb = inject(FormBuilder);
  const router = inject(Router);
  const toast = inject(ToastService);

  const form: FormGroup = fb.group({
    name: ['', [Validators.required]],
    reference: [''],
    contacts: fb.array([]),
    addresses: fb.array([])
  });

  const initialActorFormValue: ActorFormValue = {
    name: '',
    reference: '',
    contacts: [],
    addresses: []
  };
  const formValue = signal<ActorFormValue>(initialActorFormValue);
  const loading = computed(() => store.loading());

  function syncFromCurrentIfPristine() {
    const current = store.current();
    if (current && form.pristine) {
      const reference = current.reference ?? '';
      const name = current.name ?? '';
      const contacts = (current.contacts ?? []) as ContactFormValue[];
      const addresses = (current.addresses ?? []) as AddressFormValue[];
      formValue.set({ reference, name, contacts, addresses });
      form.patchValue({ reference, name, contacts: current.contacts ?? [], addresses: current.addresses ?? [] });
      form.markAsPristine();
      form.markAsUntouched();
    }
  }

  function nameHasError(): boolean {
    const c = form.get('name');
    return !!c && c.invalid && (c.dirty || c.touched);
  }


  function onValueChange(v: ActorFormValue) {
    formValue.set(v);
    form.patchValue({
      name: v.name,
      reference: v.reference,
      contacts: v.contacts,
      addresses: v.addresses
    });
  }

  function onNameBlur() {
    form.get('name')?.markAsTouched();
  }

  function onReferenceBlur() {
    form.get('reference')?.markAsTouched();
  }

  function resetForm() {
    store.resetForm();
    formValue.set(initialActorFormValue);
    form.patchValue(initialActorFormValue);
    form.markAsPristine();
    form.markAsUntouched();
  }

  async function saveNew() {
    if (form.invalid || loading()) {
      form.markAllAsTouched();
      return false;
    }
    const payload = { ...formValue() };
    const response = await store.create({
      name: payload.name,
      reference: payload.reference,
      contacts: payload.contacts as Contact[],
      addresses: payload.addresses as Address[]
    });

    if (response) {
      toast.success(store.message() as string);
      router.navigate(['/actors', store.current()?.id]);
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
    const response = await store.update(id, {
      name: payload.name,
      reference: payload.reference,
      contacts: payload.contacts as Contact[],
      addresses: payload.addresses as Address[]
    });
    if (response) {
      toast.info(store.message() as string);
      router.navigate(['/actors', store.current()?.id]);
      return true;
    } else {
      toast.error(store.error() as string);
      return false;
    }
  }

  function goBack() {
    resetForm();
    router.navigate(['/actors', 'list']);
  }

  // address helpers
  const addresses = computed(() => (formValue().addresses as Address[]) || []);
  function addAddress(a: Address) {
    const next = [...addresses(), a] as AddressFormValue[];
    formValue.set({ ...formValue(), addresses: next });
  }
  function updateAddress(a: Address) {
    const next = addresses().map(x => (x.id === a.id ? { ...x, ...a } : x)) as AddressFormValue[];
    formValue.set({ ...formValue(), addresses: next });
  }
  function removeAddress(id: string) {
    const next = addresses().filter(x => x.id !== id) as AddressFormValue[];
    formValue.set({ ...formValue(), addresses: next });
  }

  // contact helpers
  const contacts = computed(() => (formValue().contacts as Contact[]) || []);
  function addContact(c: Contact) {
    const next = [...contacts(), c] as ContactFormValue[];
    formValue.set({ ...formValue(), contacts: next });
  }
  function updateContact(c: Contact) {
    const next = contacts().map(x => (x.id === c.id ? { ...x, ...c } : x)) as ContactFormValue[];
    formValue.set({ ...formValue(), contacts: next });
  }
  function removeContact(id: string) {
    const next = contacts().filter(x => x.id !== id) as ContactFormValue[];
    formValue.set({ ...formValue(), contacts: next });
  }

  return {
    store,
    form,
    formValue,
    loading,
    nameHasError,
    onValueChange,
    onNameBlur,
    onReferenceBlur,
    resetForm,
    saveNew,
    saveEdit,
    goBack,
    syncFromCurrentIfPristine,
    // expose helpers for pages
    addresses,
    contacts,
    addAddress,
    updateAddress,
    removeAddress,
    addContact,
    updateContact,
    removeContact
  };
}
