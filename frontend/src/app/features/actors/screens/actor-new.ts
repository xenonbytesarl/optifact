import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { ActorFormComponent } from '../components/actor-form';
import { ActorTabsComponent } from '../components/actor-tabs';
import { CardComponent } from '../../../shared/ui/card';
import { DialogComponent } from '../../../shared/ui/dialog';
import { AddressFormComponent } from '../components/address-form';
import { ContactFormComponent } from '../components/contact-form';
import { ButtonComponent } from '../../../shared/ui/button';
import { SpinnerComponent } from '../../../shared/ui/spinner';
import { useActorScreen } from './actor-screen.util';
import {Contact, Address} from '../../../core/api/actor/models';
import {AddressFormValue, ContactFormValue} from '../components/actor.form.value';

@Component({
  selector: 'app-actor-new-page',
  standalone: true,
  imports: [
    CommonModule,
    ActionBarComponent,
    ActorFormComponent,
    ActorTabsComponent,
    CardComponent,
    DialogComponent,
    AddressFormComponent,
    ContactFormComponent,
    ButtonComponent,
    SpinnerComponent
  ],
  providers: [],
  template: `
    <app-action-bar
      [showNew]="false"
      [showEdit]="false"
      [disableSave]="form.invalid || loading()"
      (saveClicked)="save()"
      (cancelClicked)="goBack()"
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
    <app-dialog [(open)]="addressDialogOpen" title="Ajouter une adresse">
      <app-address-form [value]="addressModel()" (valueChange)="addressModel.set($event)" />
      <div dialog-actions class="flex flex-col sm:flex-row gap-2">
        <app-button [fullWidth]="true" class="sm:w-auto" variant="secondary" size="md" (clicked)="addressDialogOpen.set(false)"><span class="material-symbols-outlined text-base">close</span><span class="ml-1">Annuler</span></app-button>
        <app-button [fullWidth]="true" class="sm:w-auto" variant="primary" size="md" (clicked)="saveAddressAndNew()"><span class="material-symbols-outlined text-base">add_circle</span><span class="ml-1">Ajouter et nouveau</span></app-button>
        <app-button [fullWidth]="true" class="sm:w-auto" variant="primary" size="md" (clicked)="saveAddressAndClose()"><span class="material-symbols-outlined text-base">check_circle</span><span class="ml-1">Ajouter et fermer</span></app-button>
      </div>
    </app-dialog>

    <!-- Contact Dialog -->
    <app-dialog [(open)]="contactDialogOpen" title="Ajouter un contact">
      <app-contact-form [value]="contactModel()" (valueChange)="contactModel.set($event)" />
      <div dialog-actions class="flex flex-col sm:flex-row gap-2">
        <app-button [fullWidth]="true" class="sm:w-auto" variant="secondary" size="md" (clicked)="contactDialogOpen.set(false)"><span class="material-symbols-outlined text-base">close</span><span class="ml-1">Annuler</span></app-button>
        <app-button [fullWidth]="true" class="sm:w-auto" variant="primary" size="md" (clicked)="saveContactAndNew()"><span class="material-symbols-outlined text-base">person_add</span><span class="ml-1">Ajouter et nouveau</span></app-button>
        <app-button [fullWidth]="true" class="sm:w-auto" variant="primary" size="md" (clicked)="saveContactAndClose()"><span class="material-symbols-outlined text-base">check_circle</span><span class="ml-1">Ajouter et fermer</span></app-button>
      </div>
    </app-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActorNewPage {
  ui = useActorScreen();

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

  nameHasError() { return this.ui.nameHasError(); }

  onValueChange(v: any) { return this.ui.onValueChange(v); }

  save() { return this.ui.saveNew(); }
  goBack() { return this.ui.goBack(); }


  openAddressDialog() { this.addressDialogOpen.set(true); }
  private addAddressCommon(closeAfter: boolean) {
    const m = this.addressModel();
    if (!m?.street?.trim() || !m.city.trim() || !m.country.trim()) return;
    const a: Address = {...m, id: crypto.randomUUID().toString()  } as Address;
    this.ui.addAddress(a);
    if (closeAfter) {
      this.addressDialogOpen.set(false);
    }
    // reset the form for a new entry
    this.addressModel.set(this.initialAddressFormValue);
  }

  saveAddressAndNew() { this.addAddressCommon(false); }
  saveAddressAndClose() { this.addAddressCommon(true); }
  // kept for backward compatibility if referenced elsewhere
  saveAddressFromDialog() { this.saveAddressAndClose(); }

  editAddress(a: Address) { this.ui.updateAddress(a); }
  removeAddress(id: string) { this.ui.removeAddress(id); }


  openContactDialog() { this.contactDialogOpen.set(true); }
  private addContactCommon(closeAfter: boolean) {
    const m = this.contactModel();
    if (!m.name.trim()) return;
    const c: Contact = { ...m, id: crypto.randomUUID() } as Contact;
    this.ui.addContact(c);
    if (closeAfter) {
      this.contactDialogOpen.set(false);
    }
    // reset the form for a new entry
    this.contactModel.set(this.initialContactValue);
  }
  saveContactAndNew() { this.addContactCommon(false); }
  saveContactAndClose() { this.addContactCommon(true); }
  // kept for backward compatibility if referenced elsewhere
  saveContactFromDialog() { this.saveContactAndClose(); }

  editContact(c: Contact) { this.ui.updateContact(c); }
  removeContact(id: string) { this.ui.removeContact(id); }

}
