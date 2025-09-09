import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-hidden',
  standalone: true,
  imports: [CommonModule],
  template: `
    <input type="hidden"
           [disabled]="disabled()"
           [value]="value() ?? ''"
           (input)="onInput($event)"
           (blur)="onBlur()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputHiddenComponent {
  disabled = input<boolean>(false);
  // keep API aligned with other inputs even if not used for hidden
  error = input<boolean>(false);
  value = model<string | null>(null);
  blurred = output<void>();

  onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value.set(target.value ?? '');
  }

  onBlur() {
    this.blurred.emit();
  }
}
