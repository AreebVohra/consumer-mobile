/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { getOrderDetails } from 'api';
import orderDetailsSerializer from './serializers';

const orderDetailsInitialState = {
  isLoading: false,
  isResolved: false,
  data: {},
};

const orderDetails = createSlice({
  name: 'orderDetails',
  initialState: orderDetailsInitialState,
  reducers: {
    fetchOrderDetailsStart(state) {
      state.isLoading = true;
    },
    fetchOrderDetailsSuccess(state, { payload }) {
      state.isLoading = false;
      state.isResolved = true;
      state.data = orderDetailsSerializer(payload);
    },
    fetchOrderDetailsFail(state) {
      state.isLoading = false;
      state.isResolved = true;
      state.data = {};
    },
    reset() {
      return orderDetailsInitialState;
    },
  },
});

export default orderDetails.reducer;

export const {
  fetchOrderDetailsStart,
  fetchOrderDetailsSuccess,
  fetchOrderDetailsFail,
  reset,
} = orderDetails.actions;

export const fetchOrderDetails = id => async (dispatch, state) => {
  dispatch(fetchOrderDetailsStart());

  try {
    const result = await getOrderDetails(id);
    dispatch(fetchOrderDetailsSuccess(result));
  } catch (e) {
    console.error('error', e);
    dispatch(fetchOrderDetailsFail(e));
  }
};
