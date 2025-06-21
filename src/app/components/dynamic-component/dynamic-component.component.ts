import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ReducerManager } from '@ngrx/store';
import { Observable } from 'rxjs';
import { upgradedStore } from '../../store/dynamic-store.helper';

@Component({
  selector: 'app-dynamic-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-component.component.html',
  styleUrls: ['./dynamic-component.component.scss']
})
export class DynamicComponentComponent implements OnInit {
  testData$!: Observable<any>;
  availableKeys: string[] = [];
  newKey = '';
  newValue = '';
  selectedKey = '';
  selectedValue: any;

  constructor(
    private store: Store,
    private reducerManager: ReducerManager
  ) {
    // Initialize the store helper with reducer manager
    upgradedStore.initializeStore(this.store, this.reducerManager);
    
    // Subscribe to the entire store state to track available keys
    this.store.select(state => state).subscribe(state => {
      this.availableKeys = Object.keys(state);
    });

    // Subscribe to selected key value changes
    this.selectedKey = 'testData';
    this.updateSelectedValue();
  }

  ngOnInit() {
    // Initialize testData with an empty object
    upgradedStore.set('testData', {});
  }

  updateSelectedValue() {
    if (this.selectedKey) {
      this.selectedValue = this.store.select(upgradedStore.get(this.selectedKey));
    }
  }

  addKey() {
    if (this.newKey && this.newKey.trim()) {
      upgradedStore.set(this.newKey.trim(), this.newValue ? { value: this.newValue } : {});
      this.newKey = '';
      this.newValue = '';
    }
  }

  updateValue() {
    if (this.selectedKey) {
      upgradedStore.set(this.selectedKey, this.newValue ? { value: this.newValue } : {});
      this.newValue = '';
    }
  }

  resetValue() {
    if (this.selectedKey) {
      upgradedStore.set(this.selectedKey, {});
    }
  }

  viewStoreState() {
    console.log('[DynamicComponent] Current store state:', upgradedStore);
  }
}
