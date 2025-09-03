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
    { link: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { link: '/customers', icon: 'group', label: 'Clients' },
    { link: '/products', icon: 'inventory_2', label: 'Produits' },
    { link: '/quotes', icon: 'description', label: 'Devis' },
    { link: '/invoices', icon: 'receipt_long', label: 'Factures' },
    { link: '/payments', icon: 'credit_card', label: 'Paiements' },
    { link: '/settings', icon: 'settings', label: 'Paramètres' }
  ]);
}
