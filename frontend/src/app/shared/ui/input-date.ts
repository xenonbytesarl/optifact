import { ChangeDetectionStrategy, Component, ElementRef, HostListener, TemplateRef, computed, effect, inject, input, model, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../core/i18n/translate.service';

// Helpers
function toDate(val: string | Date | null): Date | null {
  if (val == null) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  // Accept yyyy-MM-dd (date-only) and ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
    const [y, m, d] = val.split('-').map(Number);
    const dt = new Date(y, (m - 1), d, 0, 0, 0, 0);
    return isNaN(dt.getTime()) ? null : dt;
  }
  const dt = new Date(val);
  return isNaN(dt.getTime()) ? null : dt;
}

function toDateOnlyString(dt: Date): string {
  const y = dt.getFullYear();
  const m = `${dt.getMonth() + 1}`.padStart(2, '0');
  const d = `${dt.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function clampDate(d: Date, min?: Date | null, max?: Date | null): Date {
  const t = d.getTime();
  if (min && t < min.getTime()) return new Date(min);
  if (max && t > max.getTime()) return new Date(max);
  return d;
}

function isSameDate(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function addDays(d: Date, delta: number): Date { const nd = new Date(d); nd.setDate(d.getDate() + delta); return nd; }
function addMonths(d: Date, delta: number): Date { const nd = new Date(d); nd.setMonth(d.getMonth() + delta); return nd; }

interface DayCell { date: Date; inMonth: boolean; disabled: boolean; isToday: boolean; selected: boolean; }

@Component({
  selector: 'app-input-date',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <!-- Input shell -->
      <div role="combobox" [attr.aria-expanded]="open()" aria-haspopup="dialog"
           [class]="inputClass()" (click)="onToggleOpen()">
        <div class="flex items-center h-11 px-3">
          <input class="flex-1 bg-transparent outline-none"
                 [placeholder]="placeholder()"
                 [disabled]="disabled() || readonly()"
                 [value]="displayValue()"
                 (input)="onTextInput($event)"
                 (blur)="onBlur()"
                 (keydown)="onInputKeydown($event)"
                 />
          <span class="material-symbols-outlined text-muted ml-2">calendar_month</span>
          @if (clearable() && value()) {
            <button type="button" class="ml-1 text-muted hover:text-fg" (click)="clear($event)" aria-label="Clear">
              <span class="material-symbols-outlined">close</span>
            </button>
          }
        </div>
      </div>

      <!-- Popover -->
      @if (open()) {
        <div role="dialog" [attr.aria-modal]="false" class="absolute mt-1 {{panelClass()}}"
             [ngStyle]="{ zIndex: zIndex() }">
          <div class="z-50 bg-surface rounded-md border border-token shadow-md text-fg min-w-[16rem]">
            <div class="flex items-center justify-between px-3 py-2 border-b border-token">
              <button type="button" class="size-8 inline-flex items-center justify-center hover-surface-weak rounded"
                      (click)="prevMonth()" aria-label="Previous month">
                <span class="material-symbols-outlined">navigate_before</span>
              </button>
              <div class="text-sm font-medium">{{ monthLabel() }} {{ viewYear() }}</div>
              <button type="button" class="size-8 inline-flex items-center justify-center hover-surface-weak rounded"
                      (click)="nextMonth()" aria-label="Next month">
                <span class="material-symbols-outlined">navigate_next</span>
              </button>
            </div>
            <div class="grid grid-cols-7 gap-1 px-2 pt-2 text-xs text-muted select-none">
              @for (d of weekDayLabels(); track d) { <div class="text-center">{{ d }}</div> }
            </div>
            <div class="grid grid-cols-7 gap-1 p-2">
              @for (c of cells(); track c.date.toISOString()) {
                <button type="button"
                        class="size-9 rounded text-sm inline-flex items-center justify-center hover-surface-weak focus:outline-none focus:ring-1 ring-primary"
                        [ngClass]="{
                          'bg-primary text-[rgb(var(--color-on-primary))]': c.selected,
                          'border border-primary': c.isToday && !c.selected,
                          'text-muted opacity-60': !c.inMonth,
                          'opacity-40 cursor-not-allowed': c.disabled
                        }"
                        [disabled]="c.disabled"
                        (click)="selectDate(c.date)">
                  {{ c.date.getDate() }}
                </button>
              }
            </div>
            <div class="flex items-center justify-end gap-2 px-3 py-2 border-t border-token">
              <button type="button" class="px-2 py-1 text-sm hover-surface-weak rounded inline-flex items-center gap-1" (click)="today()">
                <span class="material-symbols-outlined text-base">today</span><span>{{ todayLabel() }}</span>
              </button>
              @if (clearable()) {
                <button type="button" class="px-2 py-1 text-sm hover-surface-weak rounded inline-flex items-center gap-1" (click)="clear($event)">
                  <span class="material-symbols-outlined text-base">close</span><span>{{ clearLabel() }}</span>
                </button>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' }
})
export class InputDateComponent {
  // Model/value
  value = model<string | Date | null>(null);
  // Common inputs per spec
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  error = input<boolean>(false);
  placeholder = input<string>('');
  required = input<boolean>(false);
  min = input<string | Date | null>(null);
  max = input<string | Date | null>(null);
  dateFilter = input<((d: Date) => boolean) | null>(null);
  disabledDates = input<(string | Date)[]>([]);
  disableWeekends = input<boolean>(false);
  disablePast = input<boolean>(false);
  disableFuture = input<boolean>(false);
  locale = input<'fr' | 'en' | null>(null);
  openOnFocus = input<boolean>(true);
  autoClose = input<boolean>(true);
  clearable = input<boolean>(true);
  nativeOnMobile = input<boolean>(true);
  outputFormat = input<'date' | 'iso' | 'iso-local' | 'timestamp'>('date');
  displayFormat = input<string | Intl.DateTimeFormatOptions | null>(null);
  parseStrict = input<boolean>(true);
  firstDayOfWeek = input<0 | 1 | null>(null);
  panelClass = input<string>('');
  zIndex = input<number>(50);

  // Outputs
  valueChange = output<string | Date | null>();
  blurred = output<void>();
  openedChange = output<boolean>();
  cleared = output<void>();
  todayClicked = output<void>();

  // Internal
  private i18n = inject(TranslateService);
  open = signal(false);
  viewDate = signal<Date>(new Date());

  // Derived locale
  activeLocale = computed(() => this.locale() ?? this.i18n.lang());

  // Display value (formatted)
  displayValue = computed(() => {
    const v = toDate(this.value());
    if (!v) return '';
    const fmt = this.displayFormat();
    try {
      if (typeof fmt === 'string') return fmt // treat as custom string pattern? For MVP, fall back to Intl
      const opts: Intl.DateTimeFormatOptions | undefined = typeof fmt === 'object' && fmt ? fmt : undefined;
      return new Intl.DateTimeFormat(this.activeLocale(), opts ?? { year: 'numeric', month: '2-digit', day: '2-digit' }).format(v);
    } catch {
      return toDateOnlyString(v);
    }
  });

  monthLabel = computed(() => new Intl.DateTimeFormat(this.activeLocale(), { month: 'long' }).format(this.viewDate()));
  viewYear = computed(() => this.viewDate().getFullYear());

  // Weekday labels
  weekDayLabels = computed(() => {
    const first = this.firstDay();
    const base = [] as string[];
    for (let i = 0; i < 7; i++) {
      const tmp = new Date(2020, 5, 7 + i); // arbitrary week starting Sun
      const lbl = new Intl.DateTimeFormat(this.activeLocale(), { weekday: 'short' }).format(tmp);
      base.push(lbl);
    }
    // Reorder according to firstDayOfWeek
    if (first === 1) {
      // Monday first
      const sunday = base.shift()!;
      base.push(sunday);
    }
    return base;
  });

  firstDay() { // 0=Sunday,1=Monday
    if (this.firstDayOfWeek() != null) return this.firstDayOfWeek()!;
    return this.activeLocale() === 'fr' ? 1 : 0;
  }

  // Calendar cells
  cells = computed<DayCell[]>(() => {
    const view = this.viewDate();
    const year = view.getFullYear();
    const month = view.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = (firstOfMonth.getDay() - this.firstDay() + 7) % 7;
    const gridStart = addDays(firstOfMonth, -startOffset);

    const selected = toDate(this.value());
    const today = new Date();
    const min = toDate(this.min());
    const max = toDate(this.max());

    const out: DayCell[] = [];
    for (let i = 0; i < 42; i++) {
      const date = addDays(gridStart, i);
      const inMonth = date.getMonth() === month;
      let disabled = false;
      if (min && date < new Date(min.getFullYear(), min.getMonth(), min.getDate())) disabled = true;
      if (max && date > new Date(max.getFullYear(), max.getMonth(), max.getDate())) disabled = true;
      if (this.disableWeekends() && (date.getDay() === 0 || date.getDay() === 6)) disabled = true;
      if (this.disablePast()) {
        const today0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (date < today0) disabled = true;
      }
      if (this.disableFuture()) {
        const today0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (date > today0) disabled = true;
      }
      const df = this.dateFilter();
      if (df && !df(date)) disabled = true;
      for (const dd of this.disabledDates()) {
        const d2 = toDate(dd);
        if (d2 && isSameDate(d2, date)) disabled = true;
      }
      out.push({
        date,
        inMonth,
        disabled,
        isToday: isSameDate(date, today),
        selected: isSameDate(date, selected)
      });
    }
    return out;
  });

  inputClass() {
    const base = 'w-full h-11 border bg-surface text-fg placeholder-muted text-base outline-none shadow-sm rounded-md';
    const normal = 'border-token focus:ring-1 ring-primary';
    const danger = 'border-red-500 focus:ring-1 ring-red-500';
    const disabled = (this.disabled() || this.readonly()) ? ' opacity-60 cursor-not-allowed' : '';
    return [base, this.error() ? danger : normal].join(' ') + disabled;
  }

  onToggleOpen() {
    if (this.disabled() || this.readonly()) return;
    this.open.set(!this.open());
    this.openedChange.emit(this.open());
    if (this.open()) {
      const v = toDate(this.value()) ?? new Date();
      this.viewDate.set(v);
    }
  }

  onInputKeydown(ev: KeyboardEvent) {
    if (ev.altKey && ev.key === 'ArrowDown') { ev.preventDefault(); this.openIfNeeded(); }
    if (ev.key === 'Escape') { this.close(); }
    if (ev.key === 'Enter') { // try parse
      const target = ev.target as HTMLInputElement;
      if (!target) return;
      const parsed = toDate(target.value);
      if (parsed) this.commitValue(parsed);
    }
  }

  onTextInput(e: Event) {
    // live typing: we keep text in input only; commit on Enter or blur if parseStrict=false
    // For MVP we do not maintain separate text model; rely on Enter or blur
  }

  onBlur() { this.blurred.emit(); if (this.autoClose()) this.close(); }

  openIfNeeded() { if (!this.open()) this.onToggleOpen(); }
  close() { if (this.open()) { this.open.set(false); this.openedChange.emit(false); } }

  selectDate(d: Date) {
    this.commitValue(d);
    if (this.autoClose()) this.close();
  }

  commitValue(d: Date) {
    const min = toDate(this.min());
    const max = toDate(this.max());
    const clamped = clampDate(d, min, max);
    const fmt = this.outputFormat();
    let out: string | Date | number | null = null;
    switch (fmt) {
      case 'date': out = toDateOnlyString(clamped); break;
      case 'iso': out = new Date(clamped).toISOString(); break;
      case 'iso-local': {
        const tzOff = clamped.getTimezoneOffset();
        const sign = tzOff > 0 ? '-' : '+';
        const abs = Math.abs(tzOff);
        const hh = String(Math.floor(abs / 60)).padStart(2, '0');
        const mm = String(abs % 60).padStart(2, '0');
        const yyyy = clamped.getFullYear();
        const MM = String(clamped.getMonth() + 1).padStart(2, '0');
        const dd = String(clamped.getDate()).padStart(2, '0');
        const HH = String(clamped.getHours()).padStart(2, '0');
        const mi = String(clamped.getMinutes()).padStart(2, '0');
        const ss = String(clamped.getSeconds()).padStart(2, '0');
        out = `${yyyy}-${MM}-${dd}T${HH}:${mi}:${ss}${sign}${hh}:${mm}`.replace('${hh}', hh).replace('${mm}', mm); // keep simple
        break;
      }
      case 'timestamp': out = clamped.getTime(); break;
      default: out = toDateOnlyString(clamped);
    }
    this.value.set(out as any);
    this.valueChange.emit(out as any);
  }

  clear(ev?: Event) { if (ev) ev.stopPropagation(); this.value.set(null); this.valueChange.emit(null); this.cleared.emit(); }

  today() { this.todayClicked.emit(); this.selectDate(new Date()); }

  prevMonth() { this.viewDate.set(addMonths(this.viewDate(), -1)); }
  nextMonth() { this.viewDate.set(addMonths(this.viewDate(), 1)); }

  // Labels
  todayLabel = computed(() => this.activeLocale() === 'fr' ? 'Aujourd\'hui' : 'Today');
  clearLabel = computed(() => this.activeLocale() === 'fr' ? 'Effacer' : 'Clear');
}
