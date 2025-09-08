import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SelectOption { value: string; label: string }

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <select [disabled]="disabled()"
            [class]="selectClass()"
            [value]="value() ?? ''"
            (change)="onChange($event)"
            (blur)="onBlur()">
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
  error = input<boolean>(false);
  value = model<string | null>(null);
  blurred = output<void>();

  selectClass() {
    const base = 'w-full h-11 border bg-surface text-fg px-3 text-base outline-none shadow-sm';
    const normal = 'border-token focus:ring-1 ring-primary';
    const danger = 'border-red-500 focus:ring-1 ring-red-500';
    const disabled = this.disabled() ? ' opacity-60 cursor-not-allowed' : '';
    return [base, this.error() ? danger : normal].join(' ') + disabled;
  }

  onChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.value.set(target.value || null);
  }

  onBlur() { this.blurred.emit(); }
}
