import { Routes } from '@angular/router';
import { roleFindAllResolver, userFindByIdResolver, searchUserResolver } from './user.resolver';
import { actorSearchResolver } from '../actors/actor.resolver';

export const usersRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'list' },
  {
    path: 'list',
    loadComponent: () => import('./screens/users-list').then(m => m.UsersListPage),
    resolve: {
      usersSearch: searchUserResolver
    }
  },
  {
    path: 'new',
    loadComponent: () => import('./screens/user-new').then(m => m.UserNewScreen),
    resolve: {
      actorSearch: actorSearchResolver,
      roleFindAll: roleFindAllResolver,
    }
  },
  {
    path: ':id',
    loadComponent: () => import('./screens/user-view').then(m => m.UserViewScreen),
    resolve: {
      userFindById: userFindByIdResolver,
      actorSearch: actorSearchResolver,
      roleFindAll: roleFindAllResolver,
    }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./screens/user-edit').then(m => m.UserEditScreen),
    resolve: {
      userFindById: userFindByIdResolver,
      actorSearch: actorSearchResolver,
      roleFindAll: roleFindAllResolver,
    }
  }
];
