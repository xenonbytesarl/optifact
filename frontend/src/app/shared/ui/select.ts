import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SelectOption { value: string; label: string }

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <select [disabled]="disabled()"
            class="w-full h-11  border border-token bg-surface text-fg px-3 text-base outline-none focus:ring-1 ring-primary shadow-sm"
            [value]="value() ?? ''"
            (change)="onChange($event)">
      @if (placeholder()) { <option value="">{{ placeholder() }}</option> }
      @for (o of options(); track o.value) { <option [value]="o.value">{{ o.label }}</option> }
    </select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent {
  options = input.required<SelectOption[]>();
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  value = model<string | null>(null);

  onChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.value.set(target.value || null);
  }
}
