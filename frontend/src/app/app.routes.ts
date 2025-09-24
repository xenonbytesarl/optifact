import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    canMatch: [authGuard],
    loadComponent: () => import('./features/dashboard/page').then(m => m.DashboardPage),
    data: { title: 'Dashboard' }
  },
  {
    path: 'actors',
    canMatch: [authGuard],
    loadChildren: () => import('./features/actors/routes').then(m => m.actorsRoutes),
    data: { title: 'Acteurs' }
  },
  {
    path: 'attachment-types',
    canMatch: [authGuard],
    loadChildren: () => import('./features/attachment-type/routes').then(m => m.attachmentTypesRoutes),
    data: { title: 'Types de documents' }
  },
  {
    path: 'products',
    canMatch: [authGuard],
    loadChildren: () => import('./features/products/routes').then(m => m.productsRoutes),
    data: { title: 'Produits' }
  },
  {
    path: 'product-categories',
    canMatch: [authGuard],
    loadChildren: () => import('./features/product-categories/routes').then(m => m.productCategoriesRoutes),
    data: { title: 'Catégories de produit' }
  },
  {
    path: 'quotes',
    canMatch: [authGuard],
    loadComponent: () => import('./features/quotes/page').then(m => m.QuotesPage),
    data: { title: 'Devis' }
  },
  {
    path: 'invoices',
    canMatch: [authGuard],
    loadChildren: () => import('./features/invoices/routes').then(m => m.invoicesRoutes),
    data: { title: 'Factures' }
  },
  {
    path: 'payments',
    canMatch: [authGuard],
    loadComponent: () => import('./features/payments/page').then(m => m.PaymentsPage),
    data: { title: 'Paiements' }
  },
  {
    path: 'settings',
    canMatch: [authGuard],
    loadChildren: () => import('./features/settings/routes').then(m => m.settingsRoutes),
    data: { title: 'Paramètres' }
  },
  {
    path: 'sequences',
    canMatch: [authGuard],
    loadChildren: () => import('./features/sequences/routes').then(m => m.sequencesRoutes),
    data: { title: 'Séquences' }
  },
  {
    path: 'users',
    loadChildren: () => import('./features/users/routes').then(m => m.usersRoutes),
    data: { title: 'Utilisateurs' }
  },
  {
    path: 'claims',
    canMatch: [authGuard],
    loadChildren: () => import('./features/claims/routes').then(m => m.claimsRoutes),
    data: { title: 'Demandes' }
  },
];
