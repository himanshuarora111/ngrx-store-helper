import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SampleComponentComponent } from './components/sample-component/sample-component.component';
import { DynamicComponentComponent } from './components/dynamic-component/dynamic-component.component';
import { Store } from '@ngrx/store';
import { ReducerManager } from '@ngrx/store';
import { upgradedStore } from './store/dynamic-store.helper';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SampleComponentComponent, DynamicComponentComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngrx-store-helper';

  constructor(
    private store: Store<any>,
    private reducerManager: ReducerManager
  ) {
    // Initialize the store helper with reducer manager
    upgradedStore.initializeStore(this.store, this.reducerManager);
    
    // Initialize testData with an empty object
    upgradedStore.set('testData', {});
  }
}
