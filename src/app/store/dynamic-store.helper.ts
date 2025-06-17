import { Store } from '@ngrx/store';
import { createAction, createReducer, on } from '@ngrx/store';
import { createSelector } from '@ngrx/store';
import { StoreConfig, StoreState, storeConfig } from './store.config';

export class DynamicStoreHelper {
  private static instance: DynamicStoreHelper;
  private storeConfig: StoreConfig;

  private constructor() {
    this.storeConfig = storeConfig;
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

  public set(key: string, value: any): void {
    console.log('[DynamicStoreHelper] Setting data for key:', key, 'value:', value);
    
    // Check if store is initialized
    if (!this.storeConfig.store) {
      throw new Error('Store must be initialized before setting data');
    }

    // Create action if it doesn't exist
    if (!this.storeConfig.actions[`set${key}`]) {
      console.log('[DynamicStoreHelper] Creating action for key:', key);
      this.storeConfig.actions[`set${key}`] = createAction(`[${key}] Set`, (payload: any) => ({ payload }));
    }

    // Create reducer if it doesn't exist
    if (!this.storeConfig.reducers[key]) {
      console.log('[DynamicStoreHelper] Creating reducer for key:', key);
      // Create a new reducer that maintains existing state
      const initialState: any = {};
      this.storeConfig.reducers[key] = createReducer(
        initialState,
        on(this.storeConfig.actions[`set${key}`], (state, { payload }) => ({ ...state, ...payload }))
      );
    }

    // Create selector if it doesn't exist
    if (!this.storeConfig.selectors[key]) {
      console.log('[DynamicStoreHelper] Creating selector for key:', key);
      this.storeConfig.selectors[key] = createSelector(
        (state: StoreState) => state[key],
        (state) => state
      );
    }

    // Dispatch the action through the store
    const action = this.storeConfig.actions[`set${key}`];
    console.log('[DynamicStoreHelper] Dispatching action:', action);
    this.storeConfig.store.dispatch(action({ payload: value }));
  }

  public get(key: string): any {
    // Create selector if it doesn't exist
    if (!this.storeConfig.selectors[key]) {
      this.storeConfig.selectors[key] = createSelector(
        (state: StoreState) => state[key],
        (state) => state
      );
    }

    return this.storeConfig.selectors[key];
  }

  public setStore(store: Store<StoreState>): void {
    this.storeConfig.store = store;
  }
}

export const upgradedStore = DynamicStoreHelper.getInstance();
