import { ChangeDetectionStrategy, Component, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Address, Contact } from '../../../core/api/actor/models';
import { ButtonComponent } from '../../../shared/ui/button';
import { TabsComponent, TabItem } from '../../../shared/ui/tabs';
import { TableComponent } from '../../../shared/ui/table';
import { PaginatorComponent } from '../../../shared/ui/paginator';

import { ConfirmDialogService } from '../../../shared/ui/confirm-dialog';
import { TranslateService } from '../../../core/i18n/translate.service';

@Component({
  selector: 'app-actor-tabs',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TabsComponent, TableComponent, PaginatorComponent],
  template: `
  <div>
    <app-tabs [items]="tabItems" [(active)]="tab">
      @if (tab==='addresses') {
        <div>
          @if (!readonly()) {
            <div class="mb-2"><app-button (clicked)="addAddress.emit()"><span class="material-symbols-outlined text-base">add</span><span class="ml-1">Ajouter une adresse</span></app-button></div>
          }
          <app-table [rows]="addressesPaged()" [columns]="addressColumns()">
            <ng-template #actions let-row>
              @if (!readonly()) {
                <app-button size="sm" variant="ghost" shadow="none" hoverShadow="none" (clicked)="editAddress.emit(row)" aria-label="Modifier">
                  <span class="material-symbols-outlined text-base">edit</span>
                </app-button>
                <app-button size="sm" variant="ghost" shadow="none" hoverShadow="none" (clicked)="confirmRemoveAddress(row)" aria-label="Supprimer">
                  <span class="material-symbols-outlined text-base text-red-600">delete</span>
                </app-button>
              }
            </ng-template>
          </app-table>
          <app-paginator [total]="addresses().length" [(page)]="addressesPage" [(pageSize)]="addressesPageSize" />
        </div>
      }

      @if (tab==='contacts') {
        <div>
          @if (!readonly()) {
            <div class="mb-2"><app-button (clicked)="addContact.emit()"><span class="material-symbols-outlined text-base">person_add</span><span class="ml-1">Ajouter un contact</span></app-button></div>
          }
          <app-table [rows]="contactsPaged()" [columns]="contactColumns()">
            <ng-template #actions let-row>
              @if (!readonly()) {
                <app-button size="sm" shadow="none" variant="ghost" (clicked)="editContact.emit(row)" aria-label="Modifier">
                  <span class="material-symbols-outlined text-base">edit</span>
                </app-button>
                <app-button size="sm" shadow="none" variant="ghost" (clicked)="confirmRemoveContact(row)" aria-label="Supprimer">
                  <span class="material-symbols-outlined text-base text-red-600">delete</span>
                </app-button>
              }
            </ng-template>
          </app-table>
          <app-paginator [total]="contacts().length" [(page)]="contactsPage" [(pageSize)]="contactsPageSize" />
        </div>
      }
    </app-tabs>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActorTabsComponent {
  private confirm = inject(ConfirmDialogService);
  private i18n = inject(TranslateService);
  addressColumns = signal<{key: string, header: string}[]>([
    { key: 'type', header: 'Type' },
    { key: 'street', header: 'Rue' },
    { key: 'city', header: 'Ville' },
    { key: 'country', header: 'Pays' }
  ]);
  contactColumns = signal<{key: string, header: string}[]>([
    { key: 'type', header: 'Type' },
    { key: 'name', header: 'Nom' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Téléphone' },
    { key: 'role', header: 'Fonction' }

  ]);
  addresses = input.required<Address[]>();
  contacts = input.required<Contact[]>();
  readonly = input<boolean>(false);

  addAddress = output<void>();
  editAddress = output<Address>();
  removeAddress = output<string>();

  addContact = output<void>();
  editContact = output<Contact>();
  removeContact = output<string>();

  get tabItems(): TabItem[] {
    return [
      { id: 'addresses', label: 'Adresses' },
      { id: 'contacts', label: 'Contacts' }
    ];
  }

  tab: 'addresses' | 'contacts' = 'addresses';

  // Pagination states for each tab
  addressesPage = signal(1);
  addressesPageSize = signal(5);
  contactsPage = signal(1);
  contactsPageSize = signal(5);

  addressesPaged = computed(() => {
    const start = (this.addressesPage() - 1) * this.addressesPageSize();
    return this.addresses().slice(start, start + this.addressesPageSize());
  });

  contactsPaged = computed(() => {
    const start = (this.contactsPage() - 1) * this.contactsPageSize();
    return this.contacts().slice(start, start + this.contactsPageSize());
  });

  async confirmRemoveAddress(row: Address) {
    const ok = await this.confirm.open({ message: this.i18n.t('confirm.delete.address') });
    if (!ok) return;
    this.removeAddress.emit(row?.id as string);
  }

  async confirmRemoveContact(row: Contact) {
    const ok = await this.confirm.open({ message: this.i18n.t('confirm.delete.contact') });
    if (!ok) return;
    this.removeContact.emit(row.id as string);
  }
}
