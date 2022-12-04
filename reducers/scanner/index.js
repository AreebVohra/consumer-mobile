/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
import { createSlice } from '@reduxjs/toolkit';
import {
  postDraftCheckout,
  getDraftPlans,
  getDraft,
  getMerchantInfo,
  getOrder,
  fetchGCOrderDetails,
  fetchEstimations,
} from 'api';
import {
  DRAFT_STATUS_PENDING_MERCHANT,
  DRAFT_STATUS_IN_PROGRESS,
  DRAFT_STATUS_PENDING_PAYMENT,
  DECLINE_MESSAGES,
  FAILED_CHECKOUT_STATUS,
  PLAN_SLUGS,
} from 'utils/constants';
import get from 'lodash/get';

import {
  estimationSerializer,
  plansSerializer,
  orderSerializer,
} from './checkoutSerializers';

const scannerInitialState = {
  isScanned: false,
  merchantScanData: null,
  pendingMerchant: false,
  checkoutToken: null,
  isCreateLoading: false,
  isRequestLoading: false,
  // completedOrder: null,
  // isPrefillResolved: false,
  isEstimationsResolved: false,
  isPaymentLinkSubmitted: false,
  isPaymentLinkExpired: false,
  isMerchantInfoRequestLoading: false,
  isDraftPosted: false,
  isPlansPosted: false,
  isMerchantInfoPosted: false,
  postError: false,
  requestError: false,
  amount: null,
  draftData: null,
  plans: null,
  estimations: null,
  selectedPlan: null,
  selectedPaymentMethod: null,
  currentDraftStatus: null,
  merchantInfo: null,
  isNoCard: false,
  expectedVersion: null,
  fromStaticMerchantQr: true,
  isRequestResolved: null,
  order: null,
  isMonthlyPlanDefault: null,
  payNowPlan: null,
  gcData: {
    isLoading: false,
    isFetched: false,
    isSuccessful: false,
    reference: '',
  },
  checkoutAttempted: false,
};

const scanner = createSlice({
  name: 'scanner',
  initialState: scannerInitialState,
  reducers: {
    setCurrentDraftStatus(state, { payload }) {
      return {
        ...state,
        currentDraftStatus: payload,
      };
    },
    setScanData(state, { payload }) {
      const { scanData } = payload;

      return {
        ...state,
        merchantScanData: scanData,
        isScanned: true,
        currentDraftStatus: DRAFT_STATUS_PENDING_MERCHANT,
      };
    },
    resetScanner(state) {
      return {
        ...state,
        isScanned: false,
        fromStaticMerchantQr: true,
        merchantScanData: false,
      };
    },
    setAmount(state, { payload }) {
      const { amount } = payload;
      return {
        ...state,
        amount,
      };
    },
    createOrderDraftStart(state) {
      return {
        ...state,
        isCreateLoading: true,
      };
    },
    createDraftCheckoutSuccess(state, { payload }) {
      return {
        ...state,
        isCreateLoading: false,
        isDraftPosted: true,
        pendingMerchant: true,
        draftData: payload,
      };
    },
    createDraftCheckoutFail(state) {
      return {
        ...state,
        isCreateLoading: false,
        isDraftPosted: false,
        draftData: null,
        postError: true,
      };
    },
    requestDraftPlansStart(state) {
      return {
        ...state,
        isRequestLoading: true,
      };
    },
    requestDraftPlansSuccess(state, { payload }) {
      return {
        ...state,
        isRequestLoading: false,
        isPlansPosted: true,
      };
    },
    requestDraftPlansFail(state) {
      return {
        ...state,
        isRequestLoading: false,
        isPlansPosted: false,
        plans: null,
        estimations: null,
        requestError: true,
      };
    },
    requestMerchantInfoStart(state) {
      return {
        ...state,
        isMerchantInfoRequestLoading: true,
      };
    },
    requestMerchantInfoSuccess(state, { payload }) {
      return {
        ...state,
        isMerchantInfoRequestLoading: false,
        isMerchantInfoPosted: true,
        merchantInfo: payload[0],
      };
    },
    requestMerchantInfoFail(state) {
      return {
        ...state,
        isMerchantInfoRequestLoading: false,
        isMerchantInfoPosted: false,
        merchantInfo: null,
      };
    },
    selectPlan(state, { payload }) {
      return {
        ...state,
        selectedPlan: payload,
      };
    },
    selectPaymentMethod(state, { payload }) {
      return {
        ...state,
        selectedPaymentMethod: payload,
      };
    },
    setIsNoCard(state, { payload }) {
      return {
        ...state,
        isNoCard: payload,
      };
    },
    updateDraftData(state, { payload }) {
      return {
        ...state,
        draftData: payload,
      };
    },
    declineOutdatedApp(state, { payload }) {
      return {
        ...state,
        isMerchantInfoRequestLoading: false,
        isMerchantInfoPosted: false,
        merchantInfo: null,
        ...payload,
      };
    },
    setPseudoDraftError(state, { payload }) {
      return {
        ...state,
        draftData: { error_code: payload },
      };
    },
    setFromStaticMerchantQr(state, { payload }) {
      return {
        ...state,
        fromStaticMerchantQr: payload,
      };
    },
    // in store checkout actions
    fetchOrderLoading(state, { payload }) {
      return {
        ...state,
        isRequestLoading: true,
        checkoutToken: payload,
      };
    },
    fetchOrderSuccess(state, { payload }) {
      const estimations = estimationSerializer(payload.estimations);
      const plans = plansSerializer(payload.estimations);
      const order = orderSerializer(payload);
      const firstPlan = plans[0] || {};
      return {
        ...state,
        isRequestLoading: false,
        isPlansPosted: true,
        isRequestResolved: true,
        order,
        plans,
        estimations,
        isMonthlyPlanDefault: estimations.length === 1 && estimations[0].slug === PLAN_SLUGS.MONTHLY,
        selectedPlan: firstPlan.id || null,
        payNowPlan: firstPlan.slug === PLAN_SLUGS.PAY_NOW ? firstPlan : null,
        needsPromo: order.merchantPromoEnabled,
      };
    },
    fetchOrderFail(state, resp) {
      const { code, checkout_object: checkoutObject } = get(resp, 'payload.response.data', {});
      const isPaymentLinkSubmitted = code === DECLINE_MESSAGES.SPOTII_SBM;
      const isPaymentLinkExpired = code === DECLINE_MESSAGES.SPOTII_EXP;

      return {
        ...state,
        isRequestLoading: false,
        isRequestResolved: true,
        order: null,
        code,
        isPaymentLinkExpired,
        isPaymentLinkSubmitted,
        // for some reason, adding these two lines would cause components using isPaymentLinkSubmitted not to update on value change
        // completedOrder: isPaymentLinkSubmitted ? orderSerializer(checkoutObject) : {},
        // isPrefillResolved: isPaymentLinkSubmitted,
        isPlansPosted: false,
        plans: null,
        estimations: null,
        requestError: true,
      };
    },
    fetchOrderDetails(state, { payload }) {
      return {
        ...state,
        isOrderLoading: false,
        isOrderResolved: true,
        order: {
          ...state.order,
          orderId: payload.order_id,
        },
      };
    },
    fetchGCOrderStart(state) {
      return {
        ...state,
        gcData: {
          ...state.gcData,
          isLoading: true,
        },
      };
    },
    fetchGCOrderSuccess(state, { payload }) {
      return {
        ...state,
        gcData: {
          ...state.gcData,
          isLoading: false,
          isFetched: true,
          isSuccessful: true,
          reference: payload.gc_reference,
          expiresAfter: payload.gc_expires_in,
        },
      };
    },
    fetchGCOrderFail(state) {
      return {
        ...state,
        gcData: {
          ...state.gcData,
          isLoading: false,
          isFetched: true,
          isSuccessful: false,
        },
      };
    },
    fetchOrderEstimationsStart(state) {
      return {
        ...state,
        isEstimationsResolved: false,
        estimations: null,
        isMonthlyPlanDefault: null,
      };
    },
    fetchOrderEstimationsSuccess(state, { payload }) {
      const estimations = estimationSerializer(payload);
      const plans = plansSerializer(payload);

      return {
        ...state,
        isEstimationsResolved: true,
        estimations,
        plans,
        isMonthlyPlanDefault: estimations.length === 1 && estimations[0].slug === PLAN_SLUGS.MONTHLY,
      };
    },
    fetchOrderEstimationsFail(state) {
      return {
        ...state,
        isEstimationsResolved: true,
        estimations: null,
        isMonthlyPlanDefault: null,
      };
    },
    resetOrderEstimations(state) {
      return {
        ...state,
        isEstimationsResolved: false,
        estimations: null,
        plans: null,
        isMonthlyPlanDefault: null,
      };
    },
    reset() {
      return scannerInitialState;
    },
    setCheckoutAttempted(state, { payload }) {
      return {
        ...state,
        checkoutAttempted: payload.checkoutAttempted,
      };
    },
  },
});

export default scanner.reducer;

export const {
  setScanData,
  resetScanner,
  reset,
  setAmount,
  createDraftCheckoutFail,
  createOrderDraftStart,
  createDraftCheckoutSuccess,
  requestDraftPlansFail,
  requestDraftPlansStart,
  requestDraftPlansSuccess,
  requestMerchantInfoStart,
  requestMerchantInfoSuccess,
  requestMerchantInfoFail,
  selectPlan,
  selectPaymentMethod,
  setIsNoCard,
  setCurrentDraftStatus,
  updateDraftData,
  declineOutdatedApp,
  setPseudoDraftError,
  setFromStaticMerchantQr,
  fetchOrderDetails,
  fetchOrderFail,
  fetchOrderLoading,
  fetchOrderSuccess,
  fetchGCOrderStart,
  fetchGCOrderSuccess,
  fetchGCOrderFail,
  setCheckoutAttempted,
  fetchOrderEstimationsStart,
  fetchOrderEstimationsSuccess,
  fetchOrderEstimationsFail,
  resetOrderEstimations,
} = scanner.actions;

export const createDraftCheckout = data => async (dispatch, state) => {
  if (state.isCreateLoading) {
    return;
  }
  dispatch(createOrderDraftStart());
  try {
    const result = await postDraftCheckout(data);
    dispatch(createDraftCheckoutSuccess(result));
  } catch (e) {
    if (e.errors && e.errors.code) {
      dispatch(declineOutdatedApp({
        expectedVersion: e.errors.message,
        draftData: { error_code: e.errors.code, error_reason: e.errors.reason ? e.errors.reason : null },
      }));
    } else {
      console.error(e, e.errors);
      dispatch(createDraftCheckoutFail(e));
    }
  }
};

export const requestDraftPlans = currency => async (dispatch, state) => {
  if (state.isRequestLoading) {
    return;
  }
  dispatch(requestDraftPlansStart());
  try {
    const result = await getDraftPlans(currency);
    dispatch(requestDraftPlansSuccess(result));
  } catch (e) {
    console.error('error', e);
    dispatch(requestDraftPlansFail(e));
  }
};

export const requestMerchantInfo = id => async (dispatch, state) => {
  if (state.isRequestLoading) {
    return;
  }
  dispatch(requestMerchantInfoStart());
  try {
    const result = await getMerchantInfo(id);
    dispatch(requestMerchantInfoSuccess(result));
  } catch (e) {
    console.error('error', e);
    dispatch(requestMerchantInfoFail(e));
  }
};

export const pollDraftStatus = id => async (dispatch, getState) => {
  const state = getState();
  let status = null;
  try {
    const { currentDraftStatus } = state.scanner;
    while (currentDraftStatus === DRAFT_STATUS_PENDING_MERCHANT
      || currentDraftStatus === DRAFT_STATUS_PENDING_PAYMENT) {
      const curr = await getDraft(id);
      status = curr.data.status;
      if (status === DRAFT_STATUS_PENDING_PAYMENT) {
        // Don't stop polling if pending pay
        dispatch(setCurrentDraftStatus(status));
        dispatch(updateDraftData(curr.data));
      } else if (status !== DRAFT_STATUS_PENDING_MERCHANT
        && status !== DRAFT_STATUS_IN_PROGRESS) {
        dispatch(setCurrentDraftStatus(status));
        dispatch(updateDraftData(curr.data));
        break;
      }
    }
  } catch (e) {
    console.error('error', e);
    dispatch(requestDraftPlansFail(e));
  }
};

export const fetchOrder = (checkoutToken, userId = null) => async (dispatch, getState) => {
  const fullState = getState();
  const state = fullState.application;

  if (state.isOrderLoading && state.checkoutToken === checkoutToken) {
    return;
  }

  dispatch(fetchOrderLoading(checkoutToken));

  try {
    const result = await getOrder(checkoutToken, userId);
    if (result.status === FAILED_CHECKOUT_STATUS) {
      dispatch(fetchOrderFail());
    } else {
      dispatch(fetchOrderSuccess(result));
    }
  } catch (e) {
    const { code } = get(e, 'response.data', {});
    if (code) {
      dispatch(fetchOrderFail(e));
      return;
    }
    let tryCount = 0;
    const handler = setInterval(async () => {
      try {
        const result = await getOrder(checkoutToken, userId);
        dispatch(fetchOrderSuccess(result));
        clearInterval(handler);
      } catch (eInner) {
        if (tryCount >= 4) {
          clearInterval(handler);
          dispatch(fetchOrderFail(eInner));
          return;
        }
        tryCount += 1;
      }
    }, 1500);
  }
};

export const fetchGCOrder = checkoutId => async dispatch => {
  dispatch(fetchGCOrderStart());
  try {
    const result = await fetchGCOrderDetails(checkoutId);
    dispatch(fetchGCOrderSuccess(result));
  } catch (e) {
    console.warn('MAF Gift Card checkout failed --- ', e);
    dispatch(fetchGCOrderFail());
  }
};

export const fetchOrderEstimations = (total, currency, merchantId, userId) => async dispatch => {
  dispatch(fetchOrderEstimationsStart());
  try {
    const result = await fetchEstimations(total, currency, merchantId, userId);
    dispatch(fetchOrderEstimationsSuccess(result));
  } catch (e) {
    console.warn('Fetch order estimations failed --- ', e);
    dispatch(fetchOrderEstimationsFail());
  }
};
