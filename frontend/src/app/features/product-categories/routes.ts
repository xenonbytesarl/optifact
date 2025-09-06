import {Routes} from '@angular/router';
import {productCategoryFindByIdResolver, productCategorySearchResolver} from './product-category.resolver';

export const productCategoriesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page').then(m => m.ProductCategoriesPage),
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'list'},
      {
        path: 'list',
        loadComponent: () => import('./screens/product-categories-list').then(m => m.ProductCategoriesListPage),
        resolve: {
          productCategoriesSearch: productCategorySearchResolver
        }
      },
      {path: 'new', loadComponent: () => import('./screens/product-category-new').then(m => m.ProductCategoryNewPage)},
      {
        path: ':id',
        loadComponent: () => import('./screens/product-category-view').then(m => m.ProductCategoryViewPage),
        resolve: {
          productCategoryFindById: productCategoryFindByIdResolver
        }
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./screens/product-category-edit').then(m => m.ProductCategoryEditPage),
        resolve: {
          productCategoryFindById: productCategoryFindByIdResolver
        }
      },
    ]
  }
];
