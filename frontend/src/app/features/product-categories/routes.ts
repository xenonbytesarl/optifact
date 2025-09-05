import { Routes } from '@angular/router';

export const productCategoriesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page').then(m => m.ProductCategoriesPage),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'list' },
      { path: 'list', loadComponent: () => import('./screens/product-categories-list').then(m => m.ProductCategoriesListPage) },
      { path: 'new', loadComponent: () => import('./screens/product-category-new').then(m => m.ProductCategoryNewPage) },
      { path: ':id/edit', loadComponent: () => import('./screens/product-category-edit').then(m => m.ProductCategoryEditPage) },
    ]
  }
];
