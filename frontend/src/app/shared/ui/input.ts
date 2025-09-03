import { ChangeDetectionStrategy, Component, effect, input, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <input [attr.type]="type()"
           [attr.placeholder]="placeholder() || null"
           [disabled]="disabled()"
           [value]="value() ?? ''"
           (input)="onInput($event)"
           class="w-full rounded-lg border border-token bg-surface text-fg placeholder-muted px-3 py-2 text-sm outline-none focus:ring-2 ring-primary shadow-sm" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent {
  type = input<'text' | 'email' | 'tel' | 'number' | 'search' | 'password'>('text');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  value = model<string | null>(null);

  onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value.set(target.value);
  }
}
