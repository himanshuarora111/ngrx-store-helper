import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SampleComponentComponent } from './components/sample-component/sample-component.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SampleComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ngrx-store-helper';
}
