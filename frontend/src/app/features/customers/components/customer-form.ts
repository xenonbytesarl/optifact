import { ChangeDetectionStrategy, Component, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CustomerBaseModel { name: string; reference?: string; category?: string }

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <form class="grid gap-4 md:grid-cols-2">
    <div class="col-span-2 md:col-span-1">
      <label class="block text-sm font-medium">Nom</label>
      <input class="mt-1 w-full rounded border px-3 py-2" [ngModel]="model().name" (ngModelChange)="onName($event)" [ngModelOptions]="{standalone: true}" required minlength="2" />
      @if (nameError()) {
        <p class="text-sm text-red-600 mt-1">{{ nameError() }}</p>
      }
    </div>
    <div class="col-span-2 md:col-span-1">
      <label class="block text-sm font-medium">Référence</label>
      <input class="mt-1 w-full rounded border px-3 py-2" [ngModel]="model().reference" (ngModelChange)="update('reference', $event)" [ngModelOptions]="{standalone: true}" maxlength="20" />
    </div>
    <div class="col-span-2 md:col-span-1">
      <label class="block text-sm font-medium">Catégorie</label>
      <select class="mt-1 w-full rounded border px-3 py-2" [ngModel]="model().category" (ngModelChange)="update('category', $event)" [ngModelOptions]="{standalone: true}">
        <option value="">-- Sélectionner --</option>
        <option value="Particulier">Particulier</option>
        <option value="Entreprise">Entreprise</option>
        <option value="Administration">Administration</option>
      </select>
    </div>
  </form>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CustomerFormComponent {
  model = model.required<CustomerBaseModel>();
  nameError = signal<string | null>(null);

  onName(value: string) {
    this.update('name', value);
    const v = (value ?? '').trim();
    this.nameError.set(v.length >= 2 ? null : 'Le nom est obligatoire (min. 2 caractères)');
  }

  update<K extends keyof CustomerBaseModel>(key: K, value: CustomerBaseModel[K]) {
    const next = { ...this.model(), [key]: value };
    this.model.set(next);
  }
}
