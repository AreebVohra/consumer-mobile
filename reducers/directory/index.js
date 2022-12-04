import { createSlice } from '@reduxjs/toolkit';
import { getAllMerchantDetails, smartSearch } from 'api';
import { MAF_MERCHANT_ID, LEC_MERCHANT_ID } from 'utils/constants';
import { merchantDetailsSerializer } from './serializers';

const directoryInitialState = {
  isLoading: false,
  detailsIsResolved: false,
  list: [],
  allMerchantDetails: {},
  carouselMerchants: [],
  langOfLastLoad: null,
  filteredCategories: [],
  filteredCountry: null,
  recommendedMerchants: [],
};

const directory = createSlice({
  name: 'directory',
  initialState: directoryInitialState,
  reducers: {
    fetchMerchantDetailsListStart(state) {
      return {
        ...state,
        isLoading: true,
      };
    },
    fetchMerchantDetailsListSuccess(state, { payload }) {
      const allMerchantDetails = merchantDetailsSerializer(payload.list);
      if (payload.phoneNumber && payload.phoneNumber.includes('+971')) {
        allMerchantDetails.categories = allMerchantDetails.categories.filter(({ slug }) => slug !== 'affiliate');
      }

      return {
        ...state,
        isLoading: false,
        detailsIsResolved: true,
        allMerchantDetails,
        filteredCategories: [],
        langOfLastLoad: payload.lang,
      };
    },
    fetchMerchantDetailsListFail(state) {
      return {
        ...state,
        isLoading: false,
        detailsIsResolved: false,
      };
    },
    updateFilteredCategories(state, { payload }) {
      return {
        ...state,
        filteredCategories: payload,
      };
    },
    updateFilteredCountry(state, { payload }) {
      return {
        ...state,
        filteredCountry: payload,
      };
    },
    resetFilteredCountry(state) {
      return {
        ...state,
        filteredCountry: null,
      };
    },
    resetFilteredCategories(state) {
      return {
        ...state,
        filteredCategories: [],
      };
    },
    reset() {
      return directoryInitialState;
    },
    setRecommendedMerchants(state, { payload }) {
      const { merchants } = state.allMerchantDetails;
      const { promoted } = payload.payload;
      const recommended = payload.payload.recommended.filter((r) => !promoted.includes(r));
      const both = promoted.concat(recommended);

      let ordered = both.map((rId) => {
        const m = merchants.find(({ merchantIds }) => merchantIds.includes(rId));
        if (m) {
          return m;
        }
      });

      ordered = ordered.filter((o) => o !== undefined);
      return {
        ...state,
        recommendedMerchants: ordered,
      };
    },
    setCarouselMerchants(state, { payload }) {
      const { merchants, filteredCountry, allowGiftCardCheckout = false, allowLecCardCheckout = false } = payload;

      let carMerchants = merchants.filter(merchant => (
        merchant.showCarousel
        && (filteredCountry ? merchant.deliveringTo.includes(filteredCountry) : true)
      ));

      let lecGCTile = null;
      let mafTile = null;

      if (allowLecCardCheckout) {
        lecGCTile = carMerchants.find(merchant => merchant.merchantId === LEC_MERCHANT_ID);
        carMerchants = !allowGiftCardCheckout ? carMerchants.filter(merchant => ![MAF_MERCHANT_ID, LEC_MERCHANT_ID].includes(merchant.merchantId)) : carMerchants.filter(merchant => merchant.merchantId !== LEC_MERCHANT_ID);
      }
      if (allowGiftCardCheckout) {
        mafTile = carMerchants.find(merchant => merchant.merchantId === MAF_MERCHANT_ID);
        carMerchants = !allowLecCardCheckout ? carMerchants.filter(merchant => ![MAF_MERCHANT_ID, LEC_MERCHANT_ID].includes(merchant.merchantId)) : carMerchants.filter(merchant => merchant.merchantId !== MAF_MERCHANT_ID);
      }
      if (!allowGiftCardCheckout && !allowLecCardCheckout) {
        carMerchants = carMerchants.filter(merchant => ![MAF_MERCHANT_ID, LEC_MERCHANT_ID].includes(merchant.merchantId));
      }
      carMerchants = [lecGCTile, mafTile].filter(e => e).concat(carMerchants);

      return {
        ...state,
        carouselMerchants: carMerchants,
      };
    },
  },
});

export default directory.reducer;

export const {
  fetchMerchantDetailsListStart,
  fetchMerchantDetailsListSuccess,
  fetchMerchantDetailsListFail,
  updateFilteredCategories,
  updateFilteredCountry,
  resetFilteredCountry,
  resetFilteredCategories,
  reset,
  setRecommendedMerchants,
  setCarouselMerchants,
} = directory.actions;

export const fetchMerchantDetailsList = (language, phoneNumber = null) => async (dispatch, getState) => {
  // // const state = getState().directory;

  // // if ((state.isLoading || state.detailsIsResolved) && state.langOfLastLoad === language) {
  // //   return;
  // // }

  dispatch(fetchMerchantDetailsListStart());
  try {
    const allMerchantDetails = await getAllMerchantDetails(language);
    dispatch(fetchMerchantDetailsListSuccess({ list: allMerchantDetails, lang: language, phoneNumber }));
  } catch (e) {
    dispatch(fetchMerchantDetailsListFail(e));
  }
};

export const fetchRecommendedMerchants = (userId) => async (dispatch, getState) => {
  try {
    const resp = await smartSearch({ consumer_id: userId });
    dispatch(setRecommendedMerchants(resp));
  } catch (e) {
    console.warn('Recommended merchants not fetched--- ', e);
  }
};
