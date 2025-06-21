# NgRx Dynamic Store Helper

A TypeScript helper class that simplifies working with dynamic reducers in NgRx Store, allowing you to manage both static and dynamic reducers seamlessly.

## Features

- Easy initialization of dynamic reducers
- Automatic handling of static vs dynamic reducers
- Simple API for setting and getting values
- Built-in selector management
- Type-safe operations
- No direct Store dependencies in components

## Installation

This helper is designed to work with Angular and NgRx. Ensure you have the following dependencies:

```bash
npm install @ngrx/store @ngrx/store-devtools
```

## Setup

1. First, create a store configuration file (store.config.ts):

```typescript
// src/app/store/store.config.ts
import { StoreConfig } from './store.config';

export const storeConfig: StoreConfig = {
  reducers: {},
  actions: {},
  selectors: {},
  store: null as unknown as Store<StoreState>
};

export interface StoreState {
  // Add your static reducer state here
}
```

2. Initialize the dynamic store helper in your app configuration:

```typescript
// src/app/app.config.ts
import { provideStore } from '@ngrx/store';
import { provideReducerManager } from '@ngrx/store';
import { DynamicStoreHelper, storeConfig } from './store/dynamic-store.helper';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(storeConfig.reducers),
    provideReducerManager(),
    {
      provide: DynamicStoreHelper,
      useFactory: (store, reducerManager) => {
        const helper = DynamicStoreHelper.getInstance();
        helper.initializeStore(store, reducerManager);
        return helper;
      },
      deps: [Store, ReducerManager]
    }
  ]
};
```

## Usage in Components

1. Inject the helper in your component:

```typescript
// src/app/components/your-component/your-component.component.ts
import { DynamicStoreHelper } from '../store/dynamic-store.helper';

@Component({
  selector: 'app-your-component',
  standalone: true,
  imports: [CommonModule],
  template: `<!-- Your template -->`
})
export class YourComponent {
  selectedValue: any;

  constructor(private storeHelper: DynamicStoreHelper) {
    // Subscribe to value changes
    this.storeHelper.get('yourKey').subscribe(value => {
      this.selectedValue = value;
    });
  }

  setValue(value: any) {
    this.storeHelper.set('yourKey', value);
  }
}
```

## API Reference

### Methods

- `set(key: string, value: any)`: Sets a value for a given key
- `get(key: string): Observable<any>`: Gets an observable for a given key
- `getStore(): Store<StoreState>`: Gets the underlying NgRx Store instance

### Static Methods

- `getInstance()`: Gets the singleton instance of the helper
- `initializeStore(store: Store<StoreState>, reducerManager: ReducerManager)`: Initializes the helper with store dependencies

## Best Practices

1. Use meaningful key names that don't conflict with static reducers
2. Handle null/undefined values appropriately in your components
3. Use the helper's methods instead of direct Store operations
4. Subscribe to values using the helper's get() method
5. Clean up subscriptions in your components

## Error Handling

The helper will throw errors in these cases:
- Attempting to update a static reducer key
- Using the helper before initialization
- Invalid store configuration

## Example

Here's a complete example of using the helper in a component:

```typescript
@Component({
  selector: 'app-dynamic-component',
  template: `
    <div>
      <input [(ngModel)]="newKey" placeholder="Enter key">
      <input [(ngModel)]="value" placeholder="Enter value">
      <button (click)="setKeyValue()">Set Value</button>
    </div>
    <div>
      <select [(ngModel)]="selectedKey">
        <option *ngFor="let key of availableKeys" [value]="key">{{key}}</option>
      </select>
      <div *ngIf="selectedValue">Current Value: {{selectedValue | json}}</div>
    </div>
  `
})
export class DynamicComponent {
  newKey = '';
  value = '';
  selectedKey = '';
  selectedValue: any;
  availableKeys: string[] = [];

  constructor(private storeHelper: DynamicStoreHelper) {
    // Subscribe to all keys
    this.storeHelper.getStore().select(state => state).subscribe(state => {
      this.availableKeys = Object.keys(state);
    });

    // Subscribe to selected key
    this.storeHelper.get('testData').subscribe(value => {
      this.selectedValue = value;
    });
  }

  setKeyValue() {
    if (this.newKey && this.value) {
      this.storeHelper.set(this.newKey, this.value);
    }
  }
}
```

## License

MIT

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

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## License

MIT
