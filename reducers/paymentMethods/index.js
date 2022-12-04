/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { getPaymentMethods, setDefaultPaymentMethod, deletePaymentMethod } from 'api';
import paymentMethodsSerializer from './serializers';

const paymentMethodsInitialState = {
  isLoading: false,
  isResolved: false,
  list: [],
};

const paymentMethods = createSlice({
  name: 'paymentMethods',
  initialState: paymentMethodsInitialState,
  reducers: {
    fetchPaymentMethodsStart(state) {
      return {
        ...state,
        isLoading: true,
        isResolved: false,
      };
    },
    fetchPaymentMethodsSuccess(state, { payload }) {
      const paymentMethodList = paymentMethodsSerializer(payload).reverse();

      return {
        ...state,
        isLoading: false,
        isResolved: true,
        list: paymentMethodList.filter(pm => pm.pmType === 'paytabs2' || pm.pmType === 'hyper_pay'),
      };
    },
    fetchPaymentMethodsFail(state) {
      return {
        ...state,
        isLoading: false,
        isResolved: true,
      };
    },
    unresolvedPaymentMethods(state) {
      return {
        ...state,
        isResolved: false,
      };
    },
    reset() {
      return paymentMethodsInitialState;
    },
  },
});

export default paymentMethods.reducer;

export const {
  fetchPaymentMethodsStart,
  fetchPaymentMethodsSuccess,
  fetchPaymentMethodsFail,
  unresolvedPaymentMethods,
  reset,
} = paymentMethods.actions;

export const fetchPaymentMethods = filterValue => async (dispatch, state) => {
  if (state.isLoading) {
    return;
  }
  dispatch(fetchPaymentMethodsStart());
  try {
    const result = await getPaymentMethods(filterValue);
    dispatch(fetchPaymentMethodsSuccess(result));
  } catch (e) {
    dispatch(fetchPaymentMethodsFail(e));
  }
};

export const setAsDefaultPaymentMethod = id => async dispatch => {
  try {
    await setDefaultPaymentMethod(id);
    dispatch(fetchPaymentMethods());
  } catch (e) {
    throw new Error(e);
  }
};

export const removePaymentMethod = id => async dispatch => {
  try {
    await deletePaymentMethod(id);
    dispatch(fetchPaymentMethods());
  } catch (e) {
    throw new Error(e);
  }
};
