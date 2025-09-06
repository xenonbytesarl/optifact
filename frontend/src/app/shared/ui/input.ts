import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
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
           (blur)="onBlur()"
           [class]="inputClass()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputTextComponent {
  type = input<'text' | 'email' | 'tel' | 'number' | 'search' | 'password'>('text');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  value = model<string | null>(null);
  blurred = output<void>();

  onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value.set(target.value);
  }

  onBlur() {
    this.blurred.emit();
  }
}
