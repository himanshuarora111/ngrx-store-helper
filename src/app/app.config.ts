import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { storeConfig } from './store/store.config';
import { sampleReducer } from './components/sample-component/sample.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({
      ...storeConfig.reducers,
      sampleReducer: sampleReducer
    })
  ]
};
