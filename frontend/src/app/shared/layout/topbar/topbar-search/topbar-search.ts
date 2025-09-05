import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../ui/icon';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-topbar-search',
  standalone: true,
  imports: [CommonModule, IconComponent, TranslatePipe],
  styles: [
    `
    /* Hide native search clear and decorations so only our Material icon shows */
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration { display: none; }
    `
  ],
  template: `
    <form role="search" class="hidden md:flex items-center w-full max-w-none">
      <label for="top-search" class="sr-only">{{ 'search.label' | t }}</label>
      <div class="relative mx-auto transition-[transform,width] duration-200 ease-out will-change-transform"
           [class.scale-[1.01]]="focused">
        <span class="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center text-neutral-400">
          <app-icon name="search"></app-icon>
        </span>
        <input id="top-search" name="q" type="search" [placeholder]="('search.placeholder' | t)"
               #q
               (focus)="focused=true"
               (blur)="focused=false"
               (input)="value = q.value"
               class="pl-10 pr-10 py-2  border border-token bg-surface text-fg placeholder-muted text-sm shadow-sm focus:outline-none transition-[width] duration-200 ease-out"
               [class.w-[22rem]]="!focused"
               [class.md:w-[28rem]]="!focused"
               [class.lg:w-[36rem]]="!focused"
               [class.w-[28rem]]="focused"
               [class.md:w-[36rem]]="focused"
               [class.lg:w-[44rem]]="focused"
               />
        @if (value != null && value.length) {
          <button type="button"
                  (mousedown)="$event.preventDefault(); q.value=''; value=''; q.focus()"
                  (click)="$event.preventDefault()"
                  class="absolute inset-y-0 right-1 my-1 inline-flex items-center justify-center  h-8 w-8 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 focus:outline-none"
                  [attr.aria-label]="'search.clear' | t">
            <app-icon name="close"></app-icon>
          </button>
        }
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarSearchComponent {
  value = '';
  focused = false;
}
