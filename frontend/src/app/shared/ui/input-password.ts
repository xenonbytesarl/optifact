import { ChangeDetectionStrategy, Component, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-password',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <input [attr.type]="visible() ? 'text' : 'password'"
             [attr.placeholder]="placeholder() || null"
             [disabled]="disabled()"
             [value]="value() ?? ''"
             (input)="onInput($event)"
             (blur)="onBlur()"
             [class]="inputClass()" />
      <button type="button"
              class="absolute inset-y-0 right-0 px-3 text-neutral-500 hover:text-neutral-700 disabled:opacity-60"
              [disabled]="disabled()"
              (click)="toggle()"
              aria-label="Toggle password visibility">
        <span class="material-symbols-outlined align-middle">{{ visible() ? 'visibility_off' : 'visibility' }}</span>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputPasswordComponent {
  placeholder = input<string>('••••••••');
  disabled = input<boolean>(false);
  error = input<boolean>(false);
  maskChar = input<string>('•');
  value = model<string | null>(null);
  blurred = output<void>();

  // internal visibility state
  visible = signal(false);

  inputClass() {
    const base = 'w-full h-11 border bg-surface text-fg placeholder-muted px-3 pr-10 text-base outline-none shadow-sm';
    const normal = 'border-token focus:ring-1 ring-primary';
    const danger = 'border-red-500 focus:ring-1 ring-red-500';
    const disabled = this.disabled() ? ' opacity-60 cursor-not-allowed' : '';
    return [base, this.error() ? danger : normal].join(' ') + disabled;
  }

  toggle() {
    this.visible.update(v => !v);
  }

  onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value.set(target.value);
  }

  onBlur() {
    this.blurred.emit();
  }
}
