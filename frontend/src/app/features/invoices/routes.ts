import { Routes } from '@angular/router';
import { invoiceFindByIdResolver, invoiceSearchResolver } from './invoices.resolver';
import { actorSearchResolver } from '../actors/actor.resolver';
import { productSearchResolver } from '../products/product.resolver';

export const invoicesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./screens/invoices-list').then(m => m.InvoicesListScreen),
    resolve: { invoicesSearch: invoiceSearchResolver },
    data: { title: 'Factures' }
  },
  {
    path: 'new',
    loadComponent: () => import('./screens/invoice-new').then(m => m.InvoiceNewPage),
    resolve: { actorSearch: actorSearchResolver, productSearch: productSearchResolver }
  },
  {
    path: ':id',
    loadComponent: () => import('./screens/invoice-view').then(m => m.InvoiceViewPage),
    resolve: {
      invoiceFindById: invoiceFindByIdResolver,
      actorSearch: actorSearchResolver,
      productSearch: productSearchResolver
    }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./screens/invoice-edit').then(m => m.InvoiceEditPage),
    resolve: {
      invoiceFindById: invoiceFindByIdResolver,
      actorSearch: actorSearchResolver,
      productSearch: productSearchResolver
    }
  },
];
