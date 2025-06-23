import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { getInitialDynamicReducers } from 'ngrx-store-wrapper';
import { sampleReducer } from './components/sample-component/sample.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({
      ...getInitialDynamicReducers(), 
      sampleReducer: sampleReducer
    })
  ]
};
