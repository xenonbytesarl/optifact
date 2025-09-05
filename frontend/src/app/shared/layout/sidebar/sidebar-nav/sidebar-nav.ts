import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarNavItemComponent } from './sidebar-nav-item/sidebar-nav-item';

export interface SidebarNavItem {
  link?: string;
  icon: string;
  label: string;
  children?: SidebarNavItem[];
}

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [CommonModule, SidebarNavItemComponent],
  templateUrl: './sidebar-nav.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarNavComponent {
  items = input.required<SidebarNavItem[]>();
}
