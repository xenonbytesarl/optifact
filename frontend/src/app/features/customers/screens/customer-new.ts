import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { CustomerFormComponent, CustomerBaseModel } from '../components/customer-form';
import { CustomerTabsComponent } from '../components/customer-tabs';
import { CustomersStore, provideCustomersStore } from '../customers.store';
import { Address, Contact } from '../models';
import { CardComponent } from '../../../shared/ui/card';
import { DialogComponent } from '../../../shared/ui/dialog';
import { AddressFormComponent } from '../components/address-form';
import { ContactFormComponent } from '../components/contact-form';
import { ButtonComponent } from '../../../shared/ui/button';

@Component({
  selector: 'app-customer-new-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, CustomerFormComponent, CustomerTabsComponent, CardComponent, DialogComponent, AddressFormComponent, ContactFormComponent, ButtonComponent],
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

    <!-- Address Dialog -->
    <app-dialog [(open)]="addressDialogOpen" title="Ajouter une adresse">
      <app-address-form [model]="addressModel()" (modelChange)="addressModel.set($event)" />
      <div dialog-actions class="flex flex-col sm:flex-row gap-2">
        <app-button [fullWidth]="true" class="sm:w-auto" variant="secondary" size="md" (clicked)="addressDialogOpen.set(false)"><span class="material-symbols-outlined text-base">close</span><span class="ml-1">Annuler</span></app-button>
        <app-button [fullWidth]="true" class="sm:w-auto" variant="primary" size="md" (clicked)="saveAddressAndNew()"><span class="material-symbols-outlined text-base">add_circle</span><span class="ml-1">Ajouter et nouveau</span></app-button>
        <app-button [fullWidth]="true" class="sm:w-auto" variant="primary" size="md" (clicked)="saveAddressAndClose()"><span class="material-symbols-outlined text-base">check_circle</span><span class="ml-1">Ajouter et fermer</span></app-button>
      </div>
    </app-dialog>

    <!-- Contact Dialog -->
    <app-dialog [(open)]="contactDialogOpen" title="Ajouter un contact">
      <app-contact-form [model]="contactModel()" (modelChange)="contactModel.set($event)" />
      <div dialog-actions class="flex flex-col sm:flex-row gap-2">
        <app-button [fullWidth]="true" class="sm:w-auto" variant="secondary" size="md" (clicked)="contactDialogOpen.set(false)"><span class="material-symbols-outlined text-base">close</span><span class="ml-1">Annuler</span></app-button>
        <app-button [fullWidth]="true" class="sm:w-auto" variant="primary" size="md" (clicked)="saveContactAndNew()"><span class="material-symbols-outlined text-base">person_add</span><span class="ml-1">Ajouter et nouveau</span></app-button>
        <app-button [fullWidth]="true" class="sm:w-auto" variant="primary" size="md" (clicked)="saveContactAndClose()"><span class="material-symbols-outlined text-base">check_circle</span><span class="ml-1">Ajouter et fermer</span></app-button>
      </div>
    </app-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CustomerNewPage {
  store = inject(CustomersStore);

  customerModel = signal<CustomerBaseModel>({ name: '', reference: '', category: '' });
  canSave = computed(() => (this.customerModel().name?.trim().length ?? 0) >= 2 && !this.store.loading());

  onBaseChange(v: CustomerBaseModel) { this.customerModel.set(v); this.store.setCustomer({ id: '', ...v, addresses: this.store.addresses(), contacts: this.store.contacts() } as any); }

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

  // Dialogs
  addressDialogOpen = signal(false);
  contactDialogOpen = signal(false);
  addressModel = signal<{ type: Address['type']; street: string; city: string; country: string }>({ type: 'autres', street: '', city: '', country: '' });
  contactModel = signal<{ type: Contact['type']; name: string; phone: string; email: string; role?: string }>({ type: 'commercial', name: '', phone: '', email: '', role: '' });

  openAddressDialog() { this.addressDialogOpen.set(true); }
  private addAddressCommon(closeAfter: boolean) {
    const m = this.addressModel();
    if (!m.street.trim() || !m.city.trim() || !m.country.trim()) return;
    const a: Address = { id: crypto.randomUUID(), ...m } as Address;
    this.store.addAddress(a);
    if (closeAfter) {
      this.addressDialogOpen.set(false);
    }
    // reset form for a new entry
    this.addressModel.set({ type: 'autres', street: '', city: '', country: '' });
  }
  saveAddressAndNew() { this.addAddressCommon(false); }
  saveAddressAndClose() { this.addAddressCommon(true); }
  // kept for backward compatibility if referenced elsewhere
  saveAddressFromDialog() { this.saveAddressAndClose(); }

  editAddress(a: Address) { this.store.updateAddress(a); }
  removeAddress(id: string) { this.store.removeAddress(id); }

  openContactDialog() { this.contactDialogOpen.set(true); }
  private addContactCommon(closeAfter: boolean) {
    const m = this.contactModel();
    if (!m.name.trim()) return;
    const c: Contact = { id: crypto.randomUUID(), ...m } as Contact;
    this.store.addContact(c);
    if (closeAfter) {
      this.contactDialogOpen.set(false);
    }
    // reset form for a new entry
    this.contactModel.set({ type: 'commercial', name: '', phone: '', email: '', role: '' });
  }
  saveContactAndNew() { this.addContactCommon(false); }
  saveContactAndClose() { this.addContactCommon(true); }
  // kept for backward compatibility if referenced elsewhere
  saveContactFromDialog() { this.saveContactAndClose(); }

  editContact(c: Contact) { this.store.updateContact(c); }
  removeContact(id: string) { this.store.removeContact(id); }
}
