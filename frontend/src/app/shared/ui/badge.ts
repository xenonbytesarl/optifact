import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.html',
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    'class': 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium'
  }
})
export class BadgeComponent {
  tone = input<'info' | 'success' | 'warn' | 'neutral'>('info');
}
