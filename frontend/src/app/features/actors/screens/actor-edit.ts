import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { ActorFormComponent } from '../components/actor-form';
import { ActorTabsComponent } from '../components/actor-tabs';
import { Address, Contact } from '../../../core/api/actor/models';
import { CardComponent } from '../../../shared/ui/card';
import { DialogComponent } from '../../../shared/ui/dialog';
import { AddressFormComponent } from '../components/address-form';
import { ContactFormComponent } from '../components/contact-form';
import { ButtonComponent } from '../../../shared/ui/button';
import { SpinnerComponent } from '../../../shared/ui/spinner';
import { ActivatedRoute } from '@angular/router';
import { useActorScreen } from './actor-screen.util';
import {AddressFormValue, ContactFormValue} from '../components/actor.form.value';

@Component({
  selector: 'app-actor-edit-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, ActorFormComponent, ActorTabsComponent, CardComponent, DialogComponent, AddressFormComponent, ContactFormComponent, ButtonComponent, SpinnerComponent],
  providers: [],
  template: `
    <app-action-bar
      [showNew]="false"
      [showEdit]="false"
      [disableSave]="form.invalid || loading()"
      (cancelClicked)="goBack()"
      (saveClicked)="save()"
    />

    <div class="p-4 space-y-4">
      @if (loading()) {
        <app-spinner [overlay]="true" />
      }
      <app-card>
        <div class="space-y-6">
          <app-actor-form
            [disabled]="loading()"
            [value]="formValue()"
            [nameRequiredError]="nameHasError()"
            (valueChange)="onValueChange($event)"
          />
        </div>
        <app-actor-tabs
          [addresses]="ui.addresses()"
          [contacts]="ui.contacts()"
          (addAddress)="openAddressDialog()"
          (editAddress)="editAddress($event)"
          (removeAddress)="removeAddress($event)"
          (addContact)="openContactDialog()"
          (editContact)="editContact($event)"
          (removeContact)="removeContact($event)"
        />
      </app-card>
    </div>

    <!-- Address Dialog -->
    <app-dialog [(open)]="addressDialogOpen" title="Ajouter/Modifier une adresse">
      <app-address-form [value]="addressModel()" (valueChange)="addressModel.set($event)" />
      <div dialog-actions class="flex flex-col sm:flex-row gap-2">
        <app-button [fullWidth]="true" class="sm:w-auto" variant="secondary" size="md" (clicked)="addressDialogOpen.set(false)"><span class="material-symbols-outlined text-base">close</span><span class="ml-1">Fermer</span></app-button>
        <app-button [fullWidth]="true" class="sm:w-auto" variant="primary" size="md" (clicked)="saveAddressAndClose()"><span class="material-symbols-outlined text-base">check_circle</span><span class="ml-1">Enregistrer</span></app-button>
      </div>
    </app-dialog>

    <!-- Contact Dialog -->
    <app-dialog [(open)]="contactDialogOpen" title="Ajouter/Modifier un contact">
      <app-contact-form [value]="contactModel()" (valueChange)="contactModel.set($event)" />
      <div dialog-actions class="flex flex-col sm:flex-row gap-2">
        <app-button [fullWidth]="true" class="sm:w-auto" variant="secondary" size="md" (clicked)="contactDialogOpen.set(false)"><span class="material-symbols-outlined text-base">close</span><span class="ml-1">Fermer</span></app-button>
        <app-button [fullWidth]="true" class="sm:w-auto" variant="primary" size="md" (clicked)="saveContactAndClose()"><span class="material-symbols-outlined text-base">check_circle</span><span class="ml-1">Enregistrer</span></app-button>
      </div>
    </app-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActorEditPage {
  readonly ui = useActorScreen();
  readonly route = inject(ActivatedRoute);

  addressDialogOpen = signal(false);
  contactDialogOpen = signal(false);

  readonly initialAddressFormValue: AddressFormValue = {
    id: '',
    type: 'DEFAULT',
    street: '',
    city: '',
    country: '',
    zipCode: '',
    state: '',
    actorId: ''
  };

  readonly initialContactValue: ContactFormValue = {
    id: '',
    type: 'DEFAULT',
    name: '',
    phone: '',
    email: '',
    actorId: '',
    function: '',
  };

  addressModel = signal<AddressFormValue>(this.initialAddressFormValue);
  contactModel = signal<ContactFormValue>(this.initialContactValue);

  get form() { return this.ui.form; }
  get formValue() { return this.ui.formValue; }
  get loading() { return this.ui.loading; }

  constructor() {
    // Ensure form mirrors the resolved current actor
    this.ui.syncFromCurrentIfPristine();
  }

  nameHasError() { return this.ui.nameHasError(); }
  onValueChange(v: any) { return this.ui.onValueChange(v); }

  save() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    return this.ui.saveEdit(id);
  }
  goBack() { return this.ui.goBack(); }

  openAddressDialog(a?: Address) {
    if (a) this.addressModel.set({
      id: a.id ?? null,
      type: a.type,
      street: a.street ?? null,
      city: a.city,
      country: a.country,
      zipCode: a.zipCode ?? null,
      state: a.state ?? null,
      actorId: a.actorId ?? null
    });
    this.addressDialogOpen.set(true);
  }
  private addOrUpdateAddressClose() {
    const m = this.addressModel();
    if (!m?.street?.trim() || !m.city.trim() || !m.country.trim()) return;
    const a: Address = { ...m, id: m.id ?? crypto.randomUUID() } as Address;
    // decide update vs add based on presence of id in the current list
    const exists = this.ui.addresses().some(x => x.id === a.id);
    exists ? this.ui.updateAddress(a) : this.ui.addAddress(a);
    this.addressDialogOpen.set(false);
    this.addressModel.set(this.initialAddressFormValue);
  }
  saveAddressAndClose() { this.addOrUpdateAddressClose(); }
  editAddress(a: Address) { this.openAddressDialog(a); }
  removeAddress(id: string) { this.ui.removeAddress(id); }

  openContactDialog(c?: Contact) {
    if (c) this.contactModel.set({
      id: c.id ?? null,
      type: c.type,
      name: c.name,
      phone: c.phone ?? null,
      email: c.email ?? null,
      function: c.function ?? null,
      actorId: c.actorId ?? null,
    });
    this.contactDialogOpen.set(true);
  }
  private addOrUpdateContactClose() {
    const m = this.contactModel();
    if (!m.name.trim()) return;
    const c: Contact = { ...m, id: m.id ?? crypto.randomUUID() } as Contact;
    const exists = this.ui.contacts().some(x => x.id === c.id);
    exists ? this.ui.updateContact(c) : this.ui.addContact(c);
    this.contactDialogOpen.set(false);
    this.contactModel.set(this.initialContactValue);
  }
  saveContactAndClose() { this.addOrUpdateContactClose(); }
  editContact(c: Contact) { this.openContactDialog(c); }
  removeContact(id: string) { this.ui.removeContact(id); }
}
