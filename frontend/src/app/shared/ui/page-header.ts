import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-header.html',
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    class: 'block'
  }
})
export class PageHeaderComponent {
  title = input.required<string>();
  subtitle = input<string | null>(null);
}
