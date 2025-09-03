import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    'class': 'inline-flex items-center justify-center font-medium rounded-md transition focus:outline-none focus:ring-2 ring-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.role]': "'button'"
  }
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'ghost' | 'danger' | 'success'>('primary');
  size = input<'sm' | 'md' | 'lg' | 'icon'>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
  clicked = output<Event>();
}
