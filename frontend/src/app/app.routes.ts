import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/page').then(m => m.DashboardPage),
    data: { title: 'Dashboard' }
  },
  {
    path: 'actors',
    loadChildren: () => import('./features/actors/routes').then(m => m.actorsRoutes),
    data: { title: 'Acteurs' }
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/page').then(m => m.ProductsPage),
    data: { title: 'Produits' }
  },
  {
    path: 'product-categories',
    loadComponent: () => import('./features/product-categories/page').then(m => m.ProductCategoriesPage),
    data: { title: 'Catégories de produit' }
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
