import { INSTALLMENT_STATUS_SCHEDULED, INSTALLMENT_STATUS_MISSED } from './constants';

export const pickNextInstallment = item => {
  const source = (item || {}).installments || item;
  if (!source) return [];
  return (
    source.find(
      i => i.status === INSTALLMENT_STATUS_SCHEDULED || i.status === INSTALLMENT_STATUS_MISSED,
    )
  );
};

export const pickNextInstallments = item => {
  const source = (item || {}).installments || item;
  if (!source) return [];
  return (
    source.filter(
      i => i.status === INSTALLMENT_STATUS_SCHEDULED || i.status === INSTALLMENT_STATUS_MISSED,
    )
  );
};

export const pickNextInstallmentIndex = item => {
  const source = (item || {}).installments || item;
  if (!source) return;
  return (
    source.findIndex(
      i => i.status === INSTALLMENT_STATUS_SCHEDULED || i.status === INSTALLMENT_STATUS_MISSED,
    ) + 1
  );
};

export const checkIsLastInstallment = item => {
  const source = (item || {}).installments || item || [];
  const installmentList = source.filter(i => i.status === INSTALLMENT_STATUS_SCHEDULED || i.status === INSTALLMENT_STATUS_MISSED);
  console.log(installmentList, 'installment list');
  return installmentList.length === 1;
};
