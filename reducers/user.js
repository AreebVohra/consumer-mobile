import { createSlice } from '@reduxjs/toolkit';
import { getCashbackList } from '../api';
import { userCashbackSerializer } from './application/serializers';

const userInitialState = {
  persistedLoginAttempted: false,
  isLoggedIn: false,
  token: null,
  email: null,
  currentUserCashback: {
    cashbacks: [],
    total: 0.0,
    bankWithdrawalTotal: 0.0
  },
  cashbackResolved: false,
};

const user = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    setUserLoginData(state, { payload }) {
      const { email, isLoggedIn, token } = payload;

      return {
        ...state,
        isLoggedIn,
        token,
        email,
      };
    },
    setPersistedLoginAttempted(state, { payload }) {
      const { persistedLoginAttempted } = payload;
      return {
        ...state,
        persistedLoginAttempted,
      };
    },
    resetUserData(state) {
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        email: null,
      };
    },
    getUserCashbackStart(state) {
      return {
        ...state,
        cashbackResolved: false,
      };
    },
    getUserCashbackSuccess(state, { payload }) {
      return {
        ...state,
        currentUserCashback: userCashbackSerializer(payload),
        cashbackResolved: true,
      };
    },
    getUserCashbackFail(state) {
      return {
        ...state,
        cashbackResolved: true,
      };
    },
  },
});

export default user.reducer;

export const {
  setUserLoginData, setPersistedLoginAttempted, resetUserData, getUserCashbackStart, getUserCashbackSuccess, getUserCashbackFail,
} = user.actions;

export const resetUserDataDataAndTriggerEvent = () => async (dispatch, getState) => {
  dispatch(resetUserData());
};

export const retrieveConsumerCashbacks = () => async dispatch => {
  dispatch(getUserCashbackStart());
  try {
    const cashbacks = await getCashbackList();
    dispatch(getUserCashbackSuccess(cashbacks));
  } catch (e) {
    console.warn('Failed to obtain consumer cashbacks');
    dispatch(getUserCashbackFail());
  }
};
