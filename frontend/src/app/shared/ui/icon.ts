import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    'class': 'inline-flex items-center justify-center select-none',
    'aria-hidden': 'true'
  },
  template: `
    <span class="material-symbols-outlined leading-none" [attr.aria-label]="name()">{{ name() }}</span>
  `
})
export class IconComponent {
  name = input<string>('');
}
