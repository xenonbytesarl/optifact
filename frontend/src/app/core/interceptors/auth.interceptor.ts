import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { userStore } from '../../features/users/user.store';

/**
 * AuthInterceptor
 * - Adds Authorization: Bearer <token> to every request whose URL does NOT contain 'auth'
 * - On 401 responses, redirects to login page and preserves the attempted URL for post-login redirect
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const store = inject(userStore);
  const router = inject(Router);

  const url = (req.url || '').toLowerCase();
  const isAuthEndpoint = url.includes('/auth');

  let authReq = req;
  if (!isAuthEndpoint) {
    const token = (store.auth() as any)?.accessToken as string | undefined;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

  return next(authReq).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401 && !isAuthEndpoint) {
          // Clear any stored auth state
          try { store.logout(); } catch {}

          // Compute current URL as redirect target
          const currentUrl = router.url || '/';
          // Navigate to login with redirectTo param
          router.navigate(['/users/login'], {
            queryParams: currentUrl && currentUrl !== '/' ? { redirectTo: currentUrl } : undefined,
          });
        }
      }
      return throwError(() => err);
    })
  );
};
