import { Store } from '@ngrx/store';
import { createAction, createReducer, on } from '@ngrx/store';
import { createSelector } from '@ngrx/store';
import { StoreConfig, StoreState, storeConfig } from './store.config';
import { ReducerManager } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export class DynamicStoreHelper {
  private static instance: DynamicStoreHelper;
  private storeConfig: StoreConfig;
  private reducerManager!: ReducerManager;
  private staticReducerKeys: Set<string> = new Set();
  private store!: Store<StoreState>;

  private constructor() {
    this.storeConfig = storeConfig;
  }

  public getStore(): Store<StoreState> {
    return this.store;
  }

  private static initializeStoreConfig(): StoreConfig {
    return {
      reducers: {},
      actions: {},
      selectors: {},
      store: null as unknown as Store<StoreState>
    };
  }

  public static getInstance(): DynamicStoreHelper {
    if (!DynamicStoreHelper.instance) {
      DynamicStoreHelper.instance = new DynamicStoreHelper();
    }
    return DynamicStoreHelper.instance;
  }

  public initializeStore(store: Store<StoreState>, reducerManager: ReducerManager): void {
    this.store = store;
    this.storeConfig.store = store;
    this.reducerManager = reducerManager;
    
    // Get all existing reducers (static reducers)
    this.store.select((state: StoreState) => state).pipe(take(1)).subscribe(state => {
      Object.keys(state).forEach(key => {
        this.staticReducerKeys.add(key);
      });
    });
  }

  public set(key: string, value: any): void {
    // Check if store is initialized
    if (!this.storeConfig.store) {
      throw new Error('Store must be initialized before setting data');
    }

    // Check if key is a static reducer key
    if (this.staticReducerKeys.has(key)) {
      throw new Error(`Cannot update static reducer key: ${key}. This key is managed by a static reducer.`);
    }

    // Create action if it doesn't exist
    if (!this.storeConfig.actions[`set${key}`]) {
      this.storeConfig.actions[`set${key}`] = createAction(`[${key}] Set`, (payload: any) => ({ payload }));
    }

    // Create reducer if it doesn't exist
    if (!this.storeConfig.reducers[key]) {
      // Create a new reducer that maintains existing state
      const initialState: any = {};
      const reducer = createReducer(
        initialState,
        on(this.storeConfig.actions[`set${key}`], (state, { payload }) => ({ ...state, ...payload }))
      );
      
      // Register the reducer dynamically
      this.reducerManager.addReducer(key, reducer);
      this.storeConfig.reducers[key] = reducer;
    }

    // Create selector if it doesn't exist
    if (!this.storeConfig.selectors[key]) {
      this.storeConfig.selectors[key] = createSelector(
        (state: StoreState) => state[key],
        (state) => state
      );
    }

    // Dispatch the action through the store
    const action = this.storeConfig.actions[`set${key}`];
    this.storeConfig.store.dispatch(action({ payload: value }));
  }

  public get(key: string): Observable<any> {
    // Create selector if it doesn't exist
    if (!this.storeConfig.selectors[key]) {
      // Create a simple selector that returns the state for this key
      this.storeConfig.selectors[key] = (state: StoreState) => state[key];
    }

    return this.store.select(this.storeConfig.selectors[key]);
  }
}

export const upgradedStore = DynamicStoreHelper.getInstance();
