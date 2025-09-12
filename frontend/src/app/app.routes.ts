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
    path: 'attachment-types',
    loadChildren: () => import('./features/attachment-type/routes').then(m => m.attachmentTypesRoutes),
    data: { title: 'Types de documents' }
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/routes').then(m => m.productsRoutes),
    data: { title: 'Produits' }
  },
  {
    path: 'product-categories',
    loadChildren: () => import('./features/product-categories/routes').then(m => m.productCategoriesRoutes),
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
