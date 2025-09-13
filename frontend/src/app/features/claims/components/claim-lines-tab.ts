import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimLine } from '../../../core/api/claim.api';
import { BadgeComponent, BadgeTone } from '../../../shared/ui/badge';

@Component({
  selector: 'app-claim-lines-tab',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      @if (!lines().length) {
        <div class="text-sm text-muted">Aucune ligne</div>
      } @else {
        @for (line of lines(); track line.id) {
          <div class="rounded border border-neutral-200 dark:border-neutral-800 p-3">
            <div class="flex items-center justify-between mb-2">
              <div class="text-sm font-medium">#{{ line.id ?? '—' }}</div>
              <app-badge [tone]="tone(line.status)">{{ line.status }}</app-badge>
            </div>
            <div class="text-xs text-muted">{{ line.reason || '' }}</div>
            <div class="mt-2 grid grid-cols-2 gap-2 text-xs text-muted">
              <div>Created: {{ line.createdAt || '—' }}</div>
              <div>Validated: {{ line.validateAt || '—' }}</div>
              <div>Rejected: {{ line.rejectedAt || '—' }}</div>
              <div>Cancelled: {{ line.cancelledAt || '—' }}</div>
            </div>
          </div>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ClaimLinesTabComponent {
  lines = input<ClaimLine[]>([]);

  tone(status?: string | null): BadgeTone {
    switch (status) {
      case 'DRAFT': return 'neutral';
      case 'VALIDATED': return 'success';
      case 'REJECTED': return 'danger';
      case 'CANCELLED': return 'neutral';
      default: return 'neutral';
    }
  }
}
