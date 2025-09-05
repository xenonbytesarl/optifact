import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Address, Contact } from '../models';
import { ButtonComponent } from '../../../shared/ui/button';
import { TabsComponent, TabItem } from '../../../shared/ui/tabs';
import { TableComponent } from '../../../shared/ui/table';

@Component({
  selector: 'app-actor-tabs',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TabsComponent, TableComponent],
  template: `
  <div>
    <app-tabs [items]="tabItems" [(active)]="tab">
      @if (tab==='addresses') {
        <div>
          @if (!readonly()) {
            <div class="mb-2"><app-button (clicked)="addAddress.emit()"><span class="material-symbols-outlined text-base">add</span><span class="ml-1">Ajouter une adresse</span></app-button></div>
          }
          <app-table [rows]="addresses()" [columns]="addressColumns">
            <ng-template #actions let-row>
              @if (!readonly()) {
                <app-button size="sm" variant="ghost" shadow="none" hoverShadow="none" (clicked)="editAddress.emit(row)" aria-label="Modifier">
                  <span class="material-symbols-outlined text-base">edit</span>
                </app-button>
                <app-button size="sm" variant="ghost" shadow="none" hoverShadow="none" (clicked)="removeAddress.emit(row.id)" aria-label="Supprimer">
                  <span class="material-symbols-outlined text-base text-red-600">delete</span>
                </app-button>
              }
            </ng-template>
          </app-table>
        </div>
      }

      @if (tab==='contacts') {
        <div>
          @if (!readonly()) {
            <div class="mb-2"><app-button (clicked)="addContact.emit()"><span class="material-symbols-outlined text-base">person_add</span><span class="ml-1">Ajouter un contact</span></app-button></div>
          }
          <app-table [rows]="contacts()" [columns]="contactColumns">
            <ng-template #actions let-row>
              @if (!readonly()) {
                <app-button size="sm" variant="ghost" (clicked)="editContact.emit(row)" aria-label="Modifier">
                  <span class="material-symbols-outlined text-base">edit</span>
                </app-button>
                <app-button size="sm" variant="ghost" (clicked)="removeContact.emit(row.id)" aria-label="Supprimer">
                  <span class="material-symbols-outlined text-base text-red-600">delete</span>
                </app-button>
              }
            </ng-template>
          </app-table>
        </div>
      }
    </app-tabs>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActorTabsComponent {
  addressColumns = [
    { key: 'type', header: 'Type' },
    { key: 'street', header: 'Rue' },
    { key: 'city', header: 'Ville' },
    { key: 'country', header: 'Pays' },
  ];
  contactColumns = [
    { key: 'type', header: 'Type' },
    { key: 'name', header: 'Nom' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Téléphone' },
    { key: 'role', header: 'Fonction' },
  ];
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
}
