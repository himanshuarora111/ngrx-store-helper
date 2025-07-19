import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { getInitialDynamicReducers } from 'ngrx-store-wrapper';
import { sampleReducer } from './components/sample-component/sample.reducer';
import { provideHttpClient } from '@angular/common/http';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(
      {
        ...getInitialDynamicReducers(),
        sample: sampleReducer
      },
    ),
    provideHttpClient(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      name: 'ngrx-store-helper',
      trace: true,
      traceLimit: 25
    })
  ]
};