import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [CommonModule],
  template: `
    <input type="number"
           [attr.placeholder]="placeholder() || null"
           [disabled]="disabled()"
           [attr.min]="min() ?? null"
           [attr.max]="max() ?? null"
           [attr.step]="step() ?? (allowDecimal() ? 'any' : '1')"
           [value]="value() ?? ''"
           (input)="onInput($event)"
           [class]="inputClass()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputNumberComponent {
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  error = input<boolean>(false);
  min = input<number | null>(null);
  max = input<number | null>(null);
  step = input<number | null>(null);
  allowDecimal = input<boolean>(true);
  value = model<number | null>(null);

  inputClass() {
    const base = 'w-full h-11 border bg-surface text-fg placeholder-muted px-3 text-base outline-none shadow-sm';
    const normal = 'border-token focus:ring-1 ring-primary';
    const danger = 'border-red-500 focus:ring-1 ring-red-500';
    const disabled = this.disabled() ? ' opacity-60 cursor-not-allowed' : '';
    return [base, this.error() ? danger : normal].join(' ') + disabled;
  }

  onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const raw = target.value;
    if (raw === '') { this.value.set(null); return; }
    const parsed = this.allowDecimal() ? Number(raw) : parseInt(raw, 10);
    if (Number.isNaN(parsed)) {
      this.value.set(null);
      return;
    }
    const min = this.min();
    const max = this.max();
    let v = parsed;
    if (min != null && v < min) v = min;
    if (max != null && v > max) v = max;
    this.value.set(v);
  }
}
