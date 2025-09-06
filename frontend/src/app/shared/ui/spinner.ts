import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable spinner component (standalone) using Tailwind utilities.
 * - size: one of 'sm' | 'md' | 'lg' (default: 'md')
 * - label: optional accessible text displayed for screen readers
 * - overlay: if true, expands to a centered overlay container
 */
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClass()" role="status" aria-live="polite" aria-busy="true">
      <span class="sr-only">{{ label() }}</span>
      <span [class]="spinnerClass()" ></span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {
  size = input<'sm' | 'md' | 'lg'>('md');
  label = input<string>('Chargement…');
  overlay = input<boolean>(false);

  containerClass = computed(() => {
    const base = this.overlay()
      ? 'fixed inset-0 z-50 grid place-items-center bg-black/5 dark:bg-black/30'
      : 'inline-flex items-center justify-center';
    return base;
  });

  spinnerClass = computed(() => {
    const s = this.size();
    const dim = s === 'sm' ? 'h-5 w-5' : s === 'lg' ? 'h-12 w-12' : 'h-8 w-8';
    // Using a CSS-only spinner with borders; inherits currentColor
    return [
      'animate-spin rounded-full border-2 border-current border-r-transparent text-gray-700 dark:text-gray-200',
      dim
    ].join(' ');
  });
}
