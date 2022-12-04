/* eslint-disable camelcase */
/* eslint-disable max-len */
import snakeToCamel from 'utils/snakeToCamel';
import normalizeAll from 'utils/normalizeAll';
import { INSTALLMENT_STATUS_MISSED } from 'utils/constants';

const normalizeFields = source => (res, prop) => {
  res[snakeToCamel(prop)] = source[prop];
  return res;
};

const orderDetailsSerializer = (data, selectedList) => {
  const result = [
    'order_id',
    // 'status',
    'order_number',
    'currency',
    'total',
    'reference',
    'display_reference',
    'gc_reference',
    'created_at',
    'first_installment_amount_aed',
  ].reduce(normalizeFields(data), {});

  result.displayReference = result.displayReference || result.reference;
  result.total = parseFloat(result.total);
  result.merchant = {
    ...normalizeAll(data.display_merchant),
    name: data.merchant.legal_business_name || '',
  };

  // Falg if set to True in case if installments has missed payments.
  result.isMissed = false;

  if (data.installments) {
    const source = data.installments;
    const paymentMethod = source.payment_method_id;
    const accountId = source.installments[0].installments_details.account_id;

    result.status = source.status;
    result.installmentsStatus = source.status;
    // Public ID of the installments
    result.installmentsId = source.installments_id;
    result.installmentsNumber = source.installments_number;
    result.installmentsAmount = parseFloat(source.amount);
    result.installmentsTotal = parseFloat(source.total);
    result.redeemedAmount = parseFloat(source.redeemed_amount);
    result.refundedAmount = parseFloat(source.refund_amount);
    result.processedAmount = parseFloat(source.processed_amount);
    result.installmentsCurrency = source.currency;
    result.lateFee = source.late_fee;
    result.installmentsAmountInclFee = parseFloat(source.amount_incl_fee || 0);
    // The payment method ID assigend for this instalments.
    result.paymentMethod = paymentMethod;

    // User Fee Details
    result.userFee = parseFloat(source.user_fee || 0).toFixed(2);
    result.isUpfrontFee = source.is_upfront_fee;
    result.feePerInstallment = parseFloat(source.fee_per_installment || 0).toFixed(2);

    // Transform list of payments(installments).
    result.installments = source.installments.map(inst => {
      const {
        installment_id,
        status,
        effective_at,
        amount,
        total,
        currency,
        updated_at,
        payment_method_id,
        refunded_transactions,
      } = inst;
      let refunded = null;

      if (status === INSTALLMENT_STATUS_MISSED) {
        result.isMissed = true;
      }

      if (Array.isArray(refunded_transactions)) {
        refunded = refunded_transactions.reduce((res, refund) => res + parseFloat(refund.processed_amount), 0);
      }

      return {
        id: installment_id,
        status,
        currency,
        amount: parseFloat(amount),
        total: parseFloat(total),
        date: effective_at,
        updatedAt: updated_at,
        paymentMethod: payment_method_id,
        refunded,
        accountId,
      };
    });

    result.firstInstallmentAmountAed = source.installments[0].first_installment_amount_aed;
  }

  result.selected = false;

  if (selectedList && selectedList.find(i => i.orderId === result.orderId)) {
    result.selected = true;
  }

  return result;
};

export default orderDetailsSerializer;
