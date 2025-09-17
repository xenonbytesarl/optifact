import {Routes} from '@angular/router';
import {productFindByIdResolver, productSearchResolver} from './product.resolver';
import {productCategorySearchResolver} from '../product-categories/product-category.resolver';
import {attachmentTypeSearchResolver} from '../attachment-type/attachment-type.resolver';
import {sequenceSearchResolver} from '../sequences/sequence.resolver';

export const productsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page').then(m => m.ProductsPage),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
      },
      {
        path: 'list', loadComponent: () => import('./screens/products-list').then(m => m.ProductsListPage),
        resolve: {
          productsSearch: productSearchResolver
        }
      },
      {
        path: 'new', loadComponent: () => import('./screens/product-new').then(m => m.ProductNewPage),
        resolve: {
          productCategorySearch: productCategorySearchResolver,
          attachmentTypeSearch: attachmentTypeSearchResolver,
          sequenceSearch: sequenceSearchResolver,
          productsSearch: productSearchResolver
        }
      },
      {
        path: ':id', loadComponent: () => import('./screens/product-view').then(m => m.ProductViewPage),
        resolve: {
          productFindById: productFindByIdResolver,
          productCategorySearch: productCategorySearchResolver,
          attachmentTypeSearch: attachmentTypeSearchResolver,
          sequenceSearch: sequenceSearchResolver,
          productsSearch: productSearchResolver
        }
      },
      {
        path: ':id/edit', loadComponent: () => import('./screens/product-edit').then(m => m.ProductEditPage),
        resolve: {
          productFindById: productFindByIdResolver,
          productCategorySearch: productCategorySearchResolver,
          attachmentTypeSearch: attachmentTypeSearchResolver,
          sequenceSearch: sequenceSearchResolver,
          productsSearch: productSearchResolver
        }
      },
    ]
  }
];
