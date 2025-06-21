import { ActionReducerMap } from '@ngrx/store';
import { Store } from '@ngrx/store';

export interface StoreState {
  [key: string]: any;
}

export interface StoreConfig {
  reducers: ActionReducerMap<StoreState>;
  actions: Record<string, any>;
  selectors: Record<string, any>;
  store: Store<StoreState>;
}

export const storeConfig: StoreConfig = {
  reducers: {},
  actions: {},
  selectors: {},
  store: null as unknown as Store<StoreState>
} as const;
