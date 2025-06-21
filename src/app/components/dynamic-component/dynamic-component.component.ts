import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Store } from '@ngrx/store';
import { upgradedStore } from '../../store/dynamic-store.helper';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dynamic-component',
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
  templateUrl: './dynamic-component.component.html',
  styleUrls: ['./dynamic-component.component.scss']
})
export class DynamicComponentComponent implements OnInit {
  testData$!: Observable<any>;
  availableKeys: string[] = [];
  newKey = '';
  initialValue = '';
  updateValueInput = '';
  selectedKey = '';
  selectedValue: any;

  constructor(
    private store: Store,
  ) {
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
      upgradedStore.set(this.newKey.trim(), this.initialValue ? { value: this.initialValue } : {});
      this.newKey = '';
      this.initialValue = '';
    }
  }

  updateKey() {
    if (this.selectedKey) {
      upgradedStore.set(this.selectedKey, this.updateValueInput ? { value: this.updateValueInput } : {});
      this.updateValueInput = '';
    }
  }

  resetValue() {
    if (this.selectedKey) {
      upgradedStore.set(this.selectedKey, {});
    }
  }
}
