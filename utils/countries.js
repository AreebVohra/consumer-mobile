/* eslint-disable import/prefer-default-export */
export const isEmiratesFromPhone = phone => {
  if (!phone) {
    return true;
  }
  return phone.substring(0, 4) === '+971';
};

export const isSaudiFromPhone = phone => {
  if (!phone) {
    return false;
  }
  return phone.substring(0, 4) === '+966';
};
