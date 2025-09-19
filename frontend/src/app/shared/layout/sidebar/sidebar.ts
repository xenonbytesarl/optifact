import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarHeaderComponent } from './sidebar-header/sidebar-header';
import { SidebarNavComponent, SidebarNavItem } from './sidebar-nav/sidebar-nav';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarHeaderComponent, SidebarNavComponent],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class SidebarComponent {
  isOpen = input(false);
  close = output<void>();

  readonly navItems = signal<SidebarNavItem[]>([
    { link: '/dashboard', icon: 'dashboard', label: 'nav.dashboard' },
    { link: '/claims', icon: 'assignment', label: 'claims.title' },
    { link: '/invoices', icon: 'receipt_long', label: 'nav.invoices' },
    { link: '/payments', icon: 'credit_card', label: 'nav.payments' },
    { link: '/actors', icon: 'group', label: 'nav.actors' },
    { link: '/products', icon: 'inventory', label: 'products.title' },
    { icon: 'settings', label: 'nav.settings', children: [
      { link: '/settings', icon: 'settings', label: 'settings.title' },
      { link: '/product-categories', icon: 'category', label: 'productCategories.title' },
      { link: '/attachment-types', icon: 'description', label: 'attachmentTypes.title' },
      { link: '/sequences', icon: '123', label: 'sequences.title' }
    ] }
  ]);
}
