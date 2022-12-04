import countryCodes from 'utils/countryCodes';

export default function convertCurrency(currency, amount, baseCurrency = 'AED', invert = false, conversions = {}) {
  currency = currency.toUpperCase(); // eslint-disable-line no-param-reassign
  if (currency === 'AED') {
    return [currency, amount];
  }

  let rate = 1;
  if (currency === 'SAR') {
    rate = conversions.SAR || 0.98;
  } else if (currency === 'BHD') {
    rate = conversions.BHD || 9.75;
  } else if (currency === 'OMR') {
    rate = conversions.OMR || 9.55;
  } else if (currency === 'KWD') {
    rate = conversions.KWD || 12.13;
  } else {
    console.error('Currency not supported: ', currency);
  }

  if (invert) {
    amount /= rate; // eslint-disable-line no-param-reassign
  } else {
    amount *= rate; // eslint-disable-line no-param-reassign
  }
  currency = baseCurrency; // eslint-disable-line no-param-reassign

  return [currency, amount];
}

export const alpha3FromISDPhoneNumber = number => {
  if (!number) {
    return 'UAE';
  }

  const code = number.substring(1, 4);
  const alpha3 = (countryCodes.find(c => c['dial-code'] === code) || {})['alpha-3'] || 'ARE';
  // UAE is not alpha-3, ARE is; but risk expects UAE
  return alpha3 === 'ARE' ? 'UAE' : alpha3;
};
