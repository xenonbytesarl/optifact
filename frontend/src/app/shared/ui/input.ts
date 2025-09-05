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
           class="w-full h-11  border border-token bg-surface text-fg placeholder-muted px-3 text-base outline-none focus:ring-1 ring-primary shadow-sm" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputTextComponent {
  type = input<'text' | 'email' | 'tel' | 'number' | 'search' | 'password'>('text');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  value = model<string | null>(null);

  onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value.set(target.value);
  }
}
