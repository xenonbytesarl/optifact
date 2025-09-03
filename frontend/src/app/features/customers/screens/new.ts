import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CustomerFormComponent, CustomerBaseModel } from '../components/customer-form';
import { CustomerTabsComponent } from '../components/customer-tabs';
import { CustomersStore, provideCustomersStore } from '../customers.store';
import { Address, Contact } from '../models';
import { CardComponent } from '../../../shared/ui/card';

@Component({
  selector: 'app-customer-new-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, CustomerFormComponent, CustomerTabsComponent, CardComponent],
  providers: [provideCustomersStore()],
  template: `
    <app-action-bar
      [disableNew]="false"
      [disableEdit]="false"
      [disableCancel]="false"
      [disableSave]="false"
      (cancelClicked)="reset()"
      (saveClicked)="save()"
    />

    <div class="p-4">
      <app-card>
        <div class="space-y-6">
          <app-customer-form [model]="customerModel()" (modelChange)="onBaseChange($event)"></app-customer-form>
          <div class="border-t border-token"></div>
          <app-customer-tabs
            [addresses]="store.addresses()"
            [contacts]="store.contacts()"
            (addAddress)="openAddressDialog()"
            (editAddress)="editAddress($event)"
            (removeAddress)="removeAddress($event)"
            (addContact)="openContactDialog()"
            (editContact)="editContact($event)"
            (removeContact)="removeContact($event)"
          />
        </div>
      </app-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CustomerNewPage {
  store = inject(CustomersStore);

  customerModel = signal<CustomerBaseModel>({ name: '', reference: '', category: '' });
  canSave = computed(() => (this.customerModel().name?.trim().length ?? 0) >= 2 && !this.store.loading());

  onBaseChange(v: CustomerBaseModel) { this.customerModel.set(v); this.store.currentCustomer.set({ id: '', ...v, addresses: this.store.addresses(), contacts: this.store.contacts() }); }

  reset() {
    this.customerModel.set({ name: '', reference: '', category: '' });
    this.store.setCustomer({ id: '', name: '', reference: '', category: '', addresses: [], contacts: [] });
  }

  async save() {
    const payload = { ...this.customerModel() };
    try {
      await this.store.create(payload as any);
      alert('Client créé');
    } catch {}
  }

  // Dialogs placeholders
  openAddressDialog() {
    const a: Address = { id: crypto.randomUUID(), type: 'autres', street: 'Rue', city: 'Ville', country: 'Pays' };
    this.store.addAddress(a);
  }
  editAddress(a: Address) { this.store.updateAddress(a); }
  removeAddress(id: string) { this.store.removeAddress(id); }

  openContactDialog() {
    const c: Contact = { id: crypto.randomUUID(), type: 'commercial', name: 'Contact', phone: '', email: '', role: '' };
    this.store.addContact(c);
  }
  editContact(c: Contact) { this.store.updateContact(c); }
  removeContact(id: string) { this.store.removeContact(id); }
}
