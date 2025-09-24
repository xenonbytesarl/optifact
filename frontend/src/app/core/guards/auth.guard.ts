import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlSegment } from '@angular/router';
import { userStore } from '../../features/users/user.store';

/**
 * Auth guard: protect routes when the user is not authenticated.
 *
 * Allowed anonymously: specific auth screens (login/register/create-password/verify-mfa)
 * We will not attach this guard to those routes. Everywhere else, the guard applies.
 */
export const authGuard: CanMatchFn = (route, segments: UrlSegment[]) => {
  const store = inject(userStore);
  const router = inject(Router);

  const isLoggedIn = !!store.loggedIn();
  if (isLoggedIn) {
    return true;
  }

  const attempted = '/' + segments.map(s => s.path).join('/');
  return router.createUrlTree(['/users/login'], {
    queryParams: attempted && attempted !== '/' ? { redirectTo: attempted } : undefined,
  });
};
