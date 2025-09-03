import { inject, signal, computed } from '@angular/core';
import { CustomersApi } from '../../core/api/customers.api';
import { Address, Contact, Customer } from './models';

export class CustomersStore {
  private api = inject(CustomersApi);

  currentCustomer = signal<Customer | null>(null);
  addresses = signal<Address[]>([]);
  contacts = signal<Contact[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  formDirty = signal(false);

  addressesCount = computed(() => this.addresses().length);
  contactsCount = computed(() => this.contacts().length);
  canSave = computed(() => {
    const c = this.currentCustomer();
    return !!c && c.name?.trim().length >= 2 && !this.loading();
  });

  setCustomer(c: Customer | null) {
    this.currentCustomer.set(c);
    this.addresses.set(c?.addresses ?? []);
    this.contacts.set(c?.contacts ?? []);
    this.formDirty.set(false);
  }

  addAddress(a: Address) {
    const list = [...this.addresses()];
    // ensure only one default
    if (a.type === 'défaut') {
      for (const item of list) {
        if (item.type === 'défaut') item.type = 'autres';
      }
    }
    this.addresses.set([a, ...list]);
    this.formDirty.set(true);
  }

  updateAddress(a: Address) {
    this.addresses.set(this.addresses().map(x => x.id === a.id ? a : x));
    this.formDirty.set(true);
  }

  removeAddress(id: string) {
    this.addresses.set(this.addresses().filter(x => x.id !== id));
    this.formDirty.set(true);
  }

  addContact(c: Contact) {
    this.contacts.set([c, ...this.contacts()]);
    this.formDirty.set(true);
  }

  updateContact(c: Contact) {
    this.contacts.set(this.contacts().map(x => x.id === c.id ? c : x));
    this.formDirty.set(true);
  }

  removeContact(id: string) {
    this.contacts.set(this.contacts().filter(x => x.id !== id));
    this.formDirty.set(true);
  }

  async load(id: string) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.api.get(id);
      if (data) this.setCustomer(data);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Erreur de chargement');
    } finally {
      this.loading.set(false);
    }
  }

  async create(payload: Partial<Customer>) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const created = await this.api.create({ ...payload, addresses: this.addresses(), contacts: this.contacts() });
      this.setCustomer(created as Customer);
      return created;
    } catch (e: any) {
      this.error.set(e?.message ?? 'Erreur de création');
      throw e;
    } finally {
      this.loading.set(false);
    }
  }

  async update(id: string, payload: Partial<Customer>) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const updated = await this.api.update(id, { ...payload, addresses: this.addresses(), contacts: this.contacts() });
      this.setCustomer(updated as Customer);
      return updated;
    } catch (e: any) {
      this.error.set(e?.message ?? 'Erreur de mise à jour');
      throw e;
    } finally {
      this.loading.set(false);
    }
  }
}

export function provideCustomersStore() {
  return [{ provide: CustomersStore, useClass: CustomersStore }];
}
