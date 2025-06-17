import { createReducer, on, Action } from '@ngrx/store';
import * as SampleActions from './sample.actions';

export const sampleFeatureKey = 'sample';

export const initialSampleState = {
  testObject: { test: 'Initial Value' }
};

export const sampleReducer = createReducer(
  initialSampleState,
  on(SampleActions.updateTestObject, (state, { testObject }) => {
    return {
      ...state,
      testObject
    };
  }),
  on(SampleActions.resetTestObject, () => {
    return initialSampleState;
  })
);
