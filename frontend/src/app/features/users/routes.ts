import { Routes } from '@angular/router';
import { roleFindAllResolver, userFindByIdResolver, searchUserResolver } from './user.resolver';
import { actorSearchResolver } from '../actors/actor.resolver';
import { authGuard } from '../../core/guards/auth.guard';

export const usersRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'list' },

  // Auth routes (public)
  {
    path: 'login',
    loadComponent: () => import('./components/login-form').then(m => m.LoginFormComponent),
    data: { title: 'Connexion' }
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register-form').then(m => m.RegisterFormComponent),
    data: { title: 'Créer un compte' }
  },
  {
    path: 'password/create/:userId/:verificationCode',
    loadComponent: () => import('./components/create-password-form').then(m => m.CreatePasswordFormComponent),
    data: { title: 'Création du mot de passe' }
  },
  {
    path: 'verify-mfa',
    loadComponent: () => import('./components/verify-mfa-code-form').then(m => m.VerifyMfaCodeFormComponent),
    data: { title: 'Vérifier le code MFA' }
  },
  {
    path: 'activate/:userId/:verificationCode',
    loadComponent: () => import('./components/activate-account-form').then(m => m.ActivateAccountFormComponent),
    data: { title: 'Activation du compte' }
  },

  // Users management (protected)
  {
    path: 'list',
    canMatch: [authGuard],
    loadComponent: () => import('./screens/users-list').then(m => m.UsersListPage),
    resolve: {
      usersSearch: searchUserResolver
    }
  },
  {
    path: 'new',
    canMatch: [authGuard],
    loadComponent: () => import('./screens/user-new').then(m => m.UserNewScreen),
    resolve: {
      actorSearch: actorSearchResolver,
      roleFindAll: roleFindAllResolver,
    }
  },
  {
    path: ':id',
    canMatch: [authGuard],
    loadComponent: () => import('./screens/user-view').then(m => m.UserViewScreen),
    resolve: {
      userFindById: userFindByIdResolver,
      actorSearch: actorSearchResolver,
      roleFindAll: roleFindAllResolver,
    }
  },
  {
    path: ':id/edit',
    canMatch: [authGuard],
    loadComponent: () => import('./screens/user-edit').then(m => m.UserEditScreen),
    resolve: {
      userFindById: userFindByIdResolver,
      actorSearch: actorSearchResolver,
      roleFindAll: roleFindAllResolver,
    }
  }
];
