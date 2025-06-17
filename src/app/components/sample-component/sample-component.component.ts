import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { updateTestObject, resetTestObject } from './sample.actions';
import { initialSampleState } from './sample.reducer';

@Component({
  selector: 'app-sample-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sample-component.component.html',
  styleUrls: ['./sample-component.component.scss']
})
export class SampleComponentComponent {

  testObject$!: Observable<any>;

  constructor(private store: Store<{ sampleReducer: any }>) {
    // Set up the observable
    this.testObject$ = this.store.select(state => {
      return state.sampleReducer;
    });
    
    // Log the initial state
    this.testObject$.subscribe(state => {
    });
    
    // Initialize the store with initial state
    this.store.dispatch(updateTestObject({ testObject: initialSampleState.testObject }));
  }

  updateTestObject() {
    this.store.dispatch(updateTestObject({ testObject: { test: 'Updated Value' } }));
  }

  onUpdate(newValue: string) {
    if (newValue) {
      this.store.dispatch(updateTestObject({ testObject: { test: newValue } }));
    }
  }

  resetTestObject() {
    this.store.dispatch(resetTestObject());
  }
}
