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
    { link: '/actors', icon: 'group', label: 'nav.actors' },
    { icon: 'inventory_2', label: 'nav.products', children: [
      { link: '/product-categories', icon: 'category', label: 'productCategories.title' },
      { link: '/products', icon: 'inventory', label: 'products.title' }
    ] },
    { link: '/invoices', icon: 'receipt_long', label: 'nav.invoices' },
    { link: '/payments', icon: 'credit_card', label: 'nav.payments' },
    { link: '/settings', icon: 'settings', label: 'nav.settings' }
  ]);
}
