import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    'class': 'inline-flex items-center  px-2 py-0.5 text-xs font-medium'
  },
  template: `
    <span [ngClass]="{
        'bg-[color-mix(in_oklab,var(--color-accent)_20%,white)] text-[color-mix(in_oklab,var(--color-accent)_80%,black)] dark:bg-[color-mix(in_oklab,var(--color-accent)_30%,black)] dark:text-[color-mix(in_oklab,var(--color-accent)_90%,white)]': tone() === 'info',
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100': tone() === 'success',
        'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100': tone() === 'warn',
        'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100': tone() === 'neutral'
      }" class="px-2 py-0.5  inline-flex items-center">
      <ng-content/>
    </span>
  `
})
export class BadgeComponent {
  tone = input<'info' | 'success' | 'warn' | 'neutral'>('info');
}
