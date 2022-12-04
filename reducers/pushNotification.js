/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import { postInitPushToken, patchPushToken } from 'api';
import appConfig from '../app.json';

const pushTokenInitialState = {
  token: null,
  device_id: null,
  permissionGranted: false,
};

const pushNotification = createSlice({
  name: 'pushToken',
  initialState: pushTokenInitialState,
  reducers: {
    createInitPushTokenSuccess(state, { payload }) {
      return {
        ...state,
        token: payload.expo_push_token,
        device_id: payload.device_id,
        permissionGranted: true,
      };
    },
    setPermission(state, { payload }) {
      return {
        ...state,
        permissionGranted: payload.permissionGranted,
      };
    },
  },
});

export default pushNotification.reducer;

export const {
  createInitPushTokenSuccess,
  setPermission,
} = pushNotification.actions;

export const createInitPushToken = token => async (dispatch, state) => {
  const data = {
    expo_push_token: token,
    os_type: Platform.OS.toUpperCase(),
    os_version: Platform.Version,
    app_slug: appConfig.expo.slug,
    app_version: appConfig.expo.version,
  };

  try {
    const result = await postInitPushToken(data);
    console.log(result, 'result');
    dispatch(createInitPushTokenSuccess(result));
  } catch (e) {
    console.error('error', e);
  }
};

export const updateInitPushToken = () => async (dispatch, getState) => {
  const state = getState().pushNotification;
  const data = {
    expo_push_token: state.token,
    os_type: Platform.OS.toUpperCase(),
    os_version: Platform.Version,
    app_slug: appConfig.expo.slug,
    app_version: appConfig.expo.version,
  };

  try {
    const result = await patchPushToken(state.token, data);
  } catch (e) {
    console.error('error', e);
  }
};
