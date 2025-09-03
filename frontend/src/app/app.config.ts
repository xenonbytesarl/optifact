import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { baseConfig } from './app.config.base';

export const appConfig: ApplicationConfig = mergeApplicationConfig(baseConfig, {
  providers: [
    provideClientHydration(withEventReplay())
  ]
});
