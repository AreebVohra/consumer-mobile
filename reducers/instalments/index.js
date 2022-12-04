/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { getInstallmentsList } from 'api';
import {
  INSTALLMENTS_STATUS_ACTIVE,
} from 'utils/constants';
import { installmentsSerializer } from './serializers';

const installmentsInitialState = {
  isLoading: false,
  isResolved: false,

  // Paggination
  pageCount: 0,
  currentPage: null,

  // Orders List
  list: [],
  listLength: 0,

  // Selection
  selected: [],
  selectionMode: false,

  // Tabs
  fetchParamsStatus: INSTALLMENTS_STATUS_ACTIVE,
  currentTab: 'Active',

  // current
  currentOrder: null,
  moreItems: false,

  orderInfo: null,
  // this one is set when the payment is successful, then we need to refresh the orders list to reflect the payed installment
  isPaymentTried: false,
};

const installments = createSlice({
  name: 'installments',
  initialState: installmentsInitialState,
  reducers: {
    fetchInstallmentsStart(state) {
      return {
        ...state,
        isLoading: true,
        selected: [],
      };
    },
    fetchInstallmentsSuccess(state, { payload }) {
      const { pageCount, data } = payload;
      return {
        ...state,
        isLoading: false,
        isResolved: true,
        isSuccess: true,
        listLength: state.listLength + data.length,
        pageCount,
        list: [...state.list, ...installmentsSerializer(data, state.selected)],
      };
    },
    fetchInstallmentsFail(state) {
      return {
        ...state,
        isLoading: false,
        isResolved: true,
        isSuccess: false,
        listLength: 0,
      };
    },
    select(state, { payload }) {
      const selectedId = payload;
      state.selectionMode = true;
      state.list = state.list.map(item => {
        if (item.installmentsId === selectedId) {
          state.selected.push(item);
          return {
            ...item,
            selected: true,
          };
        }
        return item;
      });
    },
    deselect(state, { payload }) {
      const deselectedId = payload;
      state.selected = state.selected.filter(item => item.installmentsId !== deselectedId);
      state.selectionMode = !!state.selected.length;
      state.list = state.list.map(item => {
        if (item.installmentsId === deselectedId) {
          return {
            ...item,
            selected: false,
          };
        }
        return item;
      });
    },
    changeTab(state, { payload }) {
      const { fetchParamsStatus, currentPage, currentTab } = payload;
      return {
        ...state,
        fetchParamsStatus,
        currentPage,
        currentTab,
      };
    },
    deselectAll(state) {
      return {
        ...state,
        selected: [],
        selectionMode: false,
        list: state.list.map(item => ({
          ...item,
          selected: false,
        })),
      };
    },
    changePage(state, { payload }) {
      const { currentPage } = payload;
      return {
        ...state,
        currentPage,
      };
    },
    setCurrentOrder(state, { payload }) {
      const { currentOrder } = payload;
      return {
        ...state,
        currentOrder,
      };
    },
    setOrderInfo(state, { payload }) {
      return {
        ...state,
        orderInfo: payload,
      };
    },
    setIsPaymentTried(state, { payload }) {
      return {
        ...state,
        isPaymentTried: payload,
      };
    },
    refreshReset(state) {
      return {
        ...state,
        isSuccess: false,
        isLoading: false,
        isResolved: false,
        pageCount: 0,
        currentPage: null,
        list: [],
        listLength: 0,
        selected: [],
        selectionMode: false,
        currentOrder: null,
        isPaymentTried: false,
      };
    },
  },
});

export default installments.reducer;

export const {
  fetchInstallmentsStart,
  fetchInstallmentsSuccess,
  fetchInstallmentsFail,
  select,
  deselect,
  deselectAll,
  refreshReset,
  changePage,
  changeTab,
  setCurrentOrder,
  setOrderInfo,
  setIsPaymentTried,
} = installments.actions;

export const fetchInstallments = (params = {}) => async (dispatch, state) => {
  if (state.isLoading) {
    return;
  }
  dispatch(fetchInstallmentsStart());
  try {
    const result = await getInstallmentsList(params);
    dispatch(fetchInstallmentsSuccess(result));
  } catch (e) {
    console.error('fetch installments failed', e);
    dispatch(fetchInstallmentsFail(e));
  }
};
