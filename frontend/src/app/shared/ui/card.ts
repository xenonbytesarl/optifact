import { ChangeDetectionStrategy, Component, contentChild, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-surface border border-token rounded-xl shadow-sm dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)] shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
      @if (title()) {
        <div class="px-4 py-3 border-b border-token flex items-center justify-between">
          <h3 class="text-base font-semibold">{{ title() }}</h3>
          <ng-content select="[card-actions]" />
        </div>
      }
      <div class="p-4">
        <ng-content />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CardComponent {
  title = input<string | null>(null);
}
