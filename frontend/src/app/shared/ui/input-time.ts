import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';

function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)); }
function pad2(n: number) { return String(n).padStart(2, '0'); }

@Component({
  selector: 'app-input-time',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="block">
      @if (label()) {
        <span class="block text-sm text-muted mb-1">{{ label() }} @if (required()) { <span class="text-red-500">*</span> }</span>
      }
      <div [class]="wrapperClass()">
        <span class="material-symbols-outlined text-muted pl-2 pr-1">schedule</span>
        <input type="number" inputmode="numeric" class="w-12 h-10 bg-transparent text-fg text-center outline-none"
               [min]="hour12() ? 1 : 0" [max]="hour12() ? 12 : 23" [value]="hours()" (input)="onHour($event)" [disabled]="disabled()"/>
        <span class="px-1 select-none">:</span>
        <input type="number" inputmode="numeric" class="w-12 h-10 bg-transparent text-fg text-center outline-none"
               [min]="0" [step]="step()" [max]="59" [value]="minutes()" (input)="onMinute($event)" [disabled]="disabled()"/>
        @if (showSeconds()) {
          <span class="px-1 select-none">:</span>
          <input type="number" inputmode="numeric" class="w-12 h-10 bg-transparent text-fg text-center outline-none"
                 [min]="0" [step]="secondStep()" [max]="59" [value]="seconds()" (input)="onSecond($event)" [disabled]="disabled()"/>
        }
        @if (hour12()) {
          <span class="px-1 select-none">·</span>
          <select class="h-10 bg-transparent text-fg outline-none pr-2" [value]="ampm()" (change)="onAmPm($event)" [disabled]="disabled()">
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        }
      </div>
      @if (hint() && !error()) { <div class="text-xs text-muted mt-1">{{ hint() }}</div> }
      @if (error()) { <div class="text-xs text-red-500 mt-1">{{ error() }}</div> }
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' }
})
export class InputTimeComponent {
  // model: HH:mm or HH:mm:ss depending on showSeconds
  value = model<string>('');

  // Inputs
  label = input<string>('');
  hint = input<string>('');
  error = input<string>('');
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  hour12 = input<boolean>(false);
  showSeconds = input<boolean>(false);
  step = input<number>(1); // minute step
  secondStep = input<number>(1);

  // Outputs
  valueChange = output<string>();

  wrapperClass = computed(() => {
    const base = 'inline-flex items-center w-full h-11 border bg-surface text-fg placeholder-muted text-base outline-none shadow-sm rounded-md';
    const border = this.error() ? ' border-red-500 ring-red-500' : ' border-token focus-within:ring-1 ring-primary';
    const state = this.disabled() ? ' opacity-60 cursor-not-allowed' : '';
    return base + border + state;
  });

  private parse(): { h: number; m: number; s: number } {
    const v = this.value();
    const m = /^([0-2]?\d):([0-5]?\d)(?::([0-5]?\d))?$/.exec(v ?? '');
    if (!m) return { h: 0, m: 0, s: 0 };
    const hh = clamp(Number(m[1] ?? 0), 0, 23);
    const mm = clamp(Number(m[2] ?? 0), 0, 59);
    const ss = clamp(Number(m[3] ?? 0), 0, 59);
    return { h: hh, m: mm, s: ss };
  }

  private toDisplayHours(h24: number) { return this.hour12() ? ((h24 % 12) || 12) : h24; }
  private to24h(hDisp: number): number {
    const base = this.hour12() ? clamp(hDisp, 1, 12) % 12 : clamp(hDisp, 0, 23);
    const isPm = this.ampm() === 'PM';
    return this.hour12() ? (base + (isPm ? 12 : 0)) % 24 : base;
  }

  hours = computed(() => this.toDisplayHours(this.parse().h));
  minutes = computed(() => this.parse().m);
  seconds = computed(() => this.parse().s);
  ampm = computed<'AM' | 'PM'>(() => this.parse().h >= 12 ? 'PM' : 'AM');

  private emit(h24: number, m: number, s: number) {
    const mm = clamp(Math.round(m / Math.max(1, this.step())) * Math.max(1, this.step()), 0, 59);
    const ss = this.showSeconds() ? clamp(Math.round(s / Math.max(1, this.secondStep())) * Math.max(1, this.secondStep()), 0, 59) : 0;
    const out = `${pad2(h24)}:${pad2(mm)}${this.showSeconds() ? ':' + pad2(ss) : ''}`;
    this.value.set(out);
    this.valueChange.emit(out);
  }

  onHour(e: Event) {
    const v = Number((e.target as HTMLInputElement).value);
    const h24 = this.to24h(isNaN(v) ? 0 : v);
    const p = this.parse();
    this.emit(h24, p.m, p.s);
  }
  onMinute(e: Event) {
    let v = Number((e.target as HTMLInputElement).value);
    if (isNaN(v)) v = 0;
    const p = this.parse();
    this.emit(p.h, clamp(v, 0, 59), p.s);
  }
  onSecond(e: Event) {
    let v = Number((e.target as HTMLInputElement).value);
    if (isNaN(v)) v = 0;
    const p = this.parse();
    this.emit(p.h, p.m, clamp(v, 0, 59));
  }
  onAmPm(e: Event) {
    const v = (e.target as HTMLSelectElement).value as 'AM' | 'PM';
    const p = this.parse();
    let h = p.h % 12;
    if (v === 'PM') h += 12;
    this.emit(h, p.m, p.s);
  }
}
