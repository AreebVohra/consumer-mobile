import snakeToCamel from 'utils/snakeToCamel';

const billingAddressesSerializer = payload => {
  const serializeItem = item => {
    const res = [
      'address1',
      'address2',
      'address3',
      'city',
      'country',
      'created_at',
      'is_default',
    ].reduce((itm, prop) => {
      // eslint-disable-next-line no-param-reassign
      itm[snakeToCamel(prop)] = item[prop];
      return itm;
    }, {});

    res.id = item.billing_address_id;
    res.zip = item.postal_code;

    return res;
  };

  return payload.map(serializeItem);
};

export default billingAddressesSerializer;
