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
          <div class="mb-2"><app-button (clicked)="addAddress.emit()">Ajouter une adresse</app-button></div>
          @if (addresses().length === 0) {
            <p class="text-sm text-muted">Aucune adresse — ajoutez-en une.</p>
          } @else {
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
                @for (a of addresses(); track a.id) {
                  <tr>
                    <td class="p-2">{{ a.type }}</td>
                    <td class="p-2">{{ a.street }}</td>
                    <td class="p-2">{{ a.city }}</td>
                    <td class="p-2">{{ a.country }}</td>
                    <td class="p-2 text-right">
                      <app-button size="sm" variant="secondary" (clicked)="editAddress.emit(a)">Modifier</app-button>
                      <app-button size="sm" variant="danger" (clicked)="removeAddress.emit(a.id)">Supprimer</app-button>
                    </td>
                  </tr>
                }
              </tbody>
            </app-table>
          }
        </div>
      }

      @if (tab==='contacts') {
        <div>
          <div class="mb-2"><app-button (clicked)="addContact.emit()">Ajouter un contact</app-button></div>
          @if (contacts().length === 0) {
            <p class="text-sm text-muted">Aucun contact — ajoutez-en un.</p>
          } @else {
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
                @for (c of contacts(); track c.id) {
                  <tr>
                    <td class="p-2">{{ c.type }}</td>
                    <td class="p-2">{{ c.name }}</td>
                    <td class="p-2">{{ c.email }}</td>
                    <td class="p-2">{{ c.phone }}</td>
                    <td class="p-2">{{ c.role }}</td>
                    <td class="p-2 text-right">
                      <app-button size="sm" variant="secondary" (clicked)="editContact.emit(c)">Modifier</app-button>
                      <app-button size="sm" variant="danger" (clicked)="removeContact.emit(c.id)">Supprimer</app-button>
                    </td>
                  </tr>
                }
              </tbody>
            </app-table>
          }
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
      { id: 'addresses', label: 'Adresses', badge: this.addresses()?.length ?? 0 },
      { id: 'contacts', label: 'Contacts', badge: this.contacts()?.length ?? 0 }
    ];
  }

  tab: 'addresses' | 'contacts' = 'addresses';
}
