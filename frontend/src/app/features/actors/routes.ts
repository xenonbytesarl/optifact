import { Routes } from '@angular/router';
import {actorFindByIdResolver, actorSearchResolver} from './actor.resolver';

export const actorsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page').then(m => m.ActorsPage),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'list' },
      {
        path: 'list', loadComponent: () => import('./screens/actors-list').then(m => m.ActorsListPage),
        resolve: {
          actorsSearch: actorSearchResolver
        }
      },
      { path: 'new', loadComponent: () => import('./screens/actor-new').then(m => m.ActorNewPage) },
      {
        path: ':id', loadComponent: () => import('./screens/actor-view').then(m => m.ActorViewPage),
        resolve: {
          actorFindById: actorFindByIdResolver,
        }
      },
      {
        path: ':id/edit', loadComponent: () => import('./screens/actor-edit').then(m => m.ActorEditPage),
        resolve: {
          actorFindById: actorFindByIdResolver,
        }
      },
    ]
  }
];
