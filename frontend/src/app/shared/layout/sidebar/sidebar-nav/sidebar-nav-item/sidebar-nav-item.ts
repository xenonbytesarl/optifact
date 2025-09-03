import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../../../../ui/icon';
import { TranslatePipe } from '../../../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-sidebar-nav-item',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent, TranslatePipe],
  templateUrl: './sidebar-nav-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarNavItemComponent {
  link = input.required<string>();
  icon = input.required<string>();
  label = input.required<string>();
}
