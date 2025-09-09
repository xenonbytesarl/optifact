import {ChangeDetectionStrategy, Component, inject, input, model, output, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import { InputTextComponent } from '../../../shared/ui/input';
import {TranslateService} from '../../../core/i18n/translate.service';
import {CategoryFormValue} from '../../product-categories/components/product-category-form';
import {TranslatePipe} from '../../../core/i18n/translate.pipe';
import {ActorFormValue} from './actor.form.value';

@Component({
  selector: 'app-actor-form',
  standalone: true,
  imports: [CommonModule, FormsModule, FormFieldComponent, InputTextComponent, TranslatePipe],
  template: `
  <form class="grid gap-4 md:grid-cols-2">
    <div class="col-span-2 md:col-span-1">
      <app-form-field [label]="('actors.fields.name' | t)" [required]="true" [error]="nameRequiredError() ? ('validation.required' | t) : null">
        <app-input [disabled]="disabled()" [value]="value().name" (valueChange)="onName($event)" [error]="nameRequiredError()" (blurred)="blurName.emit()" />
      </app-form-field>
    </div>
    <div class="col-span-2 md:col-span-1">
      <app-form-field [label]="('actors.fields.reference' | t)">
        <app-input [disabled]="disabled()" [value]="value().reference" (valueChange)="onReference($event)" (blurred)="blurReference.emit()" />
      </app-form-field>
    </div>
  </form>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActorFormComponent {

  protected i18n = inject(TranslateService);

  disabled = input<boolean>(false);

  nameRequiredError = input<boolean>(false);

  value = model<ActorFormValue>({
    name: '',
    reference: '',
    addresses: [],
    contacts: []
  });

  submit = output<CategoryFormValue>();
  cancel = output<void>();
  blurName = output<void>();
  blurReference = output<void>();

  onName(v: string | null) {
    const name = (v ?? '').toString();
    this.value.set({ ...this.value(), name });
  }

  onReference(v: string | null) {
    const reference = (v ?? '').toString();
    this.value.set({ ...this.value(), reference });
  }
}
