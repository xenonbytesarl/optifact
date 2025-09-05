import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../../../../ui/icon';
import { TranslatePipe } from '../../../../../core/i18n/translate.pipe';
import { SidebarNavItem } from '../sidebar-nav';

@Component({
  selector: 'app-sidebar-nav-item',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent, TranslatePipe],
  templateUrl: './sidebar-nav-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarNavItemComponent {
  item = input.required<SidebarNavItem>();
  open = signal(false);

  toggle() { this.open.update(v => !v); }
}
