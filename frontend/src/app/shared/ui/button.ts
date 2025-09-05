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
          'px-3 py-2 text-sm': size() === 'sm',
          'px-4 py-2.5 text-sm': size() === 'md',
          'px-5 py-3 text-base': size() === 'lg',
          'p-3': size() === 'icon',
          'bg-[var(--color-primary)] text-white hover:opacity-90 dark:hover:opacity-95 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900': variant() === 'primary',
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900': variant() === 'secondary',
          'bg-transparent text-[var(--color-primary)] hover-surface-weak dark:text-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900': variant() === 'ghost',
          'bg-[var(--color-danger)] text-white hover:opacity-90 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900': variant() === 'danger',
          'bg-[var(--color-success)] text-white hover:opacity-90 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900': variant() === 'success',
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
      <ng-content />
    </button>
  `
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'ghost' | 'danger' | 'success'>('primary');
  size = input<'sm' | 'md' | 'lg' | 'icon'>('md');
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
