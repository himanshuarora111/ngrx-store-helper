import { createAction, props } from '@ngrx/store';

export const updateTestObject = createAction(
  '[Sample] Update Test Object',
  props<{ testObject: any }>()
);

export const resetTestObject = createAction(
  '[Sample] Reset Test Object'
);
