/* eslint-disable no-inner-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
import { Platform } from 'react-native';
import { createSlice } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import authApi from 'api/auth';
import * as Analytics from 'expo-firebase-analytics';
import handleLogEvent from 'utils/handleLogEvent';
import { getConsumerScore, getCurrencyConversions } from 'api';
import { GIFT_CARDS } from 'utils/constants';

import appConfig from '../../app.json';
import userSerializer, { userScoreSerializer } from './serializers';
import { getConsumerSpendLimit, giftCardCheckout } from '../../api';
import { setUserLoginData } from '../user';

const STORAGE_CHECKOUT_ID_KEY = 'spotii:checkout';

export const AppStateType = {
  isAuthStatusResolved: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isSidebarOpened: PropTypes.bool.isRequired,
  redirectToPasswordRecovery: PropTypes.bool,
  tmSessionString: null, // pseudo session used for tm
  isConsumerMerchantSpendLimitResolved: PropTypes.bool.isRequired,
  isConsumerMerchantSpendLimitLecResolved: PropTypes.bool.isRequired,
  isMAFQualifiedLoading: PropTypes.bool.isRequired,
  shouldApplyDiscount: PropTypes.bool,
  discountValidity: PropTypes.number,
  consumerMinimumSpendLimit: PropTypes.number,
  remoteMobileConfig: {},

  currentUserScore: PropTypes.shape({
    consumerRating: PropTypes.number,
    consumerSpendLimitCeiling: PropTypes.number,
    consumerSpendLimitFloor: PropTypes.number,
    consumerMerchantSpendLimit: PropTypes.number,
    giftCardStepCount: PropTypes.number,
    mobileLimit: PropTypes.number,
    currency: PropTypes.string,
    uploadedId: PropTypes.bool,
    uploadedLinkedin: PropTypes.bool,
    uploadedSalaryCert: PropTypes.bool,
    uploadedPassport: PropTypes.bool,
    smTagged: PropTypes.bool,
    strongPhistory: PropTypes.bool,
    reason: PropTypes.string,
    merchantSpendLimitReason: PropTypes.string,
    merchantSpendLimitLecReason: PropTypes.string,
    requiresNfcMAF: PropTypes.bool,
  }),

  currentUser: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    userId: PropTypes.string,
    profileId: PropTypes.string,
    registrationStatus: PropTypes.string,
    dateOfBirth: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
  }).isRequired,

  giftCardCheckout: PropTypes.shape({
    checkoutUrl: PropTypes.string,
    isResolved: PropTypes.bool,
    gcType: PropTypes.string,
  }),
  firebaseDynamicLink: PropTypes.string,
  conversions: PropTypes.object,
  showLean: PropTypes.bool,
};

const appInitialState = {
  isAuthStatusResolved: false,
  isAuthenticated: false,
  isSidebarOpened: false,
  redirectToPasswordRecovery: false,
  isConsumerMerchantSpendLimitResolved: false,
  isConsumerMerchantSpendLimitLecResolved: false,
  isMAFQualifiedLoading: true,
  shouldApplyDiscount: false,
  discountValidity: 3,
  consumerMinimumSpendLimit: 750,

  currentUser: {
    firstName: null,
    lastName: null,
    userId: null,
    profileId: null,
    registrationStatus: null,
    dateOfBirth: null,
    email: null,
    phoneNumber: null,
  },
  currentUserScoreLoading: false,
  currentUserScoreResolved: false,
  currentUserScore: {
    consumerRating: null,
    consumerSpendLimitCeiling: null,
    consumerSpendLimitFloor: null,
    consumerMerchantSpendLimit: 3500,
    giftCardStepCount: 50,
    mobileLimit: null,
    currency: null,
    uploadedId: null,
    uploadedLinkedin: null,
    uploadedSalaryCert: null,
    uploadedPassport: null,
    smTagged: null,
    strongPhistory: null,
    reason: '',
    merchantSpendLimitReason: '',
    merchantSpendLimitLecReason: '',
    requiresNfcMAF: false,
    leanCustomerId: null,
    lean: {
      customerId: null,
      entities: [],
    },
  },
  giftCardCheckout: {
    checkoutUrl: null,
    isResolved: false,
    gcType: null,
  },
  firebaseDynamicLink: '',
  conversions: {
    AED: 1.0, SAR: 0.9604, BHD: 9.75, OMR: 9.55, USD: 3.673, KWD: 12.22,
  },
  showLean: false,
};

const application = createSlice({
  name: 'application',
  initialState: appInitialState,
  reducers: {
    authStatusChange(state, { payload }) {
      return {
        ...state,
        isAuthStatusResolved: true,
        isAuthenticated: !!payload,
        currentUser: userSerializer(payload),
      };
    },
    authUserLogIn(state, { payload }) {
      return {
        ...state,
        isAuthStatusResolved: true,
        isAuthenticated: true,
        currentUser: userSerializer(payload),
      };
    },
    authUserLogout(state) {
      return {
        ...state,
        isAuthStatusResolved: true,
        isAuthenticated: false,
        isScoreResolved: false,
        isConsumerMerchantSpendLimitResolved: false,
        currentUser: {},
      };
    },
    resolveOrder(state) {
      state.isOrderResolved = true;
    },
    selectPlan(state, { payload }) {
      state.selectedPlan = payload;
    },
    selectPaymentMethod(state, { payload }) {
      state.selectedPaymentMethod = payload;
    },
    getUserScoreSuccess(state, { payload }) {
      return {
        ...state,
        currentUserScoreLoading: false,
        currentUserScoreResolved: true,
        currentUserScore: {
          ...state.currentUserScore,
          ...userScoreSerializer(payload),
        },
      };
    },
    switchRedirectToPasswordRecovery(state, { payload }) {
      return {
        ...state,
        redirectToPasswordRecovery: payload.switchTo,
      };
    },
    setCurrentUserVerificationUrl(state, { payload }) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          verificationUrl: payload.url,
        },
      };
    },
    setCurrentUserPhoneNumber(state, { payload }) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          phoneNumber: payload.phoneNumber,
        },
      };
    },
    setCurrentUserHasIdentitiesUploaded(state, { payload }) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          hasIdentitiesUploaded: payload,
        },
      };
    },
    setUserScoreLoading(state) {
      state.currentUserScoreLoading = true;
    },
    setTMSessionString(state, { payload }) {
      return {
        ...state,
        tmSessionString: payload,
      };
    },
    setGiftCardCheckout(state, { payload }) {
      return {
        ...state,
        giftCardCheckout: {
          ...state.giftCardCheckout,
          checkoutUrl: payload.checkout_url,
          isResolved: true,
          gcType: payload.gcType,
        },
      };
    },
    setGiftCardCheckoutResolution(state) {
      return {
        ...state,
        giftCardCheckout: {
          ...state.giftCardCheckout,
          isResolved: true,
        },
      };
    },
    resetGiftCardCheckout(state) {
      return {
        ...state,
        giftCardCheckout: {
          checkoutUrl: null,
          isResolved: false,
          gcType: null,
        },
      };
    },
    setIsMAFQualifiedLoading(state, { payload }) {
      return {
        ...state,
        isMAFQualifiedLoading: payload,
      };
    },
    startConsumerSpendLimitFetch(state, { payload }) {
      return {
        ...state,
        currentUserScore: {
          ...state.currentUserScore,
          consumerMerchantSpendLimit: 3500,
          giftCardStepCount: 50,
        },
      };
    },
    setConsumerSpendLimit(state, { payload }) {
      return {
        ...state,
        isConsumerMerchantSpendLimitResolved: true,
        isMAFQualifiedLoading: false,
        shouldApplyDiscount: payload.should_apply_discount || false,
        discountValidity: payload.discount_validity || 3,
        consumerMinimumSpendLimit: payload.consumer_minimum_spend_limit || (payload.gcType ? 300 : 750),
        currentUserScore: {
          ...state.currentUserScore,
          consumerMerchantSpendLimit: Math.min(payload.consumer_spend_limit || 3500, 3500),
          giftCardStepCount: payload.gc_step_amount || 50,
          merchantSpendLimitReason: payload.reason,
          requiresNfcMAF: payload.requires_nfc,
        },
      };
    },
    setConsumerSpendLimitLec(state, { payload }) {
      return {
        ...state,
        isConsumerMerchantSpendLimitLecResolved: true,
        isMAFQualifiedLoading: false,
        shouldApplyDiscount: payload.should_apply_discount || false,
        discountValidity: payload.discount_validity || 3,
        consumerMinimumSpendLimit: payload.consumer_minimum_spend_limit || (payload.gcType ? 300 : 750),
        currentUserScore: {
          ...state.currentUserScore,
          consumerMerchantSpendLimit: Math.min(payload.consumer_spend_limit || 3500, 3500),
          giftCardStepCount: payload.gc_step_amount || 50,
          merchantSpendLimitLecReason: payload.reason,
          requiresNfcMAF: payload.requires_nfc,
        },
      };
    },
    setConsumerMerchantLimitResolved(state) {
      return {
        ...state,
        isConsumerMerchantSpendLimitResolved: true,
      };
    },
    getRemoteMobileConfigSuccess(state, { payload }) {
      return {
        ...state,
        remoteMobileConfig: payload,
      };
    },
    resolveHasIdentitiesAndExpired(state) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          hasIdentitiesUploaded: true,
          isIdExpired: false,
        },
      };
    },
    setFirebaseDynamicLink(state, { payload }) {
      return {
        ...state,
        firebaseDynamicLink: payload,
      };
    },
    resetFirebaseDynamicLink(state) {
      return {
        ...state,
        firebaseDynamicLink: null,
      };
    },
    getCurrencyConversionsSuccess(state, { payload }) {
      return {
        ...state,
        conversions: payload,
      };
    },
    showLeanModal(state, { payload }) {
      return {
        ...state,
        showLean: payload,
      };
    },
    setCurrentUserScoreResolved(state, { payload }) {
      return {
        ...state,
        currentUserScoreResolved: payload,
      };
    },
  },
});

export const {
  authStatusChange,
  authUserLogIn,
  authUserLogout,
  getUserScoreSuccess,
  switchRedirectToPasswordRecovery,
  setCurrentUserVerificationUrl,
  setCurrentUserPhoneNumber,
  setUserScoreLoading,
  setTMSessionString,
  setCurrentUserHasIdentitiesUploaded,
  setGiftCardCheckout,
  setGiftCardCheckoutResolution,
  resetGiftCardCheckout,
  setIsMAFQualifiedLoading,
  startConsumerSpendLimitFetch,
  setConsumerSpendLimit,
  setConsumerSpendLimitLec,
  setConsumerMerchantLimitResolved,
  getRemoteMobileConfigSuccess,
  resolveHasIdentitiesAndExpired,
  setFirebaseDynamicLink,
  resetFirebaseDynamicLink,
  getCurrencyConversionsSuccess,
  showLeanModal,
  setCurrentUserScoreResolved,
} = application.actions;

export const triggerLoginEvent = (payload) => async (dispatch, getState) => {
  const state = getState();

  const { currentUser } = state.application;

  if (currentUser && currentUser.userId) {
    await Analytics.setUserId(currentUser.userId);

    await Analytics.setUserProperties({
      os_type: Platform.OS.toUpperCase(),
      os_version: Platform.Version.toString(),
      app_slug: appConfig.expo.slug,
      app_version: appConfig.expo.version,
    });
  }

  if (payload) {
    await handleLogEvent('SpotiiMobileSignInSuccessful', {
      email: payload.email,
    });
  }

  dispatch(setUserLoginData({
    isLoggedIn: true,
    email: payload.email,
  }));
};

export const refreshUserProfile = () => async dispatch => {
  try {
    const currentUser = await authApi.getProfile();
    dispatch(authStatusChange(currentUser));
  } catch (e) {
    console.error('Failed to refresh users profile information.');
  }
};

export const refreshUserProfileAfterUpload = () => async dispatch => {
  try {
    const currentUser = await authApi.getProfile();
    dispatch(authStatusChange(currentUser));
  } catch (e) {
    console.error('Failed to refresh users profile information.');
  }
};

export const retrieveConsumerScore = user_id => async (dispatch, getState) => {
  const userId = user_id || getState().application.currentUser.userId;
  dispatch(setUserScoreLoading());

  try {
    const currentScore = await getConsumerScore(userId);
    dispatch(getUserScoreSuccess(currentScore));
  } catch (e) {
    console.warn('Failed to obtain users tier score information.');
    const tryCount = 1;

    async function reattemptConsumerScore() {
      for (let i = 0; i < tryCount; i++) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const result = await getConsumerScore(userId);
          dispatch(getUserScoreSuccess(result));
          break;
        } catch (eInner) {
          console.warn('Failed to obtain users tier score information.');
        }
      }
    }

    reattemptConsumerScore();
  }
};

// Fetching Limit for GiftCards
export const retrieveInitConsumerSpendLimit = (gcType = null) => async (dispatch, getState) => {
  const { userId } = getState().application.currentUser;
  dispatch(startConsumerSpendLimitFetch());
  try {
    const resp = await getConsumerSpendLimit(null, null, userId, null, gcType);
    resp.gcType = gcType;
    if (gcType === GIFT_CARDS.LEC) {
      dispatch(setConsumerSpendLimitLec(resp));
    } else {
      dispatch(setConsumerSpendLimit(resp));
    }
  } catch (e) {
    console.warn('Failed to fetch consumer (relative to merchant) spend limit on load --- ', e);
  } finally {
    dispatch(setConsumerMerchantLimitResolved());
  }
};

export const createGiftCardCheckout = data => async dispatch => {
  try {
    const gcCheckoutData = await giftCardCheckout(data);
    gcCheckoutData.gcType = data.gc_type;
    dispatch(setGiftCardCheckout(gcCheckoutData));
  } catch (e) {
    console.warn(`Failed to create Gift Card checkout with data ${data}`);
    dispatch(setGiftCardCheckoutResolution());
  }
};

export const getRemoteMobileConfig = data => async (dispatch, getState) => {
  fetch('https://storage.googleapis.com/consumer_mobile_config/mobile_config.json')
    .then(response => response.json())
    .then(json => dispatch(getRemoteMobileConfigSuccess(json)))
    .catch(error => console.warn('Failed to retrieve remote mobile config'));
};

export const retrieveCurrencyConversions = () => async dispatch => {
  try {
    const currencyConversions = await getCurrencyConversions();
    dispatch(getCurrencyConversionsSuccess(currencyConversions));
  } catch (e) {
    console.warn('Failed to obtain currency conversions');
  }
};

export default application.reducer;
