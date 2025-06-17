import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { updateTestObject, resetTestObject } from './sample.actions';
import { selectTestObject } from './sample.selectors';

@Component({
  selector: 'app-sample-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sample-component.component.html',
  styleUrls: ['./sample-component.component.scss']
})
export class SampleComponentComponent {
  testObject$!: Observable<any>;

  constructor(private store: Store) {
    this.testObject$ = this.store.select(selectTestObject);
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