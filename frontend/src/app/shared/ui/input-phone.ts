import { ChangeDetectionStrategy, Component, computed, effect, input, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryAutocompleteComponent } from './country-autocomplete';
import { COUNTRIES } from './countries.data';

@Component({
  selector: 'app-input-phone',
  standalone: true,
  imports: [CommonModule, CountryAutocompleteComponent],
  template: `
    <div class="flex items-stretch">
      @if (showFlag()) {
        <div class="basis-1/5 shrink-0  -mr-px">
          <app-country-autocomplete
            [value]="country()"
            (valueChange)="onCountry($event)"
            [placeholder]="countryPlaceholder()"
            [rightSquare]="true"
            [clearable]="false"
            [flagOnly]="true"
          />
        </div>
      }
      <div class="basis-4/5 flex flex-col">
        <div class="flex items-center">
          @if (inlineFlag() && !showFlag()) {
            <span class="text-xl" [attr.aria-label]="country() || ''">{{ currentFlag() }}</span>
          }
          <input
            type="tel"
            [attr.placeholder]="computedPlaceholder() || null"
            [disabled]="disabled()"
            [attr.aria-invalid]="incomplete() ? 'true' : null"
            [attr.aria-describedby]="incomplete() ? 'phone-error' : null"
            [value]="display()"
            (input)="onInput($event)"
            (keydown)="onKeydown($event)"
            (paste)="onPaste($event)"
            (blur)="onBlur()"
            [class]="inputClass()"
          />
        </div>
        @if (incomplete()) {
          <div id="phone-error" class="text-sm text-[var(--color-danger)]">{{ errorMessage() }}</div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputPhoneComponent {
  placeholder = input<string>('');
  countryPlaceholder = input<string>('Pays');
  disabled = input<boolean>(false);
  error = input<boolean>(false);
  autoFormat = input<boolean>(true);
  showFlag = input<boolean>(true);
  inlineFlag = input<boolean>(true);
  autoApplyDialOnBlur = input<boolean>(true);

  value = model<string | null>(null); // phone number string, can include +prefix
  country = model<string | null>(null); // ISO alpha-2 country code

  display = signal<string>('');
  // validation and helper signals
  private maxDigits = computed(() => {
    const mask = this.getPhoneFormat(this.country());
    return mask ? (mask.match(/#/g) || []).length : 0;
  });
  // number of literal dial digits present in the mask before first placeholder
  private literalDialDigits = computed(() => {
    const mask = this.getPhoneFormat(this.country());
    if (!mask) return 0;
    const firstPlaceholder = mask.indexOf('#');
    if (firstPlaceholder <= 0) return 0;
    const literalPrefix = mask.slice(0, firstPlaceholder);
    const literalDigits = this.digitsOf(literalPrefix);
    return literalDigits.length;
  });

  // digits to compare against mask capacity: exclude literal dial digits when they are part of the display/value
  private comparableDigits = computed(() => {
    const digits = this.digitsOf(this.value() || '');
    const lit = this.literalDialDigits();
    if (lit > 0 && digits.length >= lit) {
      return digits.slice(lit);
    }
    return digits;
  });

  incomplete = computed(() => {
    const max = this.maxDigits();
    if (!max) return false; // no strict mask => no incompleteness
    const len = this.comparableDigits().length;
    return len > 0 && len < max;
  });

  inputClass() {
    const base = 'w-full h-11 border border-l-0 bg-surface text-fg placeholder-muted px-3 text-base outline-none shadow-sm';
    const normal = 'border-token focus:ring-1 ring-primary';
    const danger = 'border-red-500 focus:ring-1 ring-red-500';
    const disabled = this.disabled() ? ' opacity-60 cursor-not-allowed' : '';
    const isError = this.error() || this.incomplete();
    return [base, isError ? danger : normal].join(' ') + disabled;
  }
  errorMessage = computed(() => {
    const max = this.maxDigits();
    const count = this.comparableDigits().length;
    if (!max) return '';
    if (count === 0) return '';
    if (count < max) return `Numéro incomplet: ${count}/${max}`;
    return '';
  });
  computedPlaceholder = computed(() => {
    const base = this.placeholder();
    if (base) return base;
    const fmt = this.getPhoneFormat(this.country());
    const flag = this.currentFlag();
    return fmt ? `${flag} ${fmt}` : '';
  });

  constructor() {
    // initialize country if not provided
    effect(() => {
      if (!this.country()) {
        const navLang = (typeof navigator !== 'undefined' && navigator && navigator.language ? navigator.language : 'fr-FR').toUpperCase();
        const cc = navLang.split('-')[1] || 'FR';
        this.country.set(cc);
      }
    });

    // keep display in sync with model value and apply mask
    effect(() => {
      const v = this.value() || '';
      const formatted = this.applyFormat(v);
      this.display.set(formatted);
    });
  }

  private getCountry(code: string | null) {
    if (!code) return undefined;
    return COUNTRIES.find(x => x.code === code);
  }
  private getDial(code: string | null): string | null {
    return this.getCountry(code)?.dial ?? null;
  }
  private getPhoneFormat(code: string | null): string | null {
    return this.getCountry(code)?.phoneFormat ?? null;
  }

  currentDial = computed(() => this.getDial(this.country()) || '');
  currentFlag = computed(() => this.getCountry(this.country())?.flag || '');

  private digitsOf(s: string) { return (s || '').replace(/\D+/g, ''); }

  private maskApply(digits: string, mask: string): string {
    let res = '';
    let di = 0;
    for (let i = 0; i < mask.length; i++) {
      const ch = mask[i];
      if (ch === '#') {
        if (di < digits.length) { res += digits[di++]; } else { break; }
      } else {
        res += ch;
      }
    }
    // Do not append extra digits beyond mask
    return res;
  }

  private applyFormat(input: string): string {
    if (!this.autoFormat()) return input;
    let digits = this.digitsOf(input);
    const maskRaw = this.getPhoneFormat(this.country());
    if (!maskRaw) {
      const parts: string[] = [];
      for (let i = 0; i < digits.length; i += 2) parts.push(digits.substring(i, i + 2));
      const sign = input.trim().startsWith('+') ? '+' : '';
      const joined = parts.join(' ').trim();
      return sign + joined;
    }
    const mask = maskRaw.replace(/\s+/g, ' ').trim();
    // If mask starts with a literal dial like "+33 ", remove those digits from the input digits
    const firstPlaceholder = mask.indexOf('#');
    if (firstPlaceholder > 0) {
      const literalPrefix = mask.slice(0, firstPlaceholder);
      const literalDigits = this.digitsOf(literalPrefix);
      if (literalDigits && digits.startsWith(literalDigits)) {
        digits = digits.slice(literalDigits.length);
      }
    }
    const withMask = this.maskApply(digits, mask);
    return withMask;
  }

  onCountry(code: string | null) {
    // When country changes, reset the phone input as requested
    this.country.set(code);
    this.value.set(null);
    this.display.set('');
  }

  onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const raw = target.value || '';
    const cleaned = raw.replace(/[^0-9+()\-\s]/g, '');
    // Limit digits to mask capacity to avoid overflow/duplication
    const mask = this.getPhoneFormat(this.country());
    let digits = this.digitsOf(cleaned);
    if (mask) {
      const maxDigits = (mask.match(/#/g) || []).length;
      // If mask has a literal dial prefix, do not count it in the limit
      const firstPlaceholder = mask.indexOf('#');
      let lit = 0;
      if (firstPlaceholder > 0) {
        const literalPrefix = mask.slice(0, firstPlaceholder);
        lit = this.digitsOf(literalPrefix).length;
      }
      // Keep any leading '+'
      const hasPlus = cleaned.trim().startsWith('+');
      // If input includes the literal dial digits at start, exclude them from the count slice decision
      const includesDial = lit > 0 && digits.length >= lit;
      const numberDigits = includesDial ? digits.slice(lit) : digits;
      if (numberDigits.length > maxDigits) {
        const trimmed = numberDigits.slice(0, maxDigits);
        digits = includesDial ? digits.slice(0, lit) + trimmed : trimmed;
      }
      // Rebuild with optional '+'
      const formatted = this.applyFormat((hasPlus ? '+' : '') + digits);
      this.value.set(formatted);
      return;
    }
    // No mask case
    const formatted = this.applyFormat((cleaned.trim().startsWith('+') ? '+' : '') + digits);
    this.value.set(formatted);
  }

  onKeydown(e: KeyboardEvent) {
    const allowedControl = ['Backspace','Delete','Tab','Enter','Escape','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key);
    const isMetaCombo = e.ctrlKey || e.metaKey;
    if (allowedControl || isMetaCombo) return;

    // Prevent typing more digits than capacity
    const mask = this.getPhoneFormat(this.country());
    const max = mask ? (mask.match(/#/g) || []).length : 0;
    let currentDigits = this.digitsOf(this.value() || '');
    if (mask) {
      const firstPlaceholder = mask.indexOf('#');
      if (firstPlaceholder > 0) {
        const literalPrefix = mask.slice(0, firstPlaceholder);
        const lit = this.digitsOf(literalPrefix).length;
        if (lit > 0 && currentDigits.length >= lit) {
          currentDigits = currentDigits.slice(lit);
        }
      }
    }
    const atCapacity = max > 0 && currentDigits.length >= max;

    if (/^[0-9]$/.test(e.key)) {
      if (atCapacity) {
        e.preventDefault();
      }
      return;
    }
    if (['+',' ','-','(',')'].includes(e.key)) return;
    if (/^[a-zA-Z]$/.test(e.key) || /[^0-9+()\-\s]/.test(e.key)) e.preventDefault();
  }

  onPaste(e: ClipboardEvent) {
    const data = e.clipboardData?.getData('text') ?? '';
    const cleaned = data.replace(/[^0-9+()\-\s]/g, '');
    if (cleaned !== data) {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      const start = target.selectionStart ?? target.value.length;
      const end = target.selectionEnd ?? start;
      const next = target.value.slice(0, start) + cleaned + target.value.slice(end);
      target.value = next;
      target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  onBlur() {
    if (!this.autoApplyDialOnBlur()) return;
    const v = this.value() || '';
    if (!v) return;
    if (v.trim().startsWith('+')) return;
    const dial = this.currentDial();
    if (!dial) return;
    const mask = this.getPhoneFormat(this.country())?.replace(/\s+/g, ' ').trim() || '';
    const hasLiteralDial = mask.indexOf('#') > 0 && /\d/.test(mask.slice(0, mask.indexOf('#')));
    // If mask already contains literal dial like +33, do not prepend dial; formatting will add it
    if (hasLiteralDial) {
      const digits = this.digitsOf(v);
      const formatted = this.applyFormat(digits);
      this.value.set(formatted);
      this.display.set(formatted);
      return;
    }
    const digits = this.digitsOf(v);
    const dialDigits = this.digitsOf(dial);
    const next = `+${dialDigits}${digits}`;
    const formatted = this.applyFormat(next);
    this.value.set(formatted);
    this.display.set(formatted);
  }
}
