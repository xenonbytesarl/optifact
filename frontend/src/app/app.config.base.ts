import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { APP_INITIALIZER } from '@angular/core';
import { TranslateService } from './core/i18n/translate.service';

export const baseConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (i18n: TranslateService) => () => (typeof window === 'undefined' ? Promise.resolve() : i18n.load(i18n.lang())),
      deps: [TranslateService]
    }
  ]
};
