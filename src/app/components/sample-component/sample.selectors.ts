export const selectTestObject = (state: any) => {
  return state['sampleReducer']?.testObject || { test: '' };
};
