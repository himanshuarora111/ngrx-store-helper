# NgRx Store Wrapper Example

This project demonstrates advanced usage of NgRx Store Wrapper with Angular Material components and data persistence.

## Key Features

- HTTP effects for API integration
- Service-based effects with @AutoBind decorator
- Data persistence (Session and Local Storage)
- Real-time updates with observables
- Angular Material integration

## Angular Material Setup

1. Install Angular Material:

```bash
ng add @angular/material
```

2. Add the following imports to your app.config.ts:

```typescript
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    // ... other providers
  ]
};
```

## Example Implementation

### 1. Service Setup

```typescript
@Injectable({
  providedIn: 'root'
})
export class SampleServiceService {
  private apiUrl = 'https://api.restful-api.dev/objects/ff8081819782e69e0197a31541675900';

  constructor(private http: HttpClient) { }

  /** Fetches data from the API */
  getData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  /** Updates data in the API */
  @AutoBind()
  updateData(data: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.put(this.apiUrl, data, { headers });
  }
}
```

### 2. Component Implementation

```typescript
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

  constructor(store: Store, private sampleService: SampleServiceService) {
    // Subscribe to store state
    store.select((state: any) => state).subscribe((state: any) => {
      this.availableKeys = Object.keys(state);
    });

    this.selectedKey = 'testData';
    this.updateSelectedValue();

    // Subscribe to counter
    storeWrapper.get<number>('counter').subscribe((val) => {
      console.log('[DynamicComponent] Counter:', val);
    });
  }

  ngOnInit() {
    // Initialize data
    storeWrapper.set('testData', {});

    // Sample data for API calls
    const sampleData = {
      name: "Apple AirPods",
      data: {
        color: "white",
        generation: "3rd",
        price: 135
      }
    };

    // Add HTTP effect
    storeWrapper.addEffect({
      key: 'employeeAPI',
      serviceFn: this.sampleService.getData,
      context: this.sampleService,
      intervalMs: 10000,
      immediate: true
    });

    // Add update data effect
    storeWrapper.addEffect({
      key: 'updateDataAPI',
      serviceFn: this.sampleService.updateData,
      args: sampleData,
      immediate: false
    });

    // Subscribe to price updates
    storeWrapper.get('price_data').subscribe((val) => {
      if(!val?.value) return;
      
      // Update sample data with new price
      sampleData = {
        name: "Apple AirPods",
        data: {
          color: "white",
          generation: "3rd",
          price: val.value
        }
      };
      
      // Recall effect with updated data
      storeWrapper.recallEffect('updateDataAPI', sampleData);
    });

    // Subscribe to API responses
    storeWrapper.get('employeeAPI').subscribe((val) => {
      console.log('[DynamicComponent] Employee API:', val);
    });

    storeWrapper.get('updateDataAPI').subscribe((val) => {
      console.log('[DynamicComponent] Update Data API:', val);
    });
  }
}
```

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Deployed url
https://ngrx-store-helper.vercel.app/

## License

MIT
