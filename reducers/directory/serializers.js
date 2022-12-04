import snakeToCamel from 'utils/snakeToCamel';

const merchantSerializer = payload => Object.keys(payload).reduce((o, prop) => {
  // eslint-disable-next-line no-param-reassign
  o[snakeToCamel(prop)] = payload[prop];
  return o;
}, {});

const directorySerializer = payload => {
  const serializeItem = item => {
    const res = ['display_picture', 'display_category', 'display_name', 'display_url', 'logo', 'merchant_id'].reduce((itm, prop) => {
      // eslint-disable-next-line no-param-reassign
      itm[snakeToCamel(prop)] = item[prop];
      return itm;
    }, {});
    return res;
  };
  return payload.map(serializeItem);
};

export const merchantDetailsSerializer = payload => {
  const serializeItem = item => merchantSerializer(item);
  // eslint-disable-next-line no-param-reassign
  payload.merchants = payload.merchants.map(serializeItem);
  return payload;
};

export default directorySerializer;
