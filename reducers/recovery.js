/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const recoveryInitialState = {
  isVerified: false,
  isPopulated: false,
};

const recovery = createSlice({
  name: 'recovery',
  initialState: recoveryInitialState,
  reducers: {
    verifyPasswordRecovery(state) {
      state.isVerified = true;
    },
    clearRecovery() {
      return recoveryInitialState;
    },
    setRecoveryFields(state, { payload }) {
      return {
        ...state,
        ...payload,
        isPopulated: true,
      };
    },
    reset() {
      return recoveryInitialState;
    },
  },
});

export default recovery.reducer;

export const {
  verifyPasswordRecovery, clearRecovery, setRecoveryFields, reset,
} = recovery.actions;
