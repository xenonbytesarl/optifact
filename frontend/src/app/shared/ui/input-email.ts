import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-email',
  standalone: true,
  imports: [CommonModule],
  template: `
    <input type="email"
           [attr.placeholder]="placeholder() || null"
           [disabled]="disabled()"
           [value]="value() ?? ''"
           (input)="onInput($event)"
           [class]="inputClass()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputEmailComponent {
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  error = input<boolean>(false);
  value = model<string | null>(null);

  inputClass() {
    const base = 'w-full h-11 border bg-surface text-fg placeholder-muted px-3 text-base outline-none shadow-sm';
    const normal = 'border-token focus:ring-1 ring-primary';
    const danger = 'border-red-500 focus:ring-1 ring-red-500';
    const disabled = this.disabled() ? ' opacity-60 cursor-not-allowed' : '';
    return [base, this.error() ? danger : normal].join(' ') + disabled;
  }

  onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value.set(target.value || '');
  }
}
