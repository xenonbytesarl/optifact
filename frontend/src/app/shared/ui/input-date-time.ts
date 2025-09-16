import { ChangeDetectionStrategy, Component, computed, inject, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../core/i18n/translate.service';

function toDate(val: string | Date | null): Date | null {
  if (val == null) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
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

function pad2(n: number) { return String(n).padStart(2, '0'); }

@Component({
  selector: 'app-input-date-time',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <!-- Shell -->
      <div role="combobox" [attr.aria-expanded]="open()" aria-haspopup="dialog"
           [class]="inputClass()" (click)="onToggleOpen()">
        <div class="flex items-center h-11 px-3">
          <input class="flex-1 bg-transparent outline-none"
                 [placeholder]="placeholder()"
                 [disabled]="disabled() || readonly()"
                 [value]="displayValue()"
                 (blur)="onBlur()"
                 (keydown)="onInputKeydown($event)"
          />
          <span class="material-symbols-outlined text-muted ml-2">calendar_month</span>
          <span class="material-symbols-outlined text-muted ml-1">schedule</span>
          @if (clearable() && value()) {
            <button type="button" class="ml-1 text-muted hover:text-fg" (click)="clear($event)" aria-label="Clear">
              <span class="material-symbols-outlined">close</span>
            </button>
          }
        </div>
      </div>

      @if (open()) {
        <div role="dialog" [attr.aria-modal]="false" class="absolute mt-1"
             [ngStyle]="{ zIndex: zIndex() }">
          <div class="z-50 bg-surface rounded-md border border-token shadow-md text-fg min-w-[20rem] p-2">
            <!-- Header month/year -->
            <div class="flex items-center justify-between px-1 py-1 border-b border-token">
              <button type="button" class="size-8 inline-flex items-center justify-center hover-surface-weak rounded"
                      (click)="prevMonth()"><span class="material-symbols-outlined">navigate_before</span></button>
              <div class="text-sm font-medium">{{ monthLabel() }} {{ viewYear() }}</div>
              <button type="button" class="size-8 inline-flex items-center justify-center hover-surface-weak rounded"
                      (click)="nextMonth()"><span class="material-symbols-outlined">navigate_next</span></button>
            </div>
            <!-- Calendar grid -->
            <div class="grid grid-cols-7 gap-1 px-1 pt-2 text-xs text-muted select-none">
              @for (d of weekDayLabels(); track d) { <div class="text-center">{{ d }}</div> }
            </div>
            <div class="grid grid-cols-7 gap-1 p-2">
              @for (c of cells(); track c.key) {
                <button type="button"
                        class="size-9 rounded text-sm inline-flex items-center justify-center hover-surface-weak focus:outline-none focus:ring-1 ring-primary"
                        [ngClass]="{
                          'bg-primary text-[rgb(var(--color-on-primary))]': c.selected,
                          'text-muted opacity-60': !c.inMonth,
                          'opacity-40 cursor-not-allowed': c.disabled
                        }"
                        [disabled]="c.disabled"
                        (click)="onPickDate(c.date)">
                  {{ c.date.getDate() }}
                </button>
              }
            </div>

            <!-- Time selector -->
            <div class="flex items-center gap-2 px-2 py-2 border-t border-token">
              <div class="flex items-center gap-1">
                <div class="inline-flex items-center rounded-md border border-token bg-surface focus-within:ring-1 ring-primary">
                  <span class="material-symbols-outlined text-muted pl-2 pr-1">schedule</span>
                  <input type="number" inputmode="numeric" class="w-12 h-9 bg-transparent text-fg text-center outline-none"
                         [min]="hour12() ? 1 : 0" [max]="hour12() ? 12 : 23" [value]="hours()" (input)="onHourInput($event)"/>
                  <span class="px-1 select-none">:</span>
                  <input type="number" inputmode="numeric" class="w-12 h-9 bg-transparent text-fg text-center outline-none"
                         [min]="0" [step]="minuteStep()" [max]="59" [value]="minutes()" (input)="onMinuteInput($event)"/>
                  @if (showSeconds()) {
                    <span class="px-1 select-none">:</span>
                    <input type="number" inputmode="numeric" class="w-12 h-9 bg-transparent text-fg text-center outline-none"
                           [min]="0" [step]="secondStep()" [max]="59" [value]="seconds()" (input)="onSecondInput($event)"/>
                  }
                  @if (hour12()) {
                    <span class="px-1 select-none">·</span>
                    <select class="h-9 bg-transparent text-fg outline-none pr-2"
                            [value]="ampm()" (change)="onAmPm($event)">
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  }
                </div>
              </div>
              <div class="flex-1"></div>
              <button type="button" class="px-2 py-1 text-sm hover-surface-weak rounded inline-flex items-center gap-1" (click)="now()">
                <span class="material-symbols-outlined text-base">check</span><span>{{ nowLabel() }}</span>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' }
})
export class InputDateTimeComponent {
  value = model<Date | null>(null);
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  error = input<boolean>(false);
  placeholder = input<string>('');
  required = input<boolean>(false);
  min = input<Date | null>(null);
  max = input<Date | null>(null);
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
  outputFormat = input<'date' | 'iso' | 'iso-local' | 'timestamp'>('iso');
  displayFormat = input<string | Intl.DateTimeFormatOptions | null>(null);
  parseStrict = input<boolean>(true);
  firstDayOfWeek = input<0 | 1 | null>(null);
  panelClass = input<string>('');
  zIndex = input<number>(50);

  // Specific
  showSeconds = input<boolean>(false);
  hour12 = input<boolean>(false);
  minuteStep = input<number>(15);
  secondStep = input<number>(1);
  timePlacement = input<'below' | 'right' | 'tabs'>('below');
  roundToStep = input<'floor' | 'ceil' | 'nearest'>('nearest');

  // Outputs
  valueChange = output<string | Date | null>();
  blurred = output<void>();
  openedChange = output<boolean>();
  cleared = output<void>();
  nowClicked = output<void>();

  private i18n = inject(TranslateService);
  open = signal(false);
  viewDate = signal<Date>(new Date());

  activeLocale = computed(() => this.locale() ?? this.i18n.lang());

  displayValue = computed(() => {
    const v = toDate(this.value());
    if (!v) return '';
    const fmt = this.displayFormat();
    try {
      const opts: Intl.DateTimeFormatOptions | undefined = typeof fmt === 'object' && fmt ? fmt : undefined;
      return new Intl.DateTimeFormat(this.activeLocale(), opts ?? { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(v);
    } catch {
      return `${toDateOnlyString(v)} ${pad2(v.getHours())}:${pad2(v.getMinutes())}${this.showSeconds() ? ':' + pad2(v.getSeconds()) : ''}`;
    }
  });

  monthLabel = computed(() => new Intl.DateTimeFormat(this.activeLocale(), { month: 'long' }).format(this.viewDate()));
  viewYear = computed(() => this.viewDate().getFullYear());

  weekDayLabels = computed(() => {
    const first = this.firstDay();
    const base = [] as string[];
    for (let i = 0; i < 7; i++) {
      const tmp = new Date(2020, 5, 7 + i);
      const lbl = new Intl.DateTimeFormat(this.activeLocale(), { weekday: 'short' }).format(tmp);
      base.push(lbl);
    }
    if (first === 1) { const s = base.shift()!; base.push(s); }
    return base;
  });

  firstDay() { return this.firstDayOfWeek() != null ? this.firstDayOfWeek()! : (this.activeLocale() === 'fr' ? 1 : 0); }

  cells = computed(() => {
    const view = this.viewDate();
    const year = view.getFullYear();
    const month = view.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = (firstOfMonth.getDay() - this.firstDay() + 7) % 7;
    const gridStart = new Date(firstOfMonth); gridStart.setDate(firstOfMonth.getDate() - startOffset);
    const selected = toDate(this.value());
    const today = new Date();
    const min = toDate(this.min());
    const max = toDate(this.max());

    const out: { key: string; date: Date; inMonth: boolean; disabled: boolean; selected: boolean }[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(gridStart); date.setDate(gridStart.getDate() + i);
      const inMonth = date.getMonth() === month;
      let disabled = false;
      // Basic disable rules similar to date-only component
      if (min && date < new Date(min.getFullYear(), min.getMonth(), min.getDate())) disabled = true;
      if (max && date > new Date(max.getFullYear(), max.getMonth(), max.getDate())) disabled = true;
      if (this.disableWeekends() && (date.getDay() === 0 || date.getDay() === 6)) disabled = true;
      if (this.disablePast()) {
        const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (date < t0) disabled = true;
      }
      if (this.disableFuture()) {
        const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (date > t0) disabled = true;
      }
      const df = this.dateFilter();
      if (df && !df(date)) disabled = true;
      for (const dd of this.disabledDates()) {
        const d2 = toDate(dd);
        if (d2 && d2.getFullYear() === date.getFullYear() && d2.getMonth() === date.getMonth() && d2.getDate() === date.getDate()) disabled = true;
      }
      const selectedFlag = !!(selected && selected.getFullYear() === date.getFullYear() && selected.getMonth() === date.getMonth() && selected.getDate() === date.getDate());
      out.push({ key: date.toISOString(), date, inMonth, disabled, selected: selectedFlag });
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
      this._hours.set(v.getHours());
      this._minutes.set(v.getMinutes());
      this._seconds.set(v.getSeconds());
    }
  }

  onInputKeydown(ev: KeyboardEvent) {
    if (ev.altKey && ev.key === 'ArrowDown') { ev.preventDefault(); if (!this.open()) this.onToggleOpen(); }
    if (ev.key === 'Escape') { this.close(); }
  }

  onBlur() { this.blurred.emit(); if (this.autoClose()) this.close(); }
  close() { if (this.open()) { this.open.set(false); this.openedChange.emit(false); } }

  // Time model signals (independent while panel open)
  private _hours = signal<number>(0);
  private _minutes = signal<number>(0);
  private _seconds = signal<number>(0);

  hours = computed(() => {
    const h = this._hours();
    return this.hour12() ? ((h % 12) || 12) : h;
  });
  minutes = computed(() => this._minutes());
  seconds = computed(() => this._seconds());
  ampm = computed<'AM' | 'PM'>(() => this._hours() >= 12 ? 'PM' : 'AM');

  onHourInput(e: Event) {
    const v = Number((e.target as HTMLInputElement).value);
    let h = isNaN(v) ? 0 : v;
    if (this.hour12()) {
      // keep AM/PM, convert to 24h later on apply
      const isPm = this.ampm() === 'PM';
      h = Math.min(12, Math.max(1, h));
      this._hours.set(((h % 12) + (isPm ? 12 : 0)) % 24);
    } else {
      this._hours.set(Math.min(23, Math.max(0, h)));
    }
    this.applyDateTimeIfAuto();
  }
  onMinuteInput(e: Event) {
    const step = Math.max(1, this.minuteStep());
    let m = Number((e.target as HTMLInputElement).value);
    if (isNaN(m)) m = 0;
    m = Math.min(59, Math.max(0, m));
    this._minutes.set(m - (m % step));
    this.applyDateTimeIfAuto();
  }
  onSecondInput(e: Event) {
    let s = Number((e.target as HTMLInputElement).value);
    if (isNaN(s)) s = 0;
    s = Math.min(59, Math.max(0, s));
    this._seconds.set(s - (s % Math.max(1, this.secondStep())));
    this.applyDateTimeIfAuto();
  }
  onAmPm(e: Event) {
    const v = (e.target as HTMLSelectElement).value as 'AM' | 'PM';
    const h = this._hours();
    const isPm = v === 'PM';
    const base = h % 12; // 0..11
    this._hours.set(base + (isPm ? 12 : 0));
    this.applyDateTimeIfAuto();
  }

  onPickDate(d: Date) {
    // set chosen date, keep time
    const curr = toDate(this.value()) ?? new Date();
    const merged = new Date(d.getFullYear(), d.getMonth(), d.getDate(), this._hours(), this._minutes(), this._seconds(), 0);
    this.commitValue(merged);
    if (this.autoClose()) this.close();
  }

  prevMonth() { const d = new Date(this.viewDate()); d.setMonth(d.getMonth() - 1); this.viewDate.set(d); }
  nextMonth() { const d = new Date(this.viewDate()); d.setMonth(d.getMonth() + 1); this.viewDate.set(d); }

  now() {
    const now = new Date();
    // Round to step
    const step = Math.max(1, this.minuteStep());
    let minutes = now.getMinutes();
    const mod = minutes % step;
    const mode = this.roundToStep();
    if (mode === 'floor') minutes -= mod;
    else if (mode === 'ceil') minutes += (mod ? step - mod : 0);
    else { // nearest
      minutes = mod >= step / 2 ? minutes + (step - mod) : minutes - mod;
    }
    const rounded = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), Math.min(59, minutes), this.showSeconds() ? now.getSeconds() : 0, 0);
    this._hours.set(rounded.getHours());
    this._minutes.set(rounded.getMinutes());
    this._seconds.set(rounded.getSeconds());
    this.nowClicked.emit();
    this.commitValue(rounded);
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
        const ss = String((this.showSeconds() ? clamped.getSeconds() : 0)).padStart(2, '0');
        out = `${yyyy}-${MM}-${dd}T${HH}:${mi}:${ss}${sign}${hh}:${mm}`.replace('${hh}', hh).replace('${mm}', mm);
        break;
      }
      case 'timestamp': out = clamped.getTime(); break;
      default: out = clamped.toISOString();
    }
    this.value.set(out as any);
    this.valueChange.emit(out as any);
  }

  clear(ev?: Event) { if (ev) ev.stopPropagation(); this.value.set(null); this.valueChange.emit(null); this.cleared.emit(); }

  // When user adjusts time fields while panel is open, optionally apply to current selected date immediately
  private applyDateTimeIfAuto() {
    if (!this.open()) return;
    const base = toDate(this.value()) ?? new Date();
    const merged = new Date(base.getFullYear(), base.getMonth(), base.getDate(), this._hours(), this._minutes(), this._seconds(), 0);
    // Do not close; just update the value to reflect time adjustments
    this.commitValue(merged);
  }

  // Labels
  nowLabel = computed(() => this.activeLocale() === 'fr' ? 'Maintenant' : 'Now');
}
