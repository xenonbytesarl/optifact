import {ChangeDetectionStrategy, Component, effect, input, model, signal} from '@angular/core';
import {CommonModule} from '@angular/common';

function parseNumberLoose(v: string): number | null {
  // Accepts input with spaces, commas or dots as decimal separators; strips non-digits except separators
  const trimmed = v.trim();
  if (!trimmed) return null;
  // Normalize: replace comma with dot, remove spaces
  const normalized = trimmed.replace(/\s+/g, '').replace(/,/g, '.');
  const n = Number(normalized);
  return Number.isNaN(n) ? null : n;
}

@Component({
  selector: 'app-input-currency',
  standalone: true,
  imports: [CommonModule],
  template: `
    <input type="text"
           inputmode="decimal"
           [attr.pattern]="decimalPattern()"
           [attr.placeholder]="placeholder() || null"
           [disabled]="disabled()"
           [value]="displayValue()"
           (keydown)="onKeydown($event)"
           (paste)="onPaste($event)"
           (input)="onInput($event)"
           (blur)="onBlur()"
           (focus)="onFocus()"
           class="w-full h-11  border border-token bg-surface text-fg placeholder-muted px-3 text-base outline-none focus:ring-1 ring-primary shadow-sm" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputCurrencyComponent {
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  currency = input<string>('EUR');
  locale = input<string>('fr-FR');
  // By default, do not show decimals; can be enabled by consumer
  showDecimals = input<boolean>(false);
  min = input<number | null>(null);
  max = input<number | null>(null);
  value = model<number | null>(null);

  // Internal state for editing vs formatted display
  private editing = signal<boolean>(false);
  private rawText = signal<string>('');

  displayValue = signal<string>('');

  decimalPattern() {
    // Accept digits with optional decimal separator
    return '[0-9]+([.,][0-9]+)?';
  }

  private format(n: number | null): string {
    if (n == null) return '';
    const useDecimals = this.showDecimals();
    try {
      return new Intl.NumberFormat(this.locale(), {
        style: 'currency',
        currency: this.currency(),
        minimumFractionDigits: useDecimals ? 2 : 0,
        maximumFractionDigits: useDecimals ? 2 : 0,
      }).format(n);
    } catch {
      return useDecimals ? n.toFixed(2) : Math.trunc(n).toString();
    }
  }

  constructor() {
    // Keep displayValue in sync when not editing
    effect(() => {
      const val = this.value();
      const isEditing = this.editing();
      if (!isEditing) {
        this.displayValue.set(this.format(val));
      } else {
        this.displayValue.set(this.rawText());
      }
    });
  }

  onFocus() {
    this.editing.set(true);
    // Show raw numeric value (without currency) for editing
    const v = this.value();
    if (v == null) {
      this.rawText.set('');
    } else {
      this.rawText.set(this.showDecimals() ? v.toFixed(2) : Math.trunc(v).toString());
    }
    this.displayValue.set(this.rawText());
  }

  onBlur() {
    this.editing.set(false);
    // Reformat on blur
    const v = this.value();
    this.displayValue.set(this.format(v));
  }

  onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const raw = target.value || '';
    this.rawText.set(raw);
    const parsed = parseNumberLoose(raw);
    if (parsed == null) {
      this.value.set(null);
      return;
    }
    let v = parsed;
    const min = this.min();
    const max = this.max();
    if (min != null && v < min) v = min;
    if (max != null && v > max) v = max;
    this.value.set(v);
  }

  onKeydown(e: KeyboardEvent) {
    const allowedControl = ["Backspace","Delete","Tab","Enter","Escape","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key);
    const isMetaCombo = e.ctrlKey || e.metaKey; // allow copy/paste/select all
    if (allowedControl || isMetaCombo) return;
    const isDigit = /^[0-9]$/.test(e.key);
    const isSeparator = e.key === '.' || e.key === ',';
    const isMinus = e.key === '-';
    // For currency, usually no negative; keep minus blocked unless explicitly needed later
    if (isDigit || isSeparator) return;
    // Block alphabetic and other symbols
    if (/^[a-zA-Z]$/.test(e.key) || /[^0-9.,-]/.test(e.key)) {
      e.preventDefault();
    }
  }

  onPaste(e: ClipboardEvent) {
    const data = e.clipboardData?.getData('text') ?? '';
    const cleaned = data.replace(/[^0-9.,\s-]/g, '');
    if (cleaned !== data) {
      e.preventDefault();
      // insert cleaned manually
      const target = e.target as HTMLInputElement;
      const start = target.selectionStart ?? target.value.length;
      const end = target.selectionEnd ?? start;
      target.value = target.value.slice(0, start) + cleaned + target.value.slice(end);
      // trigger input processing
      const evt = new Event('input', { bubbles: true });
      target.dispatchEvent(evt);
    }
  }
}
