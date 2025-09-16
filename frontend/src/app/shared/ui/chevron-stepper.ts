import { ChangeDetectionStrategy, Component, ElementRef, HostListener, computed, input, output } from '@angular/core';

export interface Step {
  id: string;
  label: string;
  subtitle?: string;
  disabled?: boolean;
  completed?: boolean;
  visible?: boolean; // optional visibility override
}

@Component({
  selector: 'app-chevron-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
  template: `
    @if (steps().length === 0) {
      <nav aria-label="Steps" role="list" class="w-full"></nav>
    } @else {
      <nav class="w-full overflow-x-auto" [attr.role]="clickable() && !disabled() ? 'tablist' : 'list'" aria-orientation="horizontal">
        <ol class="flex items-stretch">
          @for (s of renderedSteps(); track s.step.id; let i = $index) {
            <li class="flex" [class.flex-1]="fit() === 'equal'">
              <button type="button"
                [attr.role]="clickable() && !disabled() && !s.step.disabled ? 'tab' : 'listitem'"
                class="group relative flex w-full items-center justify-center gap-2 select-none transition-colors focus:outline-none focus-visible:ring-2 ring-offset-2 px-4"
                [class.cursor-default]="!clickable() || disabled() || s.step.disabled"
                [attr.aria-selected]="s.index === clampedActive() ? 'true' : null"
                [attr.aria-current]="s.index === clampedActive() ? 'step' : null"
                [attr.aria-disabled]="disabled() || s.step.disabled ? 'true' : null"
                [disabled]="disabled() || s.step.disabled"
                (click)="onClick(s.index)"
                [style.height]="sizeH()"
                [style.clipPath]="clipFor(i, renderedSteps().length)"
                [style.border]="'1px solid ' + borderColor()"
                [style.borderLeftWidth]="'1px'"
                [style.background]="backgroundFor(s.index, s.step)"
                [style.color]="colorFor(s.index, s.step)"
                [attr.tabindex]="tabIndexFor(s.index, s.step)">
                @if (showIndex()) { <span class="opacity-70">{{ i + 1 }}</span> }
                <span class="font-medium" [class.truncate]="truncate()" [attr.title]="s.step.label" [style.fontSize]="fontSize()">{{ s.step.label }}</span>
                @if (s.step.subtitle) { <span class="opacity-70 hidden md:inline" [class.truncate]="truncate()" [attr.title]="s.step.subtitle" [style.fontSize]="subtitleFontSize()">{{ s.step.subtitle }}</span> }
              </button>
            </li>
          }
        </ol>
      </nav>
    }
  `,
  styles: [
    `:host { --tip: 20px; }
     li + li button { margin-left: -2px; }
    `
  ]
})
export class ChevronStepperComponent {
  // Inputs
  steps = input.required<Step[]>();
  activeIndex = input(0);
  // Optional list of visible step IDs; if provided, only those render. Active step always renders even if not in the list.
  visibleStepIds = input<string[] | null>(null);
  // By default, steps are not clickable (per requirement)
  clickable = input(false);
  disabled = input(false);
  size = input<'sm'|'md'|'lg'>('md');
  color = input<'primary'|'neutral'|'success'|'warning'|'danger'>('primary');
  fit = input<'auto'|'equal'>('equal');
  showIndex = input(false);
  truncate = input(true);
  // Controls the text size inside chevrons (label/subtitle)
  textScale = input<'xs'|'sm'|'md'|'lg'>('md');

  // Output
  stepSelected = output<number>();

  // Derived/computed
  clampedActive = computed(() => {
    const steps = this.steps();
    const idx = this.activeIndex();
    const max = Math.max(0, steps.length - 1);
    return Math.min(Math.max(0, idx), max);
  });

  sizeH = computed(() => {
    const s = this.size();
    switch (s) {
      case 'sm': return '2rem'; // h-8
      case 'lg': return '3rem'; // h-12
      default: return '2.5rem'; // h-10
    }
  });

  // Font sizes for label and optional subtitle
  fontSize = computed(() => {
    switch (this.textScale()) {
      case 'xs': return '0.75rem';    // text-xs
      case 'sm': return '0.875rem';   // text-sm
      case 'lg': return '1.125rem';   // text-lg
      default: return '1rem';         // text-base
    }
  });
  subtitleFontSize = computed(() => {
    switch (this.textScale()) {
      case 'xs': return '0.6875rem';  // slightly smaller than xs
      case 'sm': return '0.75rem';
      case 'lg': return '1rem';
      default: return '0.875rem';
    }
  });

  // Steps rendered after applying visibility rules
  renderedSteps = computed(() => {
    const all = this.steps();
    const active = this.clampedActive();
    const allowIds = this.visibleStepIds();
    return all
      .map((step, index) => ({ step, index }))
      .filter(({ step, index }) => {
        const byProp = step.visible !== false; // default visible if undefined
        const byIds = !allowIds || allowIds.includes(step.id);
        const isActive = index === active;
        // Render if allowed by both rules, or always render active step even if hidden
        return ((byProp && byIds) || isActive);
      });
  });

  // Optional color overrides (hex, rgb, or CSS var). If not set, fallback to CSS variables in styles.css
  upcomingBgColor = input<string | null>(null);
  upcomingFgColor = input<string | null>(null);
  activeBgColor = input<string | null>(null);
  activeFgColor = input<string | null>(null);
  completedBgColor = input<string | null>(null);
  completedFgColor = input<string | null>(null);

  // Colors via CSS variables; fallback to tokens in styles.css
  borderColor = computed(() => `rgb(var(--step-border, 203 213 225))`);
  baseBg = computed(() => `rgb(var(--step-bg, 243 244 246))`);
  baseFg = computed(() => `rgb(var(--step-fg, 17 24 39))`);
  activeBg = computed(() => `rgb(var(--step-active-bg, 99 102 241))`);
  activeFg = computed(() => `rgb(var(--step-active-fg, 255 255 255))`);
  completedBg = computed(() => `rgb(var(--step-completed-bg, 209 250 229))`);
  completedFg = computed(() => `rgb(var(--step-completed-fg, 6 95 70))`);

  private pick(v: string | null, fallback: string) { return v ?? fallback; }

  backgroundFor = (originalIndex: number, step: Step) => {
    if (originalIndex === this.clampedActive()) return this.pick(this.activeBgColor(), this.activeBg());
    if (step.completed) return this.pick(this.completedBgColor(), this.completedBg());
    return this.pick(this.upcomingBgColor(), this.baseBg());
  };
  colorFor = (originalIndex: number, step: Step) => {
    if (originalIndex === this.clampedActive()) return this.pick(this.activeFgColor(), this.activeFg());
    if (step.completed) return this.pick(this.completedFgColor(), this.completedFg());
    return this.pick(this.upcomingFgColor(), this.baseFg());
  };

  clipFor(i: number, total: number) {
    const isFirst = i === 0;
    const isLast = i === total - 1;
    if(isFirst) return 'polygon(0 0, calc(100% - var(--tip)) 0, 100% 50%, calc(100% - var(--tip)) 100%, 0 100%, 0 0)';
    if (isLast) return 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 20px 50%)';
    return 'polygon(0 0, calc(100% - var(--tip)) 0, 100% 50%, calc(100% - var(--tip)) 100%, 0 100%, 20px 50%)';
  }

  chevronClasses = (i: number, step: Step) => ({
    'is-active': i === this.clampedActive(),
    'is-completed': !!step.completed && i !== this.clampedActive(),
  });

  tabIndexFor(i: number, step: Step) {
    if (this.disabled() || step.disabled) return -1;
    return i === this.clampedActive() ? 0 : -1;
  }

  onClick(i: number) {
    if (!this.clickable() || this.disabled() || this.steps()[i]?.disabled) return;
    this.stepSelected.emit(i);
  }

  // Keyboard navigation on the host: left/right to change focus within tablist
  constructor(private host: ElementRef<HTMLElement>) {}

  @HostListener('keydown', ['$event'])
  onKeydown(ev: KeyboardEvent) {
    if (!this.clickable() || this.disabled()) return;
    const code = ev.key;
    if (code !== 'ArrowLeft' && code !== 'ArrowRight' && code !== 'Enter' && code !== ' ') return;

    const items = Array.from(this.host.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    const current = items.findIndex(b => b.tabIndex === 0);
    if (code === 'ArrowLeft' || code === 'ArrowRight') {
      ev.preventDefault();
      let next = current;
      const dir = code === 'ArrowRight' ? 1 : -1;
      // find next enabled
      for (let k = 1; k <= items.length; k++) {
        const idx = (current + dir * k + items.length) % items.length;
        const btn = items[idx];
        if (!btn.disabled) { next = idx; break; }
      }
      items[next]?.focus();
    } else if (code === 'Enter' || code === ' ') {
      ev.preventDefault();
      const btn = items[current];
      btn?.click();
    }
  }
}
