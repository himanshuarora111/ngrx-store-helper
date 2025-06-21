import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { updateTestObject, resetTestObject } from './sample.actions';
import { selectTestObject } from './sample.selectors';

@Component({
  selector: 'app-sample-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule
  ],
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