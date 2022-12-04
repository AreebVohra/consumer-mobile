/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';

export const AppStateType = {
  isResolved: PropTypes.bool.isRequired,

  redirectData: PropTypes.shape({
    redirect_url: PropTypes.string,
    transaction_id: PropTypes.string,
  }),

  installmentData: PropTypes.shape({
    payWhat: PropTypes.string,
    orderId: PropTypes.string,
    amount: PropTypes.number,
    nextInstallmentId: PropTypes.string,
  }),
};

const vgsInitialState = {
  isResolved: false,
  redirectData: null,
  installmentData: {},
};

const vgs = createSlice({
  name: 'vgs',
  initialState: vgsInitialState,
  reducers: {
    setRedirectData(state, { payload }) {
      return {
        ...state,
        isResolved: true,
        redirectData: payload,
      };
    },
    setInstallmentData(state, { payload }) {
      return {
        ...state,
        installmentData: payload,
      };
    },
    resetRedirectData(state) {
      return {
        ...vgsInitialState,
      };
    },
  },
});

export default vgs.reducer;

export const { setRedirectData, setInstallmentData, resetRedirectData } = vgs.actions;
