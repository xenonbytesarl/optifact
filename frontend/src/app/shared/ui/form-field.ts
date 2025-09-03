import { ChangeDetectionStrategy, Component, Input, input, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="block text-sm font-medium text-fg">
      {{ label() }}
      <span *ngIf="required()" class="text-red-600">*</span>
    </label>
    <div class="mt-1">
      <ng-content />
    </div>
    <p *ngIf="hint() && !error()" class="mt-1 text-xs text-muted">{{ hint() }}</p>
    <p *ngIf="error()" class="mt-1 text-xs text-red-600">{{ error() }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' }
})
export class FormFieldComponent {
  label = input.required<string>();
  hint = input<string>('');
  error = input<string | null>(null);
  required = input<boolean>(false);
}
