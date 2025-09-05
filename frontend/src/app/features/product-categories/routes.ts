import { Routes } from '@angular/router';

export const productCategoriesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page').then(m => m.ProductCategoriesPage),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'list' },
      { path: 'list', loadComponent: () => import('./screens/categories-list').then(m => m.CategoriesListPage) },
      { path: 'new', loadComponent: () => import('./screens/category-new').then(m => m.CategoryNewPage) },
      { path: ':id/edit', loadComponent: () => import('./screens/category-edit').then(m => m.CategoryEditPage) },
    ]
  }
];
