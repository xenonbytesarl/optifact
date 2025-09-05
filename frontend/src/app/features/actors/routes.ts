import { Routes } from '@angular/router';

export const actorsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page').then(m => m.ActorsPage),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'new' },
      { path: 'new', loadComponent: () => import('./screens/actor-new').then(m => m.ActorNewPage) },
      { path: ':id', loadComponent: () => import('./screens/actor-view').then(m => m.ActorViewPage) },
      { path: ':id/edit', loadComponent: () => import('./screens/actor-edit').then(m => m.ActorEditPage) },
    ]
  }
];
