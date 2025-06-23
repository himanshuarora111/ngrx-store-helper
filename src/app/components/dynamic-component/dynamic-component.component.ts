import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { storeWrapper, StorageType } from 'ngrx-store-wrapper';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

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
    MatFormFieldModule,
    MatCheckboxModule
  ],
  templateUrl: './dynamic-component.component.html',
  styleUrls: ['./dynamic-component.component.scss']
})
export class DynamicComponentComponent implements OnInit {
  saveToSession = false;
  saveToLocal = false;
  testData$!: Observable<any>;
  availableKeys: string[] = [];
  newKey = '';
  initialValue = '';
  updateValueInput = '';
  selectedKey = '';
  selectedValue: any;

  constructor(store: Store) {
    store.select((state: any) => state).subscribe((state: any) => {
      this.availableKeys = Object.keys(state);
    });

    this.selectedKey = 'testData';
    this.updateSelectedValue();

    storeWrapper.get<number>('counter').subscribe((val) => {
      console.log('[DynamicComponent] Counter:', val);
    });
  }

  ngOnInit() {
    storeWrapper.set('testData', {});
  }

  updateSelectedValue() {
    if (this.selectedKey) {
      this.selectedValue = storeWrapper.get(this.selectedKey);
    }
  }

  addKey() {
    if (this.newKey && this.newKey.trim()) {
      const trimmedKey = this.newKey.trim();
      const value = this.initialValue ? { value: this.initialValue } : {};
      storeWrapper.set(trimmedKey, value);

      if (this.saveToSession) {
        storeWrapper.enablePersistence(trimmedKey, StorageType.Session);
      }

      if (this.saveToLocal) {
        storeWrapper.enablePersistence(trimmedKey, StorageType.Local);
      }

      this.newKey = '';
      this.initialValue = '';
      this.saveToSession = false;
      this.saveToLocal = false;
    }
  }

  updateKey() {
    if (this.selectedKey) {
      const value = this.updateValueInput ? { value: this.updateValueInput } : {};
      storeWrapper.set(this.selectedKey, value);
      this.updateValueInput = '';
    }
  }

  resetValue() {
    if (this.selectedKey) {
      storeWrapper.set(this.selectedKey, {});
    }
  }
}
