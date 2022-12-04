/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { getBillingAddresses, setDefaultBillingAddress, deleteBillingAddress } from 'api';
import billingAddressesSerializer from './serializers';

const billingAddressesInitialState = {
  isLoading: false,
  isResolved: false,
  list: [],
};

const billingAddresses = createSlice({
  name: 'billingAddresses',
  initialState: billingAddressesInitialState,
  reducers: {
    fetchBillingAddressesStart(state) {
      state.isLoading = true;
    },
    fetchBillingAddressesSuccess(state, { payload }) {
      state.isLoading = false;
      state.isResolved = true;
      state.list = billingAddressesSerializer(payload);
    },
    fetchBillingAddressesFail(state) {
      state.isLoading = false;
      state.isResolved = true;
    },
    unresolvedBillingAddresses(state) {
      state.isResolved = false;
    },
    reset() {
      return billingAddressesInitialState;
    },
  },
});

export default billingAddresses.reducer;

export const {
  fetchBillingAddressesStart,
  fetchBillingAddressesSuccess,
  fetchBillingAddressesFail,
  unresolvedBillingAddresses,
  billingAddressesNeedUpdate,
  reset,
} = billingAddresses.actions;

export const fetchBillingAddresses = () => async (dispatch, state) => {
  if (state.isLoading) {
    return;
  }
  dispatch(fetchBillingAddressesStart());
  try {
    const result = await getBillingAddresses();
    dispatch(fetchBillingAddressesSuccess(result));
  } catch (e) {
    dispatch(fetchBillingAddressesFail(e));
  }
};

export const setAsDefaultBillingAddress = id => async dispatch => {
  try {
    await setDefaultBillingAddress(id);
    dispatch(fetchBillingAddresses());
  } catch (e) {
    throw new Error(e);
  }
};

export const removeBillingAddress = id => async dispatch => {
  try {
    await deleteBillingAddress(id);
    dispatch(fetchBillingAddresses());
  } catch (e) {
    throw new Error(e);
  }
};
