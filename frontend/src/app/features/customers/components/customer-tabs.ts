import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Address, Contact } from '../models';
import { ButtonComponent } from '../../../shared/ui/button';
import { TabsComponent, TabItem } from '../../../shared/ui/tabs';
import { TableComponent } from '../../../shared/ui/table';

@Component({
  selector: 'app-customer-tabs',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TabsComponent, TableComponent],
  template: `
  <div>
    <app-tabs [items]="tabItems" [(active)]="tab">
      @if (tab==='addresses') {
        <div>
          <div class="mb-2"><app-button (clicked)="addAddress.emit()"><span class="material-symbols-outlined text-base">add</span><span class="ml-1">Ajouter une adresse</span></app-button></div>
          <app-table>
            <thead>
              <tr>
                <th scope="col" class="text-left p-2">Type</th>
                <th scope="col" class="text-left p-2">Rue</th>
                <th scope="col" class="text-left p-2">Ville</th>
                <th scope="col" class="text-left p-2">Pays</th>
                <th scope="col" class="text-right p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              @if (addresses().length === 0) {
                <tr>
                  <td colspan="5" class="p-2 text-sm text-muted">Aucune adresse</td>
                </tr>
              } @else {
                @for (a of addresses(); track a.id) {
                  <tr>
                    <td class="p-2">{{ a.type }}</td>
                    <td class="p-2">{{ a.street }}</td>
                    <td class="p-2">{{ a.city }}</td>
                    <td class="p-2">{{ a.country }}</td>
                    <td class="p-2 text-right">
                      <app-button size="sm" variant="ghost" shadow="none" hoverShadow="none" (clicked)="editAddress.emit(a)" aria-label="Modifier">
                        <span class="material-symbols-outlined text-base">edit</span>
                      </app-button>
                      <app-button size="sm" variant="ghost"  shadow="none" hoverShadow="none" (clicked)="removeAddress.emit(a.id)" aria-label="Supprimer">
                        <span class="material-symbols-outlined text-base text-red-600">delete</span>
                      </app-button>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </app-table>
        </div>
      }

      @if (tab==='contacts') {
        <div>
          <div class="mb-2"><app-button (clicked)="addContact.emit()"><span class="material-symbols-outlined text-base">person_add</span><span class="ml-1">Ajouter un contact</span></app-button></div>
          <app-table>
            <thead>
            <tr>
              <th class="text-left p-2">Type</th>
              <th class="text-left p-2">Nom</th>
              <th class="text-left p-2">Email</th>
              <th class="text-left p-2">Téléphone</th>
              <th class="text-left p-2">Fonction</th>
              <th class="text-right p-2">Actions</th>
            </tr>
            </thead>
            <tbody>
              @if (contacts().length === 0) {
                <tr>
                  <td colspan="6" class="p-2 text-sm text-muted">Aucun contact</td>
                </tr>
              } @else {
                @for (c of contacts(); track c.id) {
                  <tr>
                    <td class="p-2">{{ c.type }}</td>
                    <td class="p-2">{{ c.name }}</td>
                    <td class="p-2">{{ c.email }}</td>
                    <td class="p-2">{{ c.phone }}</td>
                    <td class="p-2">{{ c.role }}</td>
                    <td class="p-2 text-right">
                      <app-button size="sm" variant="ghost" (clicked)="editContact.emit(c)" aria-label="Modifier">
                        <span class="material-symbols-outlined text-base">edit</span>
                      </app-button>
                      <app-button size="sm" variant="ghost" (clicked)="removeContact.emit(c.id)" aria-label="Supprimer">
                        <span class="material-symbols-outlined text-base text-red-600">delete</span>
                      </app-button>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </app-table>
        </div>
      }
    </app-tabs>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CustomerTabsComponent {
  addresses = input.required<Address[]>();
  contacts = input.required<Contact[]>();

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
