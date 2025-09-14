import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    'class': 'inline-flex items-center justify-center font-medium  transition focus:outline-none focus:ring-2 ring-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.role]': "'button'"
  },
  template: `
    <button [attr.type]="type()"
            (click)="onClick($event)"
            [disabled]="disabled()"
            class="gap-2 inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 ring-primary "
            [ngClass]="{
          'w-full': fullWidth(),
          'px-2.5 py-1.5 text-xs': size() === 'xs',
          'px-3 py-2 text-sm': size() === 'sm',
          'px-4 py-2.5 text-sm': size() === 'md',
          'px-5 py-3 text-base': size() === 'lg',
          'p-3': size() === 'icon' || iconOnly(),

          'rounded-none': rounded() === 'none',
          'rounded': rounded() === 'sm',
          'rounded-md': rounded() === 'md',
          'rounded-lg': rounded() === 'lg',
          'rounded-full': rounded() === 'full',
          'bg-[var(--color-primary)] text-white hover:opacity-90 dark:hover:opacity-95': variant() === 'primary' && tone() === 'primary',
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700': variant() === 'secondary' && tone() !== 'danger' && tone() !== 'success' && tone() !== 'warning',
          'bg-[var(--color-danger)] text-white hover:opacity-90': (variant() === 'danger') || (variant() === 'primary' && tone() === 'danger'),
          'bg-[var(--color-success)] text-white hover:opacity-90': (variant() === 'success') || (variant() === 'primary' && tone() === 'success'),
          'bg-yellow-500 text-white hover:opacity-90': (variant() === 'primary' && tone() === 'warning'),
          'bg-sky-600 text-white hover:opacity-90': (variant() === 'primary' && tone() === 'info'),

          'bg-transparent border border-current text-[var(--color-primary)] hover:bg-neutral-50 dark:hover:bg-neutral-800/50': variant() === 'outline' && tone() === 'primary',
          'bg-transparent border border-current text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50': variant() === 'outline' && tone() === 'neutral',
          'bg-transparent border border-current text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20': variant() === 'outline' && tone() === 'info',
          'bg-transparent border border-current text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20': variant() === 'outline' && tone() === 'success',
          'bg-transparent border border-current text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20': variant() === 'outline' && tone() === 'warning',
          'bg-transparent border border-current text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20': variant() === 'outline' && tone() === 'danger',

          'bg-transparent text-[var(--color-primary)] hover:bg-neutral-50 dark:hover:bg-neutral-800/50': variant() === 'ghost' && tone() === 'primary',
          'bg-transparent text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50': variant() === 'ghost' && tone() === 'neutral',
          'bg-transparent text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20': variant() === 'ghost' && tone() === 'info',
          'bg-transparent text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20': variant() === 'ghost' && tone() === 'success',
          'bg-transparent text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20': variant() === 'ghost' && tone() === 'warning',
          'bg-transparent text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20': variant() === 'ghost' && tone() === 'danger',
          'bg-transparent text-[var(--color-primary)] underline underline-offset-4 hover:opacity-80': variant() === 'link',

          'shadow-sm': shadow() === 'sm',
          'shadow': shadow() === 'base',
          'shadow-md': shadow() === 'md',
          'shadow-lg': shadow() === 'lg',
          'shadow-xl': shadow() === 'xl',
          'shadow-inner': shadow() === 'inner',
          'hover:shadow-sm': hoverShadow() === 'sm',
          'hover:shadow': hoverShadow() === 'base',
          'hover:shadow-md': hoverShadow() === 'md',
          'hover:shadow-lg': hoverShadow() === 'lg',
          'hover:shadow-xl': hoverShadow() === 'xl',
          'hover:shadow-inner': hoverShadow() === 'inner',
          'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer': true
        }">
      @if (icon()) {
        <span class="material-symbols-outlined text-[1.125rem] leading-none">{{ icon() }}</span>
      }
      <ng-content />
    </button>
  `
})
export class ButtonComponent {
  // Visual variant of the button (kept for backward compatibility)
  variant = input<'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline' | 'link'>('primary');
  // Size presets, including icon button
  size = input<'xs' | 'sm' | 'md' | 'lg' | 'icon'>('md');
  // If true, treat as icon-only button regardless of size
  iconOnly = input<boolean>(false);
  // Optional Material Symbol name. When provided, an icon span will be rendered before projected content.
  icon = input<string | null>(null);
  // Tone/color shortcut independent of variant; maps to Tailwind classes
  tone = input<'primary' | 'neutral' | 'info' | 'success' | 'warning' | 'danger'>('primary');
  // Border radius control
  rounded = input<'none' | 'sm' | 'md' | 'lg' | 'full'>('md');

  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
  // Allow button to take full width when desired (useful for small screens)
  fullWidth = input<boolean>(false);
  // Shadow controls: base (default 'sm') and hover (default 'base' = 'shadow')
  shadow = input<'none' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | 'inner'>('sm');
  hoverShadow = input<'none' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | 'inner'>('base');
  // Preferred custom output
  clicked = output<Event>();
  // Backward-compatible alias to support (click) on <app-button>
  click = output<Event>();

  onClick(e: Event) {
    this.clicked.emit(e);
    this.click.emit(e);
  }
}
