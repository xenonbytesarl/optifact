import { ChangeDetectionStrategy, Component, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Address, Contact } from '../../../core/api/actor/models';
import { ButtonComponent } from '../../../shared/ui/button';
import { TabsComponent, TabItem } from '../../../shared/ui/tabs';
import { TableComponent } from '../../../shared/ui/table';
import { PaginatorComponent } from '../../../shared/ui/paginator';

import { ConfirmDialogService } from '../../../shared/ui/confirm-dialog';
import { TranslateService } from '../../../core/i18n/translate.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-actor-tabs',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TabsComponent, TableComponent, PaginatorComponent, TranslatePipe],
  template: `
  <div>
    <app-tabs [items]="tabItems()" [(active)]="tab">
      @if (tab==='addresses') {
        <div>
          @if (!readonly()) {
            <div class="mb-2"><app-button icon="add" [label]="'actors.addresses.actions.add' | t" (clicked)="addAddress.emit()" /></div>
          }
          <app-table [rows]="addressesPaged()" [columns]="addressColumns()">
            <ng-template #actions let-row>
              @if (!readonly()) {
                <app-button size="sm" variant="ghost" shadow="none" hoverShadow="none" (clicked)="editAddress.emit(row)" [attr.aria-label]="('common.actions.edit' | t)">
                  <span class="material-symbols-outlined text-base">edit</span>
                </app-button>
                <app-button size="sm" variant="ghost" shadow="none" hoverShadow="none" (clicked)="confirmRemoveAddress(row)" [attr.aria-label]="('common.actions.delete' | t)">
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
            <div class="mb-2"><app-button icon="person_add" [label]="'actors.contacts.actions.add' | t" (clicked)="addContact.emit()" /></div>
          }
          <app-table [rows]="contactsPaged()" [columns]="contactColumns()">
            <ng-template #actions let-row>
              @if (!readonly()) {
                <app-button size="sm" shadow="none" variant="ghost" (clicked)="editContact.emit(row)" [attr.aria-label]="('common.actions.edit' | t)">
                  <span class="material-symbols-outlined text-base">edit</span>
                </app-button>
                <app-button size="sm" shadow="none" variant="ghost" (clicked)="confirmRemoveContact(row)" [attr.aria-label]="('common.actions.delete' | t)">
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
  addressColumns = computed<{key: string, header: string}[]>(() => {
    this.i18n.lang();
    return [
      { key: 'type', header: this.i18n.t('actors.addresses.fields.type') },
      { key: 'street', header: this.i18n.t('actors.addresses.fields.street') },
      { key: 'city', header: this.i18n.t('actors.addresses.fields.city') },
      { key: 'country', header: this.i18n.t('actors.addresses.fields.country') }
    ];
  });
  contactColumns = computed<{key: string, header: string}[]>(() => {
    this.i18n.lang();
    return [
      { key: 'type', header: this.i18n.t('actors.contacts.fields.type') },
      { key: 'name', header: this.i18n.t('actors.contacts.fields.name') },
      { key: 'email', header: this.i18n.t('actors.contacts.fields.email') },
      { key: 'phone', header: this.i18n.t('actors.contacts.fields.phone') },
      { key: 'role', header: this.i18n.t('actors.contacts.fields.function') }

    ];
  });
  addresses = input.required<Address[]>();
  contacts = input.required<Contact[]>();
  readonly = input<boolean>(false);

  addAddress = output<void>();
  editAddress = output<Address>();
  removeAddress = output<string>();

  addContact = output<void>();
  editContact = output<Contact>();
  removeContact = output<string>();

  tabItems = computed<TabItem[]>(() => {
    this.i18n.lang();
    return [
      { id: 'addresses', label: this.i18n.t('actors.tabs.addresses') },
      { id: 'contacts', label: this.i18n.t('actors.tabs.contacts') }
    ];
  });

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
