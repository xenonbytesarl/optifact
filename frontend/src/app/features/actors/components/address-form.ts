import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import { InputTextComponent } from '../../../shared/ui/input';
import { SelectComponent, SelectOption } from '../../../shared/ui/select';
import { CountryAutocompleteComponent } from '../../../shared/ui/country-autocomplete';
import { Address, AddressType } from '../models';

export interface AddressFormModel { type: AddressType; street: string; city: string; country: string }

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, FormFieldComponent, InputTextComponent, SelectComponent, CountryAutocompleteComponent],
  template: `
    <form class="grid gap-4 md:grid-cols-2">
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="'Type'" [required]="true">
          <app-select [options]="typeOptions" [value]="model().type" (valueChange)="onType($event)" />
        </app-form-field>
      </div>
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="'Rue'" [required]="true">
          <app-input [value]="model().street" (valueChange)="update('street', $event || '')" />
        </app-form-field>
      </div>
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="'Pays'" [required]="true">
          <app-country-autocomplete [value]="model().country || null" (valueChange)="update('country', $event || '')" />
        </app-form-field>
      </div>
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="'Ville'" [required]="true">
          <app-input [value]="model().city" (valueChange)="update('city', $event || '')" />
        </app-form-field>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class AddressFormComponent {
  model = model.required<AddressFormModel>();

  onType(value: string | null) {
    const v = (value || 'autres') as AddressType;
    this.update('type', v);
  }

  typeOptions: SelectOption[] = [
    { value: 'facturation', label: 'Facturation' },
    { value: 'livraison', label: 'Livraison' },
    { value: 'défaut', label: 'Défaut' },
    { value: 'autres', label: 'Autres' },
  ];

  update<K extends keyof AddressFormModel>(key: K, value: AddressFormModel[K]) {
    const next = { ...this.model(), [key]: value } as AddressFormModel;
    this.model.set(next);
  }
}
