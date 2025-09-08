import { ChangeDetectionStrategy, Component, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import { InputTextComponent } from '../../../shared/ui/input';
import { SelectComponent, SelectOption } from '../../../shared/ui/select';
import { InputPhoneComponent } from '../../../shared/ui/input-phone';
import { InputEmailComponent } from '../../../shared/ui/input-email';
import { ContactType } from '../../../core/api/actor/models';

export interface ContactFormModel { type: ContactType; name: string; email: string; phone: string; role?: string }

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormFieldComponent, InputTextComponent, SelectComponent, InputPhoneComponent, InputEmailComponent],
  template: `
    <form class="grid gap-4 md:grid-cols-2">
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="'Type'" [required]="true">
          <app-select [options]="typeOptions" [value]="model().type" (valueChange)="onType($event)" />
        </app-form-field>
      </div>
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="'Nom'" [required]="true">
          <app-input [value]="model().name" (valueChange)="update('name', $event || '')" />
        </app-form-field>
      </div>
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="'Email'">
          <app-input-email [value]="model().email || ''" (valueChange)="update('email', $event || '')" />
        </app-form-field>
      </div>
      <div class="col-span-2 md:col-span-1">
        <app-form-field [label]="'Téléphone'">
          <app-input-phone [value]="model().phone || null" (valueChange)="update('phone', $event || '')"></app-input-phone>
        </app-form-field>
      </div>
      <div class="col-span-2">
        <app-form-field [label]="'Fonction'">
          <app-input [value]="model().role || ''" (valueChange)="update('role', $event || '')" />
        </app-form-field>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ContactFormComponent {
  model = model.required<ContactFormModel>();

  typeOptions: SelectOption[] = [
    { value: 'commercial', label: 'Commercial' },
    { value: 'technique', label: 'Technique' },
    { value: 'comptabilité', label: 'Comptabilité' },
    { value: 'autres', label: 'Autres' },
  ];

  onType(value: string | null) {
    const v = (value || 'commercial') as ContactType;
    this.update('type', v);
  }

  update<K extends keyof ContactFormModel>(key: K, value: ContactFormModel[K]) {
    const next = { ...this.model(), [key]: value } as ContactFormModel;
    this.model.set(next);
  }
}
