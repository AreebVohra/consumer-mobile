import snakeToCamel from 'utils/snakeToCamel';

const serializeMerchantName = order => {
  if (order.rejectCallbackUrl == null || order.rejectCallbackUrl === '') {
    return '';
  }
  const regEx = /(http(s)?:\/\/(www)?(.+)\/)/i;
  const match = order.rejectCallbackUrl.match(regEx);
  const res = match[4] ? match[4].split('/')[0] : '';
  return res.slice(0, 1).toUpperCase() + res.slice(1);
};

const transformObject = obj => Object.keys(obj).reduce((o, prop) => {
  // eslint-disable-next-line no-param-reassign
  o[snakeToCamel(prop)] = obj[prop];
  return o;
}, {});

const orderSerializer = payload => {
  const result = transformObject(payload);
  result.merchantInfo = transformObject(result.merchantInfo);
  result.merchantName = serializeMerchantName(result);
  result.order = transformObject(result.order);
  result.isSaudiMerchant = result.merchantInfo.currency === 'SAR';

  return result;
};

export default orderSerializer;
