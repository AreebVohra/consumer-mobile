import normalizeAll from 'utils/normalizeAll';
import { INSTALLMENT_STATUS_MISSED } from 'utils/constants';

export const serializeItem = (data, selectedList) => {
  const result = normalizeAll(data);

  result.selected = false;
  if (selectedList && selectedList.find(i => i.installmentsId === result.installmentsId)) {
    result.selected = true;
  }

  result.isMissed = false;
  if (result.installments) {
    result.isMissed = result.installments.some(i => i.status === INSTALLMENT_STATUS_MISSED);
  }

  return result;
};

export const installmentsSerializer = (payload, selectedList) => {
  if (Array.isArray(payload)) {
    return payload.map(inst => serializeItem(inst, selectedList)).filter(item => item.installments[0].status !== 'DRAFT');
  }
  return [];
};
