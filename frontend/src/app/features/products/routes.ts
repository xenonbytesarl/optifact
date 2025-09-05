import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page').then(m => m.ProductsPage),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'list' },
      { path: 'list', loadComponent: () => import('./screens/products-list').then(m => m.ProductsListPage) },
      { path: 'new', loadComponent: () => import('./screens/product-new').then(m => m.ProductNewPage) },
      { path: ':id/edit', loadComponent: () => import('./screens/product-edit').then(m => m.ProductEditPage) },
    ]
  }
];
