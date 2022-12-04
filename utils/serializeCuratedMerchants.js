/* eslint-disable import/prefer-default-export */
import snakeToCamel from 'utils/snakeToCamel';

export const curatedMerchantSerializer = payload => {
  const serializeItem = item => {
    const res = ['merchant_id', 'merchantIds', 'display_name', 'display_url', 'display_picture', 'logo'].reduce(
      (itm, prop) => {
        // eslint-disable-next-line no-param-reassign
        itm[snakeToCamel(prop)] = item[prop];
        return itm;
      },
      {},
    );

    res.id = item.billing_address_id;
    res.zip = item.postal_code;

    return res;
  };

  return payload.map(serializeItem);
};
