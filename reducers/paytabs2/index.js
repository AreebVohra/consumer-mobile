/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import pt2RequestSerializer from 'reducers/paytabs2/serializers';
import { authStatusChange } from 'reducers/application';
import { getPaytabsPaymentLink } from 'api';

const paytabs2InitialState = {
  isLoading: false,
  pt2RequestData: {},
};

const paytabs2 = createSlice({
  name: 'paytabs2',
  initialState: paytabs2InitialState,
  reducers: {
    fetchPaymentLinkStart(state) {
      state.isLoading = true;
    },
    fetchPaymentLinkSuccess(state, { payload }) {
      state.isLoading = false;
      state.isResolved = true;
      state.pt2RequestData = pt2RequestSerializer(payload);
    },
    fetchPaymentLinkFail(state) {
      state.isLoading = false;
      state.isResolved = true;
    },
  },
  extraReducers: builder => builder.addCase(authStatusChange, () => paytabs2InitialState),
});

export default paytabs2.reducer;

export const {
  fetchPaymentLinkStart,
  fetchPaymentLinkSuccess,
  fetchPaymentLinkFail,
} = paytabs2.actions;

export const fetchPaytabsPaymentLink = data => async (dispatch, state) => {
  if (state.isLoading) {
    return;
  }
  dispatch(fetchPaymentLinkStart());
  try {
    const result = await getPaytabsPaymentLink(data);
    dispatch(fetchPaymentLinkSuccess(result));
  } catch (e) {
    dispatch(fetchPaymentLinkFail(e));
  }
};
