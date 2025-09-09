import {ChangeDetectionStrategy, Component, computed, signal} from '@angular/core';
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
import {TranslatePipe} from '../../../core/i18n/translate.pipe';

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
    SpinnerComponent,
    TranslatePipe
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
    <app-dialog [(open)]="addressDialogOpen" [title]="'actors.addresses.dialog.title' | t" (closed)="onAddressDialogClosed()">
      <app-address-form [value]="addressModel()" (valueChange)="onAddressFormChange($event)"
                        [cityRequiredError]="addressCityInteracted() && !addressModel().city?.trim()"
                        [countryRequiredError]="addressCountryInteracted() && !addressModel().country?.trim()"
                        [typeRequiredError]="false" (blurCity)="onAddressCityBlur()" (blurCountry)="onAddressCountryBlur()"/>
      <div dialog-actions class="flex flex-col sm:flex-row gap-2">
        <app-button [fullWidth]="true" class="sm:w-auto" variant="secondary" size="md" (clicked)="closeAddressDialog()"><span class="material-symbols-outlined text-base">close</span><span class="ml-1">{{ 'actors.addresses.dialog.action.cancel' | t }}</span></app-button>
        <app-button [disabled]="addressDialogInvalid()" [fullWidth]="true" class="sm:w-auto" variant="primary" size="md" (clicked)="saveAddressAndNew()"><span class="material-symbols-outlined text-base">add_circle</span><span class="ml-1">{{ 'actors.addresses.dialog.action.addNew' | t }}</span></app-button>
        <app-button [disabled]="addressDialogInvalid()" [fullWidth]="true" class="sm:w-auto" variant="primary" size="md" (clicked)="saveAddressAndClose()"><span class="material-symbols-outlined text-base">check_circle</span><span class="ml-1">{{ 'actors.addresses.dialog.action.addClose' | t }}</span></app-button>
      </div>
    </app-dialog>

    <!-- Contact Dialog -->
    <app-dialog [(open)]="contactDialogOpen" [title]="'actors.contacts.dialog.title' | t" (closed)="onContactDialogClosed()">
      <app-contact-form [value]="contactModel()" (valueChange)="onContactFormChange($event)"
                        [nameRequiredError]="contactNameInteracted() && !contactModel().name?.trim()"
                        [typeRequiredError]="false" (blurName)="onContactNameBlur()" />
      <div dialog-actions class="flex flex-col sm:flex-row gap-2">
        <app-button [fullWidth]="true" class="sm:w-auto" variant="secondary" size="md" (clicked)="closeContactDialog()"><span class="material-symbols-outlined text-base">close</span><span class="ml-1">{{ 'actors.contacts.dialog.action.cancel' | t }}</span></app-button>
        <app-button [disabled]="contactDialogInvalid()" [fullWidth]="true" class="sm:w-auto" variant="primary" size="md" (clicked)="saveContactAndNew()"><span class="material-symbols-outlined text-base">person_add</span><span class="ml-1">{{ 'actors.contacts.dialog.action.addNew' | t }}</span></app-button>
        <app-button [disabled]="contactDialogInvalid()" [fullWidth]="true" class="sm:w-auto" variant="primary" size="md" (clicked)="saveContactAndClose()"><span class="material-symbols-outlined text-base">check_circle</span><span class="ml-1">{{ 'actors.contacts.dialog.action.addClose' | t }}</span></app-button>
      </div>
    </app-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActorNewPage {
  readonly ui = useActorScreen();

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

  // Track when the user has interacted with the contact name field (blurred or typed non-empty once)
  contactNameInteracted = signal(false);
  // Track when the user has interacted with the address country field (blurred or typed non-empty once)
  addressCountryInteracted = signal(false);
  // Track when the user has interacted with the address city field (blurred or typed non-empty once)
  addressCityInteracted = signal(false);

  contactDialogInvalid = computed(() => !this.contactModel().name.trim());
  addressDialogInvalid = computed(() => !this.addressModel().city.trim() || !this.addressModel().country.trim());

  get form() { return this.ui.form; }
  get formValue() { return this.ui.formValue; }
  get loading() { return this.ui.loading; }

  nameHasError() { return this.ui.nameHasError(); }

  onValueChange(v: any) { return this.ui.onValueChange(v); }

  save() { return this.ui.saveNew(); }
  goBack() { return this.ui.goBack(); }


  openAddressDialog() {
    this.addressDialogOpen.set(true);
    this.addressCityInteracted.set(false);
    this.addressCountryInteracted.set(false);
  }
  private addAddressCommon(closeAfter: boolean) {
    const m = this.addressModel();
    if (!m.city.trim() || !m.country.trim()) return;
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


  openContactDialog() {
    this.contactDialogOpen.set(true);
    this.contactNameInteracted.set(false);
  }
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

  // Ensure the dialog reset on close from any source (button, backdrop, two-way binding)
  closeAddressDialog() {
    this.addressDialogOpen.set(false);
    this.onAddressDialogClosed();
  }
  onAddressDialogClosed() {
    this.addressModel.set(this.initialAddressFormValue);
    this.addressCityInteracted.set(false);
    this.addressCountryInteracted.set(false);
  }

  closeContactDialog() {
    this.contactDialogOpen.set(false);
    this.onContactDialogClosed();
  }
  onContactDialogClosed() {
    this.contactModel.set(this.initialContactValue);
    this.contactNameInteracted.set(false);
  }

  onContactFormChange(v: ContactFormValue) {
    this.contactModel.set(v);
    if (!this.contactNameInteracted() && v.name?.trim()) {
      this.contactNameInteracted.set(true);
    }
  }

  onAddressFormChange(v: AddressFormValue) {
    this.addressModel.set(v);
    if (!this.addressCityInteracted() && v.city?.trim()) {
      this.addressCityInteracted.set(true);
    }
    if (!this.addressCountryInteracted() && v.country?.trim()) {
      this.addressCountryInteracted.set(true);
    }
  }

  onContactNameBlur() {
    this.contactNameInteracted.set(true);
  }

  onAddressCityBlur() {
    this.addressCityInteracted.set(true);
  }

  onAddressCountryBlur() {
    this.addressCountryInteracted.set(true);
  }
}
