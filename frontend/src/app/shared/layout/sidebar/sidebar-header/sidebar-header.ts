import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { IconComponent } from '../../../ui/icon';
import { ButtonComponent } from '../../../ui/button';

@Component({
  selector: 'app-sidebar-header',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, IconComponent, ButtonComponent],
  templateUrl: './sidebar-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarHeaderComponent {
  close = output<void>();
}
