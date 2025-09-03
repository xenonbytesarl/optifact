import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-topbar-brand',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  template: `
    <a [routerLink]="link()" class="h-full flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 rounded-md">
      <img ngSrc="{{logoSrc()}}" width="80" height="80" [attr.alt]="appName() + ' Logo'" class="block self-center object-contain h-10 w-10 md:h-16 md:w-16 select-none pointer-events-none" />
      <span class="hidden sm:inline text-sm font-semibold uppercase leading-none">{{ appName() }}</span>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarBrandComponent {
  link = input<string>('/dashboard');
  logoSrc = input.required<string>();
  appName = input.required<string>();
}
