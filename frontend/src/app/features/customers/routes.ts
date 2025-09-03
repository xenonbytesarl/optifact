import { Routes } from '@angular/router';

export const customersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page').then(m => m.CustomersPage),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'new' },
      { path: 'new', loadComponent: () => import('./screens/customer-new').then(m => m.CustomerNewPage) },
      { path: ':id', loadComponent: () => import('./screens/customer-view').then(m => m.CustomerViewPage) },
      { path: ':id/edit', loadComponent: () => import('./screens/customer-edit').then(m => m.CustomerEditPage) },
    ]
  }
];
