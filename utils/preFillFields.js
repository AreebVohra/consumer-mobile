import { useSelector } from 'react-redux';
import get from 'lodash/get';
import codeList from './countryCodes';

export default (appState) => {
  if (!appState) {
    appState = useSelector(state => state.application);
  }
  const customer = get(appState, 'currentUser', {});
  const billingAddress = get(appState, 'order.order.billingAddress', {}) || {};

  const {
    line1,
    line2,
    line3,
    line4,
    postcode,
    country: country2Digit,
  } = billingAddress;

  const country = (codeList.find(c => c['alpha-2'] === country2Digit) || {})['alpha-3'] || 'ARE';

  const address2 = line2 && line3 ? [line2, line3].join(', ') : line2 || line3;
  const fullAddress = address2 ? `${line1}, ${address2}` : line1 || '';
  return {
    firstName: get(customer, 'firstName', '') || '',
    lastName: get(customer, 'lastName', '') || '',
    phone: get(customer, 'phoneNumber', '') || '',
    email: get(customer, 'email', '') || '',
    fullAddress,
    city: line4 || '',
    country,
    postcode: postcode || '',
  };
};
