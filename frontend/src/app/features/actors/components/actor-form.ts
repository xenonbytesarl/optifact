import { ChangeDetectionStrategy, Component, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormFieldComponent } from '../../../shared/ui/form-field';
import { InputTextComponent } from '../../../shared/ui/input';

export interface ActorBaseModel { name: string; reference?: string; category?: string }

@Component({
  selector: 'app-actor-form',
  standalone: true,
  imports: [CommonModule, FormsModule, FormFieldComponent, InputTextComponent],
  template: `
  <form class="grid gap-4 md:grid-cols-2">
    <div class="col-span-2 md:col-span-1">
      <app-form-field [label]="'Nom'" [required]="true" [error]="nameError()">
        <app-input [value]="model().name" (valueChange)="onName($event)" />
      </app-form-field>
    </div>
    <div class="col-span-2 md:col-span-1">
      <app-form-field [label]="'Référence'" [hint]="'Max 20 caractères'">
        <app-input [value]="model().reference ?? ''" (valueChange)="update('reference', $event || '')" />
      </app-form-field>
    </div>
  </form>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ActorFormComponent {
  categories = [
    { value: 'Particulier', label: 'Particulier' },
    { value: 'Entreprise', label: 'Entreprise' },
    { value: 'Administration', label: 'Administration' }
  ];
  model = model.required<ActorBaseModel>();
  nameError = signal<string | null>(null);

  onName(value: string | null) {
    const vStr = (value ?? '').toString();
    this.update('name', vStr);
    const v = vStr.trim();
    this.nameError.set(v.length >= 2 ? null : 'Le nom est obligatoire (min. 2 caractères)');
  }

  update<K extends keyof ActorBaseModel>(key: K, value: ActorBaseModel[K]) {
    const next = { ...this.model(), [key]: value };
    this.model.set(next);
  }
}
