/* eslint-disable max-len */
import { parseLinkHeader } from 'utils/misc';
import request, { axiosInstance, googleStorageApiInstance } from './request';
import {
  NFC_SERVICE_AUTH_URL,
  NFC_SERVICE_RISK_STATUS_URL,
  NFC_SERVICE_RISK_PROCESSING_URL,
  SEND_OTP_LOGIN,
} from './auth';
// import blobDownloadAs from './blobDownloadAs';
import { getPageCount } from './pagination';
import { LANGUAGES } from '../utils/constants';

export const verifyUser = data => request.post('/user/verify/', data);
export const updateUser = data => request.post('/user/update_details/', data);

const pagginagtionResponse = res => {
  const pageLinks = parseLinkHeader(res.headers.link);

  // const pageLinks = parseLink(res.headers.link);
  const pageCount = getPageCount(pageLinks);
  const { data } = res;
  return {
    pageLinks,
    pageCount,
    data,
  };
};

export const getInstallmentsList = ({ page, limit = 12, status }) => {
  const queryParams = {
    page,
    per_page: limit,
    status,
  };
  return request.get('/installments/', queryParams).then(pagginagtionResponse);
};

export const getInstallmentsDetails = id => request.get(`/installments/${id}/`).then(resp => resp.data);

export const getOrdersList = () => request.get('/orders/').then(resp => resp.data);

export const getOrderDetails = id => request.get(`/orders/${id}/`).then(resp => resp.data);

export const setInstallmentsPaymentMethod = (id, paymentMethodId) => request
  .patch(`/orders/${id}/payment_method/`, { payment_method_id: paymentMethodId })
  .then(resp => resp.data);

export const payInstallment = (isCashback = false, id, paymentMethodId, setDefault) => request
  .post(
    `/installment/${id}/pay/`,
    paymentMethodId
      ? {
        payment_method_id: paymentMethodId,
        is_default: setDefault,
        is_cashback: isCashback,
      }
      : null,
  )
  .then(resp => resp.data);

export const payAllInstallments = (
  isCashback = false,
  accountId,
  parentInstallmentIds,
  paymentMethodId,
  setDefault,
) => request
  .post(
    `/installments/${accountId}/pay_all/`,
    {
      payment_method_id: paymentMethodId || null,
      is_default: paymentMethodId ? setDefault : null,
      parent_installment_ids: parentInstallmentIds,
      is_cashback: isCashback,
    },
  )
  .then(resp => resp.data);

export const getPaytabsPaymentLink = data => request.post('/paytabs2/', data).then(resp => resp.data);

// setting the query param would return all the payment-methods, including the ones with autoDebit set to false
export const getPaymentMethods = filterValue => request
  .get(
    '/payment-methods/',
    filterValue
      ? {
        set: filterValue,
      }
      : null,
  )
  .then(resp => resp.data);

export const getBillingAddresses = () => request.get('/billing-addresses/').then(resp => resp.data);

export const addBillingAddress = data => request.post('/billing-addresses/', data).then(resp => resp.data);

export const deleteBillingAddress = id => request.del(`/billing-addresses/${id}/`).then(resp => resp.data);

export const updateBillingAddress = (id, data) => request.patch(`/billing-addresses/${id}/`, data).then(resp => resp.data);

export const setDefaultBillingAddress = id => request.patch(`/billing-addresses/${id}/`, { is_default: true }).then(resp => resp.data);

export const attachCard = data => request.post('/payment-methods/', data);

export const deletePaymentMethod = id => request.del(`/payment-methods/${id}/`);

export const setDefaultPaymentMethod = id => request.patch(`/payment-methods/${id}/`, { is_default: true });

export const getMerchantsList = limit => request
  .get('/directory/', {
    per_page: limit,
    display_picture__isnull: false,
    logo__isnull: false,
  })
  .then(resp => resp.data);

export const getNextPayments = options => request.get('/installment/', options).then(resp => resp.data);

// export const getDirectory = options => request.getNoToken('/directory/', options).then(resp => resp.data);

export const getAllMerchantDetails = (language) => {
  if (language === LANGUAGES.EN) {
    return googleStorageApiInstance.get('/merchant-shop-directory-lec-en.json').then(resp => resp.data);
  }
  return googleStorageApiInstance.get('/merchant-shop-directory-lec-ar.json').then(resp => resp.data);
};

// export const downloadInvoice = (id, name) => request
//   .send({
//     url: `/orders/${id}/invoice/`,
//     method: 'GET',
//     responseType: 'blob',
//   })
//   .then(blobDownloadAs(`${name}.pdf`));

export const getOrder = (checkoutToken, userId = null) => axiosInstance
  .get(`/checkouts/${checkoutToken}/${userId ? `?userId=${userId}` : ''}`)
  .then(resp => resp.data);

export const confirmOrder = (checkoutToken, planId, paymentMethodId) => request
  .patch(`/checkouts/${checkoutToken}/confirm/`, {
    plan_id: planId,
    payment_method_id: paymentMethodId,
  })
  .then(resp => resp.data);

export const createDraftOrder = (checkoutToken, planId, paymentMethodId, pt2Request) => request
  .patch(`/checkouts/${checkoutToken}/confirm_no_card/`, {
    plan_id: planId,
    payment_method_id: paymentMethodId,
    pt2_request: pt2Request,
  })
  .then(resp => resp.data);

export const preaprove = checkoutToken => request.get(`/checkouts/${checkoutToken}/preapproval/`).then(resp => resp.data);

export const postDraftCheckout = data => request.post('/drafts/', data).then(resp => resp.data);
export const getDraftPlans = currency => request.post(`/drafts/get_plans/?currency=${currency}&amount=200/`).then(resp => resp.data);
export const getDraft = id => request.get(`/drafts/${id}/`);
export const patchDraftPlan = (id, data) => request.patch(`/drafts/${id}/`, data).then(resp => resp.data);
export const getMerchantInfo = id => request.get(`/merchant/info/?merchant_id=${id}/`).then(resp => resp.data);

export const getConsumerScore = userId => request.post('/consumer-score/', { consumer_id: userId }).then(resp => resp.data);

export const postLinkedIn = formData => request.post('/consumer-risk-data-upload/', formData).then(resp => resp.data);

export const postInitPushToken = data => axiosInstance.post('/mobile/init_device/', data).then(resp => resp.data);
export const patchPushToken = (expoToken, data = {}) => request.patch(`/mobile/${expoToken}/update_device/`, data).then(resp => resp.data);

export const getConsumerSpendLimit = (
  merchantId = null,
  currency = null,
  consumerId = null,
  employeeId = null,
  gcType = null,
) => request.post(
  '/consumer-score/get_merchant_spend_limit/',
  {
    merchant_id: merchantId, currency, consumer_id: consumerId, employee_id: employeeId, gc_type: gcType,
  },
).then(resp => resp.data);

export const getLeanCustomer = data => request.post('/lean/', data).then(resp => resp.data);

export const deleteLeanEntity = data => request
  .post('/lean/delete_entity/', {
    customer_id: data,
  })
  .then(resp => resp.data);

export const postTMSession = (data = {}) => axiosInstance.post('/tm-session/init/', data).then(res => res.data);
export const patchTMSessionUser = id => request.patch(`/tm-session/${id}/patch_user/`).then(res => res.data);
export const getCashbackList = () => request.get('/cashback/').then(resp => resp.data);

export const sendBankWithdrawRequest = data => request.post('/cashback/withdraw_req/', data).then(resp => resp.data);
export const smartSearch = data => axiosInstance.post('/directory/search/', data).then(resp => resp.data);

// export const getNfcAuthToken = () =>

export const getNfcAuthToken = () => request.get(NFC_SERVICE_AUTH_URL).then(resp => resp.data);
export const getNfcStatus = (data = { country: 'uae' }) => request.post(NFC_SERVICE_RISK_STATUS_URL, data)
  .then(resp => resp.data);
export const postNfcData = data => request.post(NFC_SERVICE_RISK_PROCESSING_URL, data)
  .then(resp => resp.data);
export const giftCardCheckout = data => request.post('/checkouts/gc_checkout/', data).then(resp => resp.data);
export const fetchGCOrderDetails = checkoutId => request
  .get('/checkouts/gc_checkout/', {
    checkout_id: checkoutId,
  })
  .then(resp => resp.data);

export const fetchEstimations = (total, currency, merchantId, userId) => request
  .post('/estimations/', {
    total,
    currency,
    merchant_id: merchantId,
    user_id: userId,
  })
  .then(resp => resp.data);

export const sendOTPForLogin = (data) => axiosInstance
  .post(SEND_OTP_LOGIN, {
    email: data.email,
    phone_number: data.phoneNumber,
    resend: data.resend,
  })
  .then((res) => res.data);

export const getCurrencyConversions = () => request.get('/estimations/conversions/').then(resp => resp.data);
export const deleteUserAccount = userId => request.del(`/user/${userId}/`).then(resp => resp.data);

// vgs endpoint constants
export const confirmVgsURL = checkoutToken => `/api/v1.0/checkouts/${checkoutToken}/confirm_new_card/`;
export const addCardVgsURL = `/api/v1.0/vgs/add_card/?mobile=${true}`;
export const payPendingVgsURL = orderId => `/api/v1.0/vgs/${orderId}/pay_pending/?mobile=${true}`;
