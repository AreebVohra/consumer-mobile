import snakeToCamel from 'utils/snakeToCamel';

const nextPaymentsSerializer = payload => {
  const serializeItem = item => {
    const res = ['effective_at', 'status', 'amount', 'total', 'currency'].reduce((itm, prop) => {
      // eslint-disable-next-line no-param-reassign
      itm[snakeToCamel(prop)] = item[prop];
      return itm;
    }, {});

    res.id = item.installment_id;
    res.amount = parseFloat(res.amount);
    res.total = parseFloat(res.total);
    res.externalKey = item.installments_details.external_key;

    if (item.order) {
      const { order } = item;
      const { merchant } = order;

      res.order = {
        orderId: order.order_id,
        displayReference: order.display_reference || order.reference,
      };

      if (merchant) {
        res.merchant = {
          name: merchant.display_name || merchant.legal_business_name,
          logo: merchant.logo,
          icon: merchant.favicon,
        };
      }
    }
    return res;
  };

  return payload.map(serializeItem);
};

export default nextPaymentsSerializer;
