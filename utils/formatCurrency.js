import convertCurrency from './convertCurrency';

/* eslint-disable import/prefer-default-export */
/* eslint-disable no-param-reassign */

// To localeString does not work well with android RN. Custom function must be used.
const defaultOptions = {
  significantDigits: 2,
  thousandsSeparator: ',',
  decimalSeparator: '.',
};

export const formatPaymentAmount = (value, options) => {
  if (typeof value !== 'string' && typeof value !== 'number') value = 0.0;
  if (typeof value === 'string') value = parseFloat(value);

  options = { ...defaultOptions, ...options };
  value = value.toFixed(options.significantDigits);

  const [currency, decimal] = value.split('.');
  return `${currency.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    options.thousandsSeparator,
  )}${options.decimalSeparator}${decimal}`;
};

export const formatPaymentAmountNoDecimal = (value, options) => {
  if (typeof value !== 'string' && typeof value !== 'number') value = 0.0;
  if (typeof value === 'string') value = parseFloat(value);

  options = { ...defaultOptions, ...options };
  value = value.toFixed(options.significantDigits);

  const [currency, decimal] = value.split('.');
  return `${currency.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    options.thousandsSeparator,
  )}`;
};

export default function formatCurrency(currency = 'AED', amount, convert = false, asterix = false) {
  if (!amount && amount !== 0) {
    return amount;
  }

  if (convert) {
    [currency, amount] = convertCurrency(currency, amount); // eslint-disable-line no-param-reassign
  }

  let displayText = `${currency.toUpperCase()} ${formatPaymentAmount(amount)}`;
  if (asterix) {
    displayText += '*';
  }
  return displayText;
}
