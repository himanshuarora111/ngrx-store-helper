import { Store, createAction, createReducer, on, ActionReducerMap, ReducerManager, createSelector, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { isDevMode } from '@angular/core';

export interface StoreState {
  [key: string]: any;
}

const DYNAMIC_KEY_WARN_THRESHOLD = 100;

export class DynamicStoreHelper {
  private static instance: DynamicStoreHelper;
  private reducerManager!: ReducerManager;
  private staticReducerKeys: Set<string> = new Set();
  private store!: Store<StoreState>;

  private dynamicReducers: ActionReducerMap<StoreState> = {};
  private dynamicActions: Record<string, any> = {};
  private dynamicSelectors: Record<string, any> = {};

  public getStore(): Store<StoreState> {
    return this.store;
  }
  private constructor() {}

  public static getInstance(): DynamicStoreHelper {
    if (!DynamicStoreHelper.instance) {
      DynamicStoreHelper.instance = new DynamicStoreHelper();
    }
    return DynamicStoreHelper.instance;
  }

  public initializeStore(store: Store<StoreState>, reducerManager: ReducerManager): void {
    this.store = store;
    this.reducerManager = reducerManager;

    const selectWholeState = createSelector(
      (state: StoreState) => state,
      (state) => state
    );

    this.store.pipe(select(selectWholeState), take(1)).subscribe(state => {
      Object.keys(state).forEach(key => this.staticReducerKeys.add(key));
    });
  }

  public set(key: string, value: any): void {
    if (!this.store) {
      throw new Error('Store must be initialized before setting data');
    }

    if (this.staticReducerKeys.has(key)) {
      if (isDevMode()) {
        console.warn(
          `[DynamicStoreHelper] Attempted to set value for static reducer key: "${key}". This operation is ignored.`
        );
      }
      return;
    }

    if (!this.dynamicActions[`set${key}`]) {
      this.dynamicActions[`set${key}`] = createAction(`[${key}] Set`, (payload: any) => ({ payload }));
    }

    if (!this.dynamicReducers[key]) {
      const reducer = createReducer(
        { value: null },
        on(this.dynamicActions[`set${key}`], (state, { payload }) => ({ value: payload }))
      );

      this.reducerManager.addReducer(key, reducer);
      this.dynamicReducers[key] = reducer;

      if (isDevMode() && Object.keys(this.dynamicReducers).length > DYNAMIC_KEY_WARN_THRESHOLD) {
        console.warn(
          `[DynamicStoreHelper] Warning: More than ${DYNAMIC_KEY_WARN_THRESHOLD} dynamic store keys have been registered.\n` +
          `Consider pruning unused keys to avoid potential memory or performance issues.`
        );
      }
    }

    if (!this.dynamicSelectors[key]) {
      this.dynamicSelectors[key] = createSelector(
        (state: StoreState) => state[key],
        (state) => state?.value
      );
    }

    const action = this.dynamicActions[`set${key}`];
    this.store.dispatch(action({ payload: value }));
  }

  public get<T = any>(key: string): Observable<T> {
    if (!this.store) {
      throw new Error('Store must be initialized before getting data');
    }

    if (!this.dynamicSelectors[key]) {
      this.dynamicSelectors[key] = createSelector(
        (state: StoreState) => state[key],
        (state) => state?.value
      );
    }

    return this.store.pipe(select(this.dynamicSelectors[key]));
  }

  public remove(key: string): void {
    if (!this.dynamicReducers[key]) return;

    this.reducerManager.removeReducer(key);
    delete this.dynamicReducers[key];
    delete this.dynamicActions[`set${key}`];
    delete this.dynamicSelectors[key];
  }
}

export const upgradedStore = DynamicStoreHelper.getInstance();
