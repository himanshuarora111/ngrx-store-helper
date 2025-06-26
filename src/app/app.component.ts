import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SampleComponentComponent } from './components/sample-component/sample-component.component';
import { DynamicComponentComponent } from './components/dynamic-component/dynamic-component.component';
import { storeWrapper } from 'ngrx-store-wrapper';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SampleComponentComponent, DynamicComponentComponent, MatIconModule, MatDividerModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngrx-store-helper';
  private counter = 1;
  showDynamicComponent = true;

  constructor() {
    setInterval(() => {
      this.counter++;
      storeWrapper.set('counter', this.counter);
    }, 1000);
  }

  toggleDynamicComponent() {
    this.showDynamicComponent = !this.showDynamicComponent;
  }
}
