import { Routes } from '@angular/router';
import { invoiceSearchResolver } from './invoices.resolver';
import { actorSearchResolver } from '../actors/actor.resolver';

export const invoicesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./screens/invoices-list').then(m => m.InvoicesListScreen),
    resolve: { invoicesSearch: invoiceSearchResolver, actorSearch: actorSearchResolver },
    data: { title: 'Factures' }
  },
  // Future routes for view/edit can be added here
];
