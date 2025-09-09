import {ChangeDetectionStrategy, Component, computed, inject, input, model, output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import { InputTextComponent } from '../../../shared/ui/input';
import { SelectComponent, SelectOption } from '../../../shared/ui/select';
import { InputPhoneComponent } from '../../../shared/ui/input-phone';
import { InputEmailComponent } from '../../../shared/ui/input-email';
import { InputHiddenComponent } from '../../../shared/ui/input-hidden';
import {AddressType, ContactType} from '../../../core/api/actor/models';
import {TranslateService} from '../../../core/i18n/translate.service';
import {ContactFormValue} from './actor.form.value';
import {CategoryFormValue} from '../../product-categories/components/product-category-form';
import {TranslatePipe} from '../../../core/i18n/translate.pipe';

export interface ContactFormModel { type: ContactType; name: string; email: string; phone: string; role?: string }

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormFieldComponent, InputTextComponent, SelectComponent, InputPhoneComponent, InputEmailComponent, InputHiddenComponent, TranslatePipe],
  template: `
    <form class="grid gap-4 md:grid-cols-2">
      <app-input-hidden [value]="value().id" />
      <app-input-hidden [value]="value().actorId" />
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="('actors.contacts.fields.type' | t)" [required]="true" [error]="typeRequiredError() ? ('validation.required' | t) : null">
          <app-select [disabled]="disabled()" [options]="typeOptions()" [value]="value().type" (valueChange)="onType($event)" [error]="typeRequiredError()" (blurred)="blurType.emit()" />
        </app-form-field>
      </div>
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="('actors.contacts.fields.name' | t)" [required]="true" [error]="nameRequiredError() ? ('validation.required' | t) : null">
          <app-input [disabled]="disabled()"  [value]="value().name" (valueChange)="onName($event)" [error]="nameRequiredError()" (blurred)="blurName.emit()" />
        </app-form-field>
      </div>
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="('actors.contacts.fields.email' | t)" [required]="true">
          <app-input-email [disabled]="disabled()" [value]="value().email" (valueChange)="onEmail($event)" [error]="false" (blurred)="blurEmail.emit()" />
        </app-form-field>
      </div>
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="('actors.contacts.fields.phone' | t)" [required]="true">
          <app-input-phone [disabled]="disabled()" [value]="value().phone" (valueChange)="onPhone($event)" [error]="false" (blurred)="blurPhone.emit()" />
        </app-form-field>
      </div>
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="('actors.contacts.fields.function' | t)" [required]="true" >
          <app-input [disabled]="disabled()"  [value]="value().function" (valueChange)="onFunction($event)" (blurred)="blurFunction.emit()" />
        </app-form-field>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ContactFormComponent {
  protected i18n = inject(TranslateService);

  disabled = input<boolean>(false);

  typeRequiredError = input<boolean>(false);
  nameRequiredError = input<boolean>(false);

  value = model<ContactFormValue>({
    id: null,
    type: 'DEFAULT',
    name: '',
    email: '',
    phone: '',
    function: '',
    actorId: ''
  });

  submit = output<CategoryFormValue>();
  cancel = output<void>();
  blurType = output<void>();
  blurName = output<void>();
  blurEmail = output<void>();
  blurPhone = output<void>();
  blurFunction = output<void>();

  typeOptions = computed<SelectOption[]>(() =>  {
    this.i18n.lang();
    return [
      { value: 'DEFAULT', label: 'actors.contacts.types.commercial' },
      { value: 'PROJECT', label: 'actors.contacts.types.project' },
      { value: 'ACCOUNTING', label: 'actors.contacts.types.accounting' },
      { value: 'COMMERCIAL', label: 'actors.contacts.types.commercial' },
      { value: 'TECHNICAL', label: 'actors.contacts.types.technical' },
      { value: 'OTHER', label: 'actors.contacts.types.other' },
    ];
  });

  onType(v: string | null) {
    const type = (v ?? 'DEFAULT') as ContactType;
    this.value.set({ ...this.value(), type });
  }

  onName(v: string | null) {
    const name = (v ?? '').toString();
    this.value.set({ ...this.value(), name });
  }

  onEmail(v: string | null) {
    const email = (v ?? '').toString();
    this.value.set({ ...this.value(), email });
  }

  onPhone(v: string | null) {
    const phone = (v ?? '').toString();
    this.value.set({ ...this.value(), phone });
  }

  onFunction(v: string | null) {
    const func = (v ?? '').toString();
    this.value.set({ ...this.value(), function: func });
  }
}
