/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import leanCustomerSerializer from 'reducers/lean/serializers';
import { authStatusChange, retrieveConsumerScore } from 'reducers/application';
import { deleteLeanEntity, getLeanCustomer } from 'api';

const leanInitialState = {
  isLoading: false,
  isResolved: false,
  unlinkIsResolved: null,
  customer: {},
};

const lean = createSlice({
  name: 'lean',
  initialState: leanInitialState,
  reducers: {
    fetchLeanCustomerStart(state) {
      state.isLoading = true;
    },
    fetchLeanCustomerSuccess(state, { payload }) {
      state.isLoading = false;
      state.isResolved = true;
      state.customer = leanCustomerSerializer(payload);
    },
    fetchLeanCustomerFail(state) {
      state.isLoading = false;
      state.isResolved = true;
    },
    unlinkLeanCustomerReset(state) {
      state.isLoading = false;
      state.unlinkIsResolved = null;
    },
    unlinkLeanCustomerStart(state) {
      state.isLoading = true;
    },
    unlinkLeanCustomerSuccess(state) {
      state.isLoading = false;
      state.unlinkIsResolved = true;
    },
    unlinkLeanCustomerFail(state) {
      state.isLoading = false;
      state.unlinkIsResolved = false;
    },
  },
  extraReducers: builder => builder.addCase(authStatusChange, () => leanInitialState),
});

export default lean.reducer;

export const {
  fetchLeanCustomerStart,
  fetchLeanCustomerSuccess,
  fetchLeanCustomerFail,
  unlinkLeanCustomerReset,
  unlinkLeanCustomerStart,
  unlinkLeanCustomerSuccess,
  unlinkLeanCustomerFail,
} = lean.actions;

export const fetchLeanCustomer = data => async (dispatch, state) => {
  if (state.isLoading) {
    return;
  }
  dispatch(fetchLeanCustomerStart());
  try {
    const result = await getLeanCustomer(data);
    // noinspection JSCheckFunctionSignatures
    dispatch(fetchLeanCustomerSuccess(result));
  } catch (e) {
    dispatch(fetchLeanCustomerFail(e));
  }
};

export const unlinkLeanCustomer = data => async (dispatch, state) => {
  if (state.isLoading) {
    return;
  }
  dispatch(unlinkLeanCustomerStart());
  try {
    await deleteLeanEntity(data);
    dispatch(retrieveConsumerScore());
    // noinspection JSCheckFunctionSignatures
    dispatch(unlinkLeanCustomerSuccess());
  } catch (e) {
    dispatch(unlinkLeanCustomerFail(e));
  }
};
