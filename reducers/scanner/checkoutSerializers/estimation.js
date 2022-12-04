import snakeToCamel from 'utils/snakeToCamel';

const transformObject = obj => Object.keys(obj).reduce((o, prop) => {
  // eslint-disable-next-line no-param-reassign
  o[snakeToCamel(prop)] = obj[prop];
  return o;
}, {});

const phaseMapper = phase => {
  const { date } = phase.calculated;
  // Accumulate payments for the phase into one single number
  const accumulatedPaymentAmount = phase.payments.reduce((paymentTotal, p) => {
    const { amount } = p.calculated;
    return paymentTotal + parseFloat(amount);
  }, 0);
  // Select currency for payment
  const currency = phase.payments.length && phase.payments[0].calculated.currency;
  const baseAmountAed = phase.payments.length && phase.payments[0].calculated.base_amount_aed;
  return {
    date,
    currency,
    amount: accumulatedPaymentAmount,
    baseAmountAed: baseAmountAed || 0,
  };
};

const calculatedTotal = payments => payments.reduce((t, p) => {
  // eslint-disable-next-line no-param-reassign
  t += p.amount;
  return t;
}, 0);

const pickDefaultCurrency = payments => (payments && payments.length && payments[0].currency) || 'USD';

const getFirstInstallmentInAed = payments => (payments && payments.length && payments[0].baseAmountAed) || 0;

export default function estimationSerializer(payload) {
  let estimations = payload.estimations || [];
  const { amount, currency } = payload;

  if (typeof estimations === 'string') {
    // Try to parse as JSON
    estimations = JSON.parse(payload.estimations.replace(/'/g, '"'));
  }

  return estimations.map(estimation => {
    const plan = transformObject(estimation);
    const {
      planId,
      slug,
      initialPhases,
      finalPhases,
      originalAmount,
      finalAmount,
      userFeeDetails,
      promoDetails,
    } = plan;
    const { hasUserFee, isUpfront, totalFee: userFeeAmount, feePerInstalment } = transformObject(
      userFeeDetails || {},
    );
    const { hasPromo, isCashbackDiscount, promoAmount } = transformObject(promoDetails || {});

    // Plan payments are divided onto inial and final phase with own payment
    // schedule in each. We map them separately and joining in a simple timeline
    const payments = initialPhases.map(phaseMapper).concat(finalPhases.map(phaseMapper));

    return {
      id: planId,
      originalTotal: parseFloat(originalAmount) || parseFloat(amount) || calculatedTotal(payments),
      total: parseFloat(finalAmount) || parseFloat(amount) || calculatedTotal(payments),
      currency: currency || pickDefaultCurrency(payments),
      userFeeDetails: {
        hasUserFee,
        isUpfront,
        userFeeAmount: parseFloat(userFeeAmount),
        feePerInstallment: parseFloat(feePerInstalment),
      },
      promoDetails: {
        hasPromo,
        isCashbackDiscount,
        promoAmount: parseFloat(promoAmount),
      },
      payments,
      slug,
      firstInstallmentAmountAed: getFirstInstallmentInAed(payments),
    };
  });
}
