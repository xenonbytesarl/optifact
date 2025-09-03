import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/page').then(m => m.DashboardPage),
    data: { title: 'Dashboard' }
  },
  {
    path: 'customers',
    loadChildren: () => import('./features/customers/routes').then(m => m.customersRoutes),
    data: { title: 'Clients' }
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/page').then(m => m.ProductsPage),
    data: { title: 'Produits' }
  },
  {
    path: 'quotes',
    loadComponent: () => import('./features/quotes/page').then(m => m.QuotesPage),
    data: { title: 'Devis' }
  },
  {
    path: 'invoices',
    loadComponent: () => import('./features/invoices/page').then(m => m.InvoicesPage),
    data: { title: 'Factures' }
  },
  {
    path: 'payments',
    loadComponent: () => import('./features/payments/page').then(m => m.PaymentsPage),
    data: { title: 'Paiements' }
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/page').then(m => m.SettingsPage),
    data: { title: 'Paramètres' }
  },
];
