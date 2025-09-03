import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icon.html',
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    'class': 'inline-flex items-center justify-center select-none',
    'aria-hidden': 'true'
  }
})
export class IconComponent {
  name = input<string>('');
}
