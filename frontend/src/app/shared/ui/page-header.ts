import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    class: 'block'
  },
  template: `
    <div class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-fg">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="text-sm text-muted">{{ subtitle() }}</p>
        }
      </div>
      <div class="mt-2 md:mt-0 inline-flex items-center gap-2" [attr.aria-label]="'Actions for ' + title()">
        <ng-content select="[actions]" />
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  title = input.required<string>();
  subtitle = input<string | null>(null);
}
