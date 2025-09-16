import { Routes } from '@angular/router';
import { invoiceSearchResolver, invoiceFindByIdResolver } from './invoices.resolver';

export const invoicesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page').then(m => m.InvoicesPage),
    resolve: { invoicesSearch: invoiceSearchResolver },
    data: { title: 'Factures' }
  },
  // Future routes for view/edit can be added here, e.g.:
  // { path: ':id', loadComponent: () => import('./screens/invoice-view').then(m => m.InvoiceViewPage), resolve: { invoiceFindById: invoiceFindByIdResolver } },
];
