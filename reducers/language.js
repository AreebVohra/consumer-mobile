/* eslint-disable no-underscore-dangle */
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'services/i18n';
import { fetchMerchantDetailsList } from 'reducers/directory';

const languageInitialState = {
  isLanguageSet: false,
  language: 'en',
};

const language = createSlice({
  name: 'language',
  initialState: languageInitialState,
  reducers: {
    _changeLanguage(state, { payload }) {
      const { lang } = payload;
      i18n.changeLanguage(lang);
      return {
        ...state,
        language: lang,
        isLanguageSet: true,
      };
    },
  },
});

export default language.reducer;

export const { _changeLanguage } = language.actions;

export const changeLanguage = payload => async (dispatch, state) => {
  const { lang, shouldFetchMerchantDetailsList = false } = payload;
  try {
    await AsyncStorage.setItem('spotii-consumer-mobile-language', lang);
    dispatch(_changeLanguage({ lang }));
    if (shouldFetchMerchantDetailsList) {
      dispatch(fetchMerchantDetailsList(lang));
    }
  } catch (e) {
    console.error('change language error', e);
    throw new Error(e);
  }
};
