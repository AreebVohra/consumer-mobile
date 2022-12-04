/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
// import dayjs from 'dayjs';
import { getNextPayments } from 'api';
import { INSTALLMENT_STATUS_MISSED, INSTALLMENT_STATUS_SCHEDULED, INSTALLMENT_STATUS_AUTHORIZED } from 'utils/constants';
import nextPaymentsSerializer from './serializers';

const nextPaymentsInitialState = {
  isLoading: false,
  isResolved: false,
  list: [],
};

const nextPayments = createSlice({
  name: 'nextPayments',
  initialState: nextPaymentsInitialState,
  reducers: {
    fetchNextPaymentsStart(state) {
      state.isLoading = true;
    },
    fetchNextPaymentsSuccess(state, { payload }) {
      state.isLoading = false;
      state.isResolved = true;
      state.list = nextPaymentsSerializer(payload);
    },
    fetchNextPaymentsFail(state) {
      state.isLoading = false;
      state.isResolved = true;
    },
    unresolvedNextPayments(state) {
      state.isResolved = false;
    },
    reset() {
      return nextPaymentsInitialState;
    },
  },
});

export default nextPayments.reducer;

export const {
  fetchNextPaymentsStart,
  fetchNextPaymentsSuccess,
  fetchNextPaymentsFail,
  unresolvedNextPayments,
  billingAddressesNeedUpdate,
  reset,
} = nextPayments.actions;

export const fetchNextPayments = () => async (dispatch, state) => {
  if (state.isLoading) {
    return;
  }
  dispatch(fetchNextPaymentsStart());
  try {
    const result = await getNextPayments({
      per_page: 3,
      // effective_at_after: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      ordering: 'effective_at',
      status: [
        INSTALLMENT_STATUS_MISSED,
        INSTALLMENT_STATUS_SCHEDULED,
        INSTALLMENT_STATUS_AUTHORIZED,
      ],
    });
    dispatch(fetchNextPaymentsSuccess(result));
  } catch (e) {
    dispatch(fetchNextPaymentsFail(e));
  }
};
