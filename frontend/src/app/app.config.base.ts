import {
  ApplicationConfig, inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { TranslateService } from './core/i18n/translate.service';
import { userStore } from './features/users/user.store';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const baseConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    // Initialize i18n service at app start
    provideAppInitializer(() => { inject(TranslateService); }),
    // Hydrate auth state from storage at app start using the new provideAppInitializer API
    provideAppInitializer(() => {
      const store = inject(userStore);
      try {
        if (typeof window !== 'undefined') {
          store.hydrateFromStorage?.();
        }
      } catch {}
    }),
  ]
};
