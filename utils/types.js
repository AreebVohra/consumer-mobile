import PropTypes from 'prop-types';

export const LocationType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
    key: PropTypes.string,
    state: PropTypes.any,
  }),
]);

export const BillingAddressType = {
  id: PropTypes.string.isRequired,
  address1: PropTypes.string.isRequired,
  address2: PropTypes.string.isRequired,
  address3: PropTypes.string,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  zip: PropTypes.string.isRequired,
  isDefault: PropTypes.bool,
};

export const PaymentsType = {
  status: PropTypes.string.isRequire,
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequire,
  currency: PropTypes.string.isRequire,
  paymentMethod: PropTypes.string.isRequire,
};

export const InstallmentsType = {
  installmentsId: PropTypes.string.isRequired,
  installmentsNumber: PropTypes.string,
  paymentMethodId: PropTypes.string.isRequired,
  processedAmount: PropTypes.string,
  refundAmount: PropTypes.string,
  amount: PropTypes.string,
  total: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  order: PropTypes.shape({
    orderId: PropTypes.string,
    reference: PropTypes.string,
    displayReference: PropTypes.string,
    total: PropTypes.string,
    currency: PropTypes.string,
    taxAmount: PropTypes.string,
    shippingAmount: PropTypes.string,
    discount: PropTypes.string,
    createdAt: PropTypes.string,
    orderNumber: PropTypes.string,
  }),
  merchant: PropTypes.shape({
    displayName: PropTypes.string,
    favicon: PropTypes.shape({
      file: PropTypes.string,
    }),
  }),
  installments: PropTypes.arrayOf(PropTypes.shape(PaymentsType)),
  selected: PropTypes.bool,
  isMissed: PropTypes.bool,
};

export const OrderType = {
  orderId: PropTypes.string.isRequired,
  installments: PropTypes.arrayOf(PropTypes.shape(PaymentsType)),
  displayReference: PropTypes.string,
  reference: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  paymentMethod: PropTypes.string,
  merchant: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  isMissed: PropTypes.bool.isRequired,
};

export const PaymentMethodType = {
  id: PropTypes.string.isRequire,
  number: PropTypes.string.isRequire,
  type: PropTypes.string.isRequire,
  expiry: PropTypes.string.isRequire,
};

export const MerchantType = {
  merchantId: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  displayCategory: PropTypes.string,
  displayUrl: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  displayPicture: PropTypes.string.isRequired,
};

export const TranslatedStringType = PropTypes.oneOfType([PropTypes.element, PropTypes.string]);
