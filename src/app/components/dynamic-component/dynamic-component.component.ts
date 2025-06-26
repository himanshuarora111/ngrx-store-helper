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
import { SampleServiceService } from '../../services/sample-service.service';

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
  storeWrapper = storeWrapper;

  constructor(store: Store, private sampleService: SampleServiceService) {
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
    let sample_data = {};
    // storeWrapper.set('price_data', { value: 140 });

    storeWrapper.addEffect({
      key: 'employeeAPI',
      serviceFn: this.sampleService.getData,
      context: this.sampleService,
      intervalMs: 20000,
      immediate: true
    });
    storeWrapper.addEffect({
      key: 'updateDataAPI',
      serviceFn: this.sampleService.updateData,
      args: sample_data,
      immediate: false
    });
    storeWrapper.get('price_data').subscribe((val) => {
      if(!val?.value) return
      sample_data = {
        name: "Apple AirPods",
        data: {
          color: "white",
          generation: "3rd",
          price: val.value
        }
      };
      storeWrapper.recallEffect('updateDataAPI', sample_data);
    });
    
    // storeWrapper.get('employeeAPI').subscribe((val) => {
    //   console.log('[DynamicComponent] Employee API:', val);
    // });
    // storeWrapper.get('updateDataAPI').subscribe((val) => {
    //   console.log('[DynamicComponent] Update Data API:', val);
    // });


    // Sample using HTTP effect.
    // storeWrapper.addHttpEffect({
    //   key: 'employeeAPIHTTP',
    //   url: "https://api.restful-api.dev/objects/ff8081819782e69e0197a31541675900",
    //   method: 'GET',
    //   intervalMs: 10000,
    //   immediate: true
    // })
    // storeWrapper.get('employeeAPIHTTP').subscribe((val) => {
    //   console.log('[DynamicComponent] Employee API HTTP:', val);
    // });
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
