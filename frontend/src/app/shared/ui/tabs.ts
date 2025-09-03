import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabItem {
  id: string;
  label: string;
  badge?: number;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <div class="flex items-center gap-2 border-b border-token">
        @for (t of items(); track t.id) {
          <button
            class="relative -mb-px px-3 py-2 text-sm font-medium rounded-t-md transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
            [class.text-[rgb(var(--color-fg))]]="active() === t.id"
            [class.text-muted]="active() !== t.id"
            [class.border-b-2]="active() === t.id"
            [class.border-[var(--color-primary)]]="active() === t.id"
            (click)="active.set(t.id)"
            [attr.aria-selected]="active() === t.id"
            role="tab"
          >
            <span>{{ t.label }}</span>
            @if (t.badge != null) {
              <span class="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[10px] bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100">{{ t.badge }}</span>
            }
          </button>
        }
      </div>
      <div class="pt-3">
        <ng-content />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class TabsComponent {
  items = input.required<TabItem[]>();
  active = model<string>('');
}
