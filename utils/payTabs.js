/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import config from 'utils/config';
import { StatusBar } from 'react-native';
import { showMessage } from 'react-native-flash-message';

// eslint-disable-next-line max-len
export const fetchPayTabsURI = async (currentUser, setPayTabsUri, setPayTabsLoading, t, language) => {
  setPayTabsLoading(true);

  const data = {
    merchant_email: config('paytabs_merchant_email'),
    secret_key: config('paytabs_secret_key_uae'),
    currency: 'AED',
    amount: 1.00,
    site_url: 'https://spotii.me',
    title: 'Attach Card',
    quantity: '1',
    unit_price: '1',
    products_per_title: '1',
    return_url: config('paytabs_callback_url'),
    cc_first_name: currentUser.firstName,
    cc_last_name: currentUser.lastName,
    cc_phone_number: '00971',
    phone_number: '111111111',
    billing_address: 'GCC',
    city: 'Dubai',
    state: 'Dubai',
    postal_code: '00000',
    country: 'ARE',
    email: currentUser.email || 'spotiiunspecified@spotii.me',
    ip_customer: '000.000.000.000',
    ip_merchant: '000.000.000.001',
    address_shipping: 'GCC',
    city_shipping: 'Dubai',
    state_shipping: 'Dubai',
    postal_code_shipping: '00000',
    country_shipping: 'ARE',
    other_charges: 0.00,
    reference_no: `${currentUser.userId}|${currentUser.email}|mobile`,
    msg_lang: language,
    cms_with_version: 'none',
    is_tokenization: 'TRUE',
    is_existing_customer: 'FALSE',
    is_preauth: 1,
  };

  const formData = new FormData();

  Object.keys(data).forEach(key => formData.append(key, data[key]));

  try {
    const response = await axios.post('https://www.paytabs.com/apiv2/create_pay_page', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    setPayTabsUri(response.data.payment_url);
    setPayTabsLoading(false);
  } catch (e) {
    setPayTabsUri(null);
    setPayTabsLoading(false);
    console.error('paytabs 2 uri error:', e);
    showMessage({
      message: t('errors.somethingWrongContactSupport'),
      backgroundColor: '#FFFFFF',
      color: '#FF4D4A',
      statusBarHeight: StatusBar.currentHeight,
      style: {
        borderColor: '#FF4D4A',
        alignItems: `flex-${language === 'ar' ? 'end' : 'start'}`,
        textAlign: language === 'ar' ? 'right' : 'left',
        borderLeftWidth: language === 'ar' ? 0 : 2,
        borderRightWidth: language === 'ar' ? 2 : 0,
      },
    });
  }
};
