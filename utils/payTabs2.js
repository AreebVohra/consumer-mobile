/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import config from 'utils/config';
import { StatusBar } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { getPaytabsPaymentLink } from 'api';

// eslint-disable-next-line max-len
export const fetchPayTabs2URI = async (currentUser, setPayTabsUri, setPayTabsLoading, t, language, initRequestData = null) => {
  setPayTabsLoading(true);

  const {
    email,
    userId,
    firstName,
    lastName,
    phoneNumber,
  } = currentUser;

  const baseURl = config('public_api_base_url');

  const requestData = initRequestData || {
    tran_type: 'auth',
    tran_class: 'ecom',
    cart_description: `${userId}|${email}|signup`,
    cart_currency: 'AED',
    cart_amount: 1.00,
    cart_id: `${userId}`,
    customer_details: {
      email: email || 'spotiiunspecified@spotii.me',
      name: `${firstName} ${lastName}`,
      phone: phoneNumber, // Phone and email are hidden, yet mandatory
      street1: 'Spotii address',
      city: 'Dubai',
      state: 'du',
      country: 'AE',
      zip: '12345',
    },
    show_save_card: false,
    callback: `${baseURl}/${config('paytabs_callback_path')}`,
    return: `${baseURl}/${config('paytabs_redirect_path')}?to=settings`,
    hide_shipping: true,
    framed: true,
    framed_return_parent: true,
  };

  try {
    const response = await getPaytabsPaymentLink(requestData);

    setPayTabsUri(response.redirect_url);
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
