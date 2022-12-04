/* eslint-disable camelcase */
const paymentMethodsSerializer = payload => {
  const serializeItem = method => {
    // eslint-disable-next-line camelcase
    const {
      card, is_default, pm_type, lean_bank_name, cooled_off, auto_debit,
    } = method;
    // eslint-disable-next-line camelcase
    const {
      number, type, expiration_month, expiration_year,
    } = card || {};
    const expiry = expiration_month && expiration_year
      ? `${expiration_month}/${expiration_year.slice(-2)}`
      : null;

    return {
      id: method.payment_method_id,
      number,
      type,
      // eslint-disable-next-line camelcase
      expiry,
      isDefault: is_default,
      pmType: pm_type,
      leanBankName: lean_bank_name,
      cooledOff: cooled_off,
      autoDebit: auto_debit,
    };
  };

  if (Array.isArray(payload)) {
    return payload.reduce((arr, method) => {
      arr.push(serializeItem(method));
      return arr;
    }, []);
  }

  return [];
};

export default paymentMethodsSerializer;
