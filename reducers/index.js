import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import test from './test';
import application from './application';
import language from './language';
import user from './user';
import registration from './registration';
import recovery from './recovery';
import nextPayments from './nextPayments';
import directory from './directory';
import billingAddresses from './billingAddresses';
import instalments from './instalments';
import paymentMethods from './paymentMethods';
import orderDetails from './orderDetails';
import checkout from './checkout';
import scanner from './scanner';
import pushNotification from './pushNotification';
import paytabs2 from './paytabs2';
import lean from './lean';
import nfcId from './nfcId';
import vgs from './vgs';

const persistConfigLanguage = {
  key: 'language',
  storage: AsyncStorage,
  whitelist: [],
};

const rootReducer = combineReducers({
  test,
  application,
  language,
  user,
  registration,
  recovery,
  nextPayments,
  billingAddresses,
  instalments,
  paymentMethods,
  orderDetails,
  checkout,
  scanner,
  pushNotification,
  paytabs2,
  directory,
  lean,
  nfcId,
  vgs,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['directory'],
};

const persistedRootReducer = persistReducer(persistConfig, rootReducer);

export default persistedRootReducer;
