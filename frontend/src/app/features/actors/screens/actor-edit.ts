import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from '../../../shared/ui/action-bar';
import { ActorFormComponent, ActorBaseModel } from '../components/actor-form';
import { ActorTabsComponent } from '../components/actor-tabs';
import { ActorsStore, provideActorsStore } from '../actors.store';
import { Address, Contact } from '../models';
import { CardComponent } from '../../../shared/ui/card';
import { DialogComponent } from '../../../shared/ui/dialog';
import { AddressFormComponent } from '../components/address-form';
import { ContactFormComponent } from '../components/contact-form';
import { ButtonComponent } from '../../../shared/ui/button';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-actor-edit-page',
  standalone: true,
  imports: [CommonModule, ActionBarComponent, ActorFormComponent, ActorTabsComponent, CardComponent, DialogComponent, AddressFormComponent, ContactFormComponent, ButtonComponent],
  providers: [provideActorsStore()],
  template: `
    <app-action-bar
      [disableNew]="false"
      [disableEdit]="true"
      [disableCancel]="false"
      [disableSave]="!canSave()"
      (cancelClicked)="goView()"
      (saveClicked)="save()"
    />

    <div class="p-4 space-y-4">
      <app-card>
        <div class="space-y-6">
          <app-actor-form [model]="actorModel()" (modelChange)="onBaseChange($event)"></app-actor-form>
        </div>
      </app-card>
      <app-card>
        <app-actor-tabs
          [addresses]="store.addresses()"
          [contacts]="store.contacts()"
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
      <app-address-form [model]="addressModel()" (modelChange)="addressModel.set($event)" />
      <div dialog-actions class="flex flex-col sm:flex-row gap-2">
        <app-button [fullWidth]="true" class="sm:w-auto" variant="secondary" size="md" (clicked)="addressDialogOpen.set(false)"><span class="material-symbols-outlined text-base">close</span><span class="ml-1">Fermer</span></app-button>
        <app-button [fullWidth]="true" class="sm:w-auto" variant="primary" size="md" (clicked)="saveAddressAndClose()"><span class="material-symbols-outlined text-base">check_circle</span><span class="ml-1">Enregistrer</span></app-button>
      </div>
    </app-dialog>

    <!-- Contact Dialog -->
    <app-dialog [(open)]="contactDialogOpen" title="Ajouter/Modifier un contact">
      <app-contact-form [model]="contactModel()" (modelChange)="contactModel.set($event)" />
      <div dialog-actions class="flex flex-col sm:flex-row gap-2">
        <app-button [fullWidth]="true" class="sm:w-auto" variant="secondary" size="md" (clicked)="contactDialogOpen.set(false)"><span class="material-symbols-outlined text-base">close</span><span class="ml-1">Fermer</span></app-button>
        <app-button [fullWidth]="true" class="sm:w-auto" variant="primary" size="md" (clicked)="saveContactAndClose()"><span class="material-symbols-outlined text-base">check_circle</span><span class="ml-1">Enregistrer</span></app-button>
      </div>
    </app-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActorEditPage {
  store = inject(ActorsStore);
  route = inject(ActivatedRoute);
  router = inject(Router);

  actorModel = signal<ActorBaseModel>({ name: '', reference: '', category: '' });
  canSave = computed(() => (this.actorModel().name?.trim().length ?? 0) >= 2 && !this.store.loading());

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.load(id).then(() => {
        const a = this.store.currentActor();
        if (a) {
          this.actorModel.set({ name: a.name, reference: a.reference, category: a.category });
        }
      });
    }
  }

  onBaseChange(v: ActorBaseModel) {
    this.actorModel.set(v);
    const a = this.store.currentActor();
    this.store.setActor({ id: a?.id || '', ...v, addresses: this.store.addresses(), contacts: this.store.contacts() } as any);
  }

  async save() {
    const a = this.store.currentActor();
    if (!a) return;
    try {
      await this.store.update(a.id, { ...this.actorModel() } as any);
      alert('Acteur mis à jour');
      this.goView();
    } catch {}
  }

  goView() {
    const a = this.store.currentActor();
    if (a) this.router.navigate(['../'], { relativeTo: this.route });
  }

  // Dialogs
  addressDialogOpen = signal(false);
  contactDialogOpen = signal(false);
  addressModel = signal<{ type: Address['type']; street: string; city: string; country: string }>({ type: 'autres', street: '', city: '', country: '' });
  contactModel = signal<{ type: Contact['type']; name: string; phone: string; email: string; role?: string }>({ type: 'commercial', name: '', phone: '', email: '', role: '' });

  openAddressDialog(a?: Address) {
    if (a) this.addressModel.set({ type: a.type, street: a.street, city: a.city, country: a.country });
    this.addressDialogOpen.set(true);
  }
  saveAddressAndClose() {
    const m = this.addressModel();
    if (!m.street.trim() || !m.city.trim() || !m.country.trim()) return;
    // when editing, we should have selected address; for simplicity treat as add/update when same fields
    const existing = this.store.addresses().find(x => x.street === m.street && x.city === m.city && x.country === m.country);
    const a: Address = existing ? { ...existing, ...m } as Address : { id: crypto.randomUUID(), ...m } as Address;
    existing ? this.store.updateAddress(a) : this.store.addAddress(a);
    this.addressDialogOpen.set(false);
  }

  editAddress(a: Address) { this.openAddressDialog(a); }
  removeAddress(id: string) { this.store.removeAddress(id); }

  openContactDialog(c?: Contact) {
    if (c) this.contactModel.set({ type: c.type, name: c.name, phone: c.phone, email: c.email, role: c.role || '' });
    this.contactDialogOpen.set(true);
  }
  saveContactAndClose() {
    const m = this.contactModel();
    if (!m.name.trim()) return;
    const existing = this.store.contacts().find(x => x.email === m.email && !!m.email);
    const c: Contact = existing ? { ...existing, ...m } as Contact : { id: crypto.randomUUID(), ...m } as Contact;
    existing ? this.store.updateContact(c) : this.store.addContact(c);
    this.contactDialogOpen.set(false);
  }

  editContact(c: Contact) { this.openContactDialog(c); }
  removeContact(id: string) { this.store.removeContact(id); }
}
