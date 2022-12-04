/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import NfcManager from 'react-native-nfc-manager';

const nfcIdInitialState = {
  hasNfcScan: false,
  requiresNfcScan: false,
  nfcScanBlocked: false,
  nfcStatusResolved: false,
  nfcSupported: false,
  nfcHardwareStatusResolved: false,
  requiresNidScan: false,
  getNfcStatusResolved: false,
};

const nfcId = createSlice({
  name: 'nfcId',
  initialState: nfcIdInitialState,
  reducers: {
    setNfcStatusResolved(state, { payload }) {
      return {
        ...state,
        nfcStatusResolved: payload,
      };
    },
    setNfcHardwareStatus(state, { payload }) {
      return {
        ...state,
        nfcHardwareStatusResolved: true,
        ...payload,
      };
    },

  },
});

export default nfcId.reducer;

export const {
  setNfcStatus, setNfcStatusResolved, setNfcHardwareStatus,
} = nfcId.actions;

export const getNfcHardwareStatus = (country = 'uae') => async (dispatch, getState) => {
  const load = { nfcSupported: false };
  try {
    load.nfcSupported = await NfcManager.isSupported();
    load.nfcSupported = load.nfcSupported && !(Platform.OS.toLowerCase() === 'ios' && Platform.Version.toString().includes('15.4'));
  } catch (e) {
    console.error('error', e);
  }
  dispatch(setNfcHardwareStatus(load));
};
