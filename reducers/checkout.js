/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import {
  confirmOrder,
  preaprove,
  createDraftOrder,
} from 'api';
import pt2RequestSerializer from 'reducers/paytabs2/serializers';

export const CHECKOUT_STATUS_APPROVED = 'approved';
export const CHECKOUT_STATUS_SUBMITTED = 'SUBMITTED';
export const CHECKOUT_STATUS_DECLINED = 'declined';
export const CHECKOUT_STATUS_PENDING = 'PENDING';
export const CHECKOUT_STATUS_UNRESOLVED = 'unresolved';
export const CHECKOUT_STATUS_DRAFT = 'draft';
export const CHECKOUT_STATUS_CARD_ATTACHED = 'CARD_ATTACHED';

const declineCodes = [
  'unpaid_installments',
  'identities_lock',
  'credit_limit',
  'order_min_amount',
  'order_approval',
  'currency_unsupported',
  'spotii_bl',
  'spotii_ib',
  'spotii_gtl',
  'spotii_tr',
  'spotii_lf',
  'spotii_tabs',
];
export const DECLINE_MESSAGES = {};
declineCodes.forEach((key) => {
  DECLINE_MESSAGES[key.toUpperCase()] = key;
});

const checkoutInitialState = {
  isLoading: false,
  isPreapproved: null,
  status: CHECKOUT_STATUS_UNRESOLVED,
  selectedPlan: null,
  selectedPaymentMethod: null,
  creditLimit: null,
  code: null,
  orderId: null,
};

const checkout = createSlice({
  name: 'checkout',
  initialState: checkoutInitialState,
  reducers: {
    // Preaapproval
    requestPreapprovalStart(state) {
      state.isLoading = true;
    },
    requestPreapprovalSuccess(state) {
      state.isLoading = false;
      state.isPreapproved = true;
    },
    requestPreapprovalFail(state, { payload }) {
      state.isLoading = false;
      state.isPreapproved = false;
      state.status = CHECKOUT_STATUS_DECLINED;
      // TODO: Add error messages for other decline reasons
      state.creditLimit = (payload.errors || {}).credit_limit;
      state.code = (payload.errors && payload.errors.code) || DECLINE_MESSAGES.SPOTII_TABS;
    },

    // Confirmation
    requestConfirmOrderStart(state) {
      state.isLoading = true;
      state.status = CHECKOUT_STATUS_UNRESOLVED;
    },
    requestConfirmOrderSuccess(state) {
      state.isLoading = false;
      state.status = CHECKOUT_STATUS_APPROVED;
    },
    requestDraftOrderSuccess(state, { payload }) {
      state.isLoading = false;
      state.status = CHECKOUT_STATUS_DRAFT;
      state.pt2RequestData = pt2RequestSerializer(payload);
    },
    requestConfirmOrderFail(state, { payload }) {
      state.isLoading = false;
      state.status = CHECKOUT_STATUS_DECLINED;
      state.code = (payload.errors && payload.errors.code) || DECLINE_MESSAGES.SPOTII_TABS;
      if (state.code === DECLINE_MESSAGES.SPOTII_02) {
        state.status = CHECKOUT_STATUS_PENDING;
        state.reason = payload.errors.reason;
      }
    },

    // Actions
    selectPlan(state, { payload }) {
      // if (sessionStorage) {
      //   sessionStorage.setItem('spotii:planId', payload);
      // }
      state.selectedPlan = payload;
    },
    selectPaymentMethod(state, { payload }) {
      state.selectedPaymentMethod = payload;
    },
    updateCheckoutWithCardAddResponse(state, { payload }) { // this is used for vgs async flow (otp flow)
      state.isLoading = false;
      if (payload.redirect_url) {
        state.redirectUrl = payload.redirect_url;
      } else if (payload.state === CHECKOUT_STATUS_APPROVED || payload.state === CHECKOUT_STATUS_SUBMITTED) {
        state.status = CHECKOUT_STATUS_APPROVED;
      } else {
        state.status = CHECKOUT_STATUS_DECLINED;
        state.code = payload.code || DECLINE_MESSAGES.SPOTII_TABS;
      }
    },
    // TODO: MUST ALWAYS BE CALLED ON LOGOUT
    reset() {
      return checkoutInitialState;
    },
  },
});

export default checkout.reducer;

export const {
  requestConfirmOrderStart,
  requestConfirmOrderSuccess,
  requestConfirmOrderFail,
  requestDraftOrderSuccess,
  requestPreapprovalStart,
  requestPreapprovalSuccess,
  requestPreapprovalFail,
  selectPlan,
  selectPaymentMethod,
  updateCheckoutWithCardAddResponse,
  reset,
} = checkout.actions;

export const requestConfirmOrder = (token, selectedPlan, selectedPaymentMethod) => async (dispatch, getState) => {
  const state = getState();
  const { isLoading } = state.checkout;
  if (isLoading) {
    return;
  }

  dispatch(requestConfirmOrderStart());
  try {
    const result = await confirmOrder(
      token,
      selectedPlan,
      selectedPaymentMethod,
    );
    dispatch(requestConfirmOrderSuccess(result));
  } catch (e) {
    dispatch(requestConfirmOrderFail(e));
  }
};

export const requestCreateDraftOrder = (token, selectedPlan, selectedPaymentMethod, pt2Request) => async (dispatch, getState) => {
  const state = getState();
  const { isLoading } = state.checkout;
  if (isLoading) {
    return;
  }

  dispatch(requestConfirmOrderStart());
  try {
    const result = await createDraftOrder(token, selectedPlan, selectedPaymentMethod, pt2Request);
    dispatch(requestDraftOrderSuccess(result));
    // eslint-disable-next-line consistent-return
    return result;
  } catch (e) {
    dispatch(requestConfirmOrderFail(e));
  }
};

export const requestPreapproval = (token) => async (dispatch, getState) => {
  const state = getState();
  const { isLoading } = state.checkout;
  if (isLoading) {
    return;
  }
  dispatch(requestPreapprovalStart());
  try {
    const result = await preaprove(token);
    dispatch(requestPreapprovalSuccess(result));
  } catch (e) {
    // const { order: { rejectCallbackUrl } = {} } = state.application;
    // closeIFrameOnCompleteOrder({ status: failedCheckOutStatus, rejectUrl: rejectCallbackUrl });
    dispatch(requestPreapprovalFail(e));
  }
};
