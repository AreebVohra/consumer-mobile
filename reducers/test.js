/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const testInitialState = {
  reducerTest: 'trigger my action',
};

const test = createSlice({
  name: 'test',
  initialState: testInitialState,
  reducers: {
    changeTest(state, { payload }) {
      const { reducerTest } = payload;
      return {
        ...state,
        reducerTest,
      };
    },
  },
});

export default test.reducer;

export const { changeTest } = test.actions;
