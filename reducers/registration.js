/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { setCurrentUserVerificationUrl } from 'reducers/application';
import authApi from 'api/auth';

const registrationInitialState = {
  token: null,
  email: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  dateOfBirth: '',
  isLoading: false,
  isFinalized: false,
  isPopulated: false,
  country: '',
};

const registration = createSlice({
  name: 'registration',
  initialState: registrationInitialState,
  reducers: {
    startFinalization(state) {
      state.isLoading = true;
    },
    successFinalization(state) {
      return {
        ...state,
        isFinalized: true,
        isLoading: true,
      };
    },
    failFinalization(state) {
      state.isLoading = false;
    },
    clearRegistration() {
      return {
        isLoading: false,
        isFinalized: false,
      };
    },
    setRegistrationFields(state, { payload }) {
      const data = {
        ...state,
        ...payload,
        isPopulated: true,
      };
      return data;
    },
    setToken(state, { payload }) {
      const data = {
        ...state,
        ...payload,
      };
      return data;
    },
    setCountry(state, { payload }) {
      const { country } = payload;
      state.country = country;
    },
    setPhoneNumber(state, { payload }) {
      return {
        ...state,
        phoneNumber: payload,
      };
    },
  },
});

export default registration.reducer;

export const {
  setToken,
  setRegistrationFields,
  setCountry,
  startFinalization,
  successFinalization,
  failFinalization,
  clearRegistration,
  setPhoneNumber,
} = registration.actions;

export const finalizeRegistration = registrationToken => async (dispatch, state) => {
  if (state.isLoading) {
    return;
  }
  dispatch(startFinalization());
  try {
    await authApi.loginWithToken(registrationToken);
    dispatch(successFinalization());
    dispatch(setToken({ token: registration }));
  } catch (e) {
    dispatch(failFinalization(e));
    throw new Error(e);
  }
};

export const loginWithCreatedUser = registrationToken => async (dispatch, getState) => {
  const state = getState();

  try {
    const resp = await authApi.loginWithToken(registrationToken);
    dispatch(setCurrentUserVerificationUrl({ url: resp.verification_url }));
  } catch (e) {
    dispatch(failFinalization(e));
    console.error("err", e);
  }
};
