import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { DynamicStoreHelper } from './store/dynamic-store.helper';
import { sampleReducer } from './components/sample-component/sample.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({
      ...DynamicStoreHelper.getInstance().getReducers(), 
      sampleReducer: sampleReducer
    })
  ]
};
