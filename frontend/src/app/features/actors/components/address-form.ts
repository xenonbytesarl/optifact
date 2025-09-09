import {ChangeDetectionStrategy, Component, computed, inject, input, model, output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import { InputTextComponent } from '../../../shared/ui/input';
import { SelectComponent, SelectOption } from '../../../shared/ui/select';
import { CountryAutocompleteComponent } from '../../../shared/ui/country-autocomplete';
import { InputHiddenComponent } from '../../../shared/ui/input-hidden';
import { AddressType } from '../../../core/api/actor/models';
import {TranslateService} from '../../../core/i18n/translate.service';
import {AddressFormValue} from './actor.form.value';
import {CategoryFormValue} from '../../product-categories/components/product-category-form';
import {TranslatePipe} from '../../../core/i18n/translate.pipe';
@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, FormFieldComponent, InputTextComponent, SelectComponent, CountryAutocompleteComponent, InputHiddenComponent, TranslatePipe],
  template: `
    <form class="grid gap-4 md:grid-cols-2">
      <app-input-hidden [value]="value().id" />
      <app-input-hidden [value]="value().actorId" />
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="('actors.addresses.fields.type' | t)" [required]="true" [error]="typeRequiredError() ? ('validation.required' | t) : null">
          <app-select [disabled]="disabled()" [options]="typeOptions()" [value]="value().type" (valueChange)="onType($event)" [error]="typeRequiredError()" (blurred)="blurType.emit()" />
        </app-form-field>
      </div>
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="('actors.addresses.fields.street' | t)">
          <app-input [disabled]="disabled()"  [value]="value().street" (valueChange)="onStreet($event)" (blurred)="blurStreet.emit()" />
        </app-form-field>
      </div>
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="('actors.addresses.fields.city' | t)" [required]="true" [error]="cityRequiredError() ? ('validation.required' | t) : null">
          <app-input [disabled]="disabled()"  [value]="value().city" (valueChange)="onCity($event)" [error]="cityRequiredError()" (blurred)="blurCity.emit()" />
        </app-form-field>
      </div>
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="('actors.addresses.fields.zipCode' | t)">
          <app-input [disabled]="disabled()"  [value]="value().zipCode" (valueChange)="onZipCode($event)" (blurred)="blurZipCode.emit()" />
        </app-form-field>
      </div>
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="('actors.addresses.fields.country' | t)" [required]="true" [error]="countryRequiredError() ? ('validation.required' | t) : null">
          <app-country-autocomplete [disabled]="disabled()"  [value]="value().country" (valueChange)="onCountry($event)" [error]="countryRequiredError()" (blurred)="blurCountry.emit()" />
        </app-form-field>
      </div>
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="('actors.addresses.fields.state' | t)">
          <app-input [disabled]="disabled()"  [value]="value().state" (valueChange)="onState($event)" (blurred)="blurState.emit()" />
        </app-form-field>
      </div>

    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class AddressFormComponent {
  protected i18n = inject(TranslateService);

  disabled = input<boolean>(false);

  typeRequiredError = input<boolean>(false);
  cityRequiredError = input<boolean>(false);
  countryRequiredError = input<boolean>(false);

  value = model<AddressFormValue>({
    id: null,
    type: 'DEFAULT',
    street: '',
    city: '',
    country: '',
    state: '',
    zipCode: '',
    actorId: ''
  });

  submit = output<CategoryFormValue>();
  cancel = output<void>();
  blurType = output<void>();
  blurStreet = output<void>();
  blurCity = output<void>();
  blurCountry = output<void>();
  blurState = output<void>();
  blurZipCode = output<void>();
  blurActor = output<void>();

  typeOptions = computed<SelectOption[]>(() =>  {
    this.i18n.lang();
    return [
      { value: 'DEFAULT', label: 'actors.addresses.types.default' },
      { value: 'INVOICE', label: 'actors.addresses.types.invoice' },
      { value: 'SHIPPING', label: 'actors.addresses.types.shipping' },
      { value: 'OTHER', label: 'actors.addresses.types.other' },
    ]
  });

  onType(v: string | null) {
    const type = (v ?? 'DEFAULT') as AddressType;
    this.value.set({ ...this.value(), type });
  }

  onStreet(v: string | null) {
    const street = (v ?? '').toString();
    this.value.set({ ...this.value(), street });
  }

  onCity(v: string | null) {
    const city = (v ?? '').toString();
    this.value.set({ ...this.value(), city });
  }

  onCountry(v: string | null) {
    const country = (v ?? '').toString();
    this.value.set({ ...this.value(), country });
  }

  onZipCode(v: string | null) {
    const zipCode = (v ?? '').toString();
    this.value.set({ ...this.value(), zipCode });
  }

  onState(v: string | null) {
    const state = (v ?? '').toString();
    this.value.set({ ...this.value(), state });
  }
}
