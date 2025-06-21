import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ReducerManager } from '@ngrx/store';
import { Observable } from 'rxjs';
import { upgradedStore } from '../../store/dynamic-store.helper';

@Component({
  selector: 'app-dynamic-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-component.component.html',
  styleUrls: ['./dynamic-component.component.scss']
})
export class DynamicComponentComponent {
  testData$!: Observable<any>;

  constructor(
    private store: Store,
    private reducerManager: ReducerManager
  ) {
    console.log('[DynamicComponent] Initializing component');
    // Initialize the store helper with reducer manager
    upgradedStore.initializeStore(this.store, this.reducerManager);
    
    // Initialize testData with an empty object
    upgradedStore.set('testData', {});
    
    // Get selector for testData
    this.testData$ = this.store.select(upgradedStore.get('testData'));
    
    // Subscribe to observe changes
    this.testData$.subscribe(data => {
      console.log('[DynamicComponent] testData changed:', data);
    });

    // Subscribe to the entire store state
    this.store.select(state => state).subscribe(state => {
      console.log('[DynamicComponent] Full store state:', state);
    });
  }

  // Method to view the current store state
  viewStoreState() {
    this.store.select(state => state).subscribe(state => {
      console.log('[DynamicComponent] Full store state:', state);
    });
  }

  updateTestData() {
    console.log('[DynamicComponent] Updating test data with default value');
    upgradedStore.set('testData', { test: 'Updated Value' });
  }

  onUpdate(newValue: string) {
    if (newValue) {
      console.log('[DynamicComponent] Updating test data with:', newValue);
      upgradedStore.set('testData', { test: newValue });
    }
  }

  resetTestData() {
    console.log('[DynamicComponent] Resetting test data');
    upgradedStore.set('testData', { test: '' });
  }
}
