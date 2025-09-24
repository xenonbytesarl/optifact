import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type OtpMode = 'number' | 'alpha' | 'alphanumeric';

@Component({
  selector: 'app-input-otp',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full'
  },
  template: `
    <div class="flex gap-2 justify-center">
      <input
        [attr.inputmode]="inputMode()"
        class="w-full text-center tracking-[0.5em] px-3 py-2 rounded-md border bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-1 ring-primary"
        [attr.maxLength]="digits()"
        [value]="value()"
        (input)="onInput($event)"
        (paste)="onPaste($event)"
        (keydown)="onKeyDown($event)"
        (blur)="onBlur()"
        [placeholder]="placeholder()"
      />
    </div>
  `
})
export class InputOtpComponent {
  digits = input<number>(6);
  mode = input<OtpMode>('number');
  placeholder = input<string>('••••••');
  value = input<string>('');
  valueChange = output<string>();
  // Emit when the input loses focus to allow forms to mark controls as touched
  blurred = output<void>();

  inputMode() {
    switch (this.mode()) {
      case 'number': return 'numeric';
      case 'alpha': return 'text';
      default: return 'text';
    }
  }

  private filterValue(raw: string): string {
    let v = raw || '';
    const m = this.mode();
    if (m === 'number') v = v.replace(/[^0-9]/g, '');
    else if (m === 'alpha') v = v.replace(/[^a-zA-Z]/g, '');
    else v = v.replace(/[^a-zA-Z0-9]/g, '');
    if (v.length > this.digits()) v = v.slice(0, this.digits());
    return v;
  }

  onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const filtered = this.filterValue(target.value);
    if (filtered !== target.value) {
      target.value = filtered;
    }
    this.valueChange.emit(filtered);
  }

  onPaste(e: ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData?.getData('text') || '';
    const filtered = this.filterValue(text);
    this.valueChange.emit(filtered);
  }

  onKeyDown(e: KeyboardEvent) {
    // Prevent invalid characters early
    const m = this.mode();
    if (e.key.length === 1) {
      if (m === 'number' && /[^0-9]/.test(e.key)) e.preventDefault();
      else if (m === 'alpha' && /[^a-zA-Z]/.test(e.key)) e.preventDefault();
      else if (m === 'alphanumeric' && /[^a-zA-Z0-9]/.test(e.key)) e.preventDefault();
    }
  }

  onBlur() {
    this.blurred.emit();
  }
}
